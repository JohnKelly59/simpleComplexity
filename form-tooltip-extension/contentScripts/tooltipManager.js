// scripts/tooltipManager.js
import
    {
        SVG_SPEAKER, SVG_REFRESH_ICON,
        MAX_REFRESH_COUNT, REFRESH_COOLDOWN_MS,
        STANDARD_TOOLTIP_HIDE_DELAY_MS, // Needed for hover
        EXTENDED_TOOLTIP_HIDE_DELAY_MS  // Needed for hover
    } from './config.js';
import * as tts from './tts.js';
import { fetchTooltipsForKeys } from './api.js';
import
    {
        state, getQuestion, updateQuestionMatrix,
        incrementRefreshCount, getRefreshCount,
        setLastRefreshTime, getLastRefreshTime
    } from './mainState.js';

/**
 * @file Manages the creation, display, and interaction of persistent tooltips on form fields.
 * Supports hover-to-show and click-to-stick behaviors.
 */

let hoverHideTimer = null;             // Timer for hiding tooltips shown on hover
let isTooltipSticky = false;           // Flag indicating if the tooltip is currently "stuck"
let currentStickyTriggerElement = null; // The icon element that made the tooltip sticky
let activeDocumentClickHandler = null; // Handler for 'click elsewhere' when sticky
let lastHoveredTriggerElement = null;  // Tracks the last element hovered to show a tooltip

/**
 * Creates the main tooltip container and injects it into the page.
 * @returns {object} References to the container, tooltip element, and shadow DOM.
 */
export function createTooltipContainer ()
{
    const container = document.createElement("div");
    container.id = "form-tooltip-container";
    Object.assign(container.style, {
        position: "fixed", top: "0", left: "0",
        width: "0", height: "0",
        pointerEvents: "none",
        zIndex: 2147483647,
    });
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
        .tooltip {
            position: absolute !important; padding: 4px 8px !important;
            background-color: rgba(0, 0, 0, 0.85) !important; color: #fff !important;
            border-radius: 4px !important; font-size: 12px !important;
            font-family: sans-serif !important; display: none;
            pointer-events: auto !important; white-space: normal !important;
            max-width: 250px !important; word-wrap: break-word !important;
            z-index: 1 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            line-height: 1.4;
        }
        .tooltip button {
            margin-left: 8px; cursor: pointer; border: none;
            background: transparent; color: #a7a7a7; font-size: 11px;
            border-radius: 3px; pointer-events: auto; vertical-align: middle;
            padding: 0; line-height: 1;
        }
        .tooltip button:hover { color: #ffffff; }
        .tooltip button svg { display: block; vertical-align: middle; }
        .tooltip button:disabled { cursor: not-allowed; opacity: 0.4; color: #777777 !important; }
        .tooltip-text { vertical-align: middle; }
    `;
    shadow.appendChild(style);

    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("tooltip");
    tooltipElement.setAttribute("role", "tooltip");
    shadow.appendChild(tooltipElement);

    // Event listeners for the tooltip body (for hover logic)
    tooltipElement.addEventListener("mouseenter", () =>
    {
        if (!isTooltipSticky)
        { // Only affect hover behavior
            clearHoverHideTimer();
        }
    });
    tooltipElement.addEventListener("mouseleave", () =>
    {
        if (!isTooltipSticky)
        { // Only affect hover behavior
            startHoverHideTimer(EXTENDED_TOOLTIP_HIDE_DELAY_MS);
        }
    });

    return { container, tooltip: tooltipElement, shadow };
}

// --- Core Show/Hide & State Management ---

function _clearStickyState ()
{
    if (activeDocumentClickHandler)
    {
        document.removeEventListener('click', activeDocumentClickHandler, true);
        activeDocumentClickHandler = null;
    }
    isTooltipSticky = false;
    currentStickyTriggerElement = null;
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.removeAttribute('data-sticky'); // Visual cue or state
    }
}

function _hideTooltipInternal ()
{
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.style.display = "none";
        tts.cancelSpeech();
    }
    // Do not clear sticky state here by default, only if explicitly told to or via _clearStickyState
}

/**
 * Hides the tooltip. If it was sticky, it clears the sticky state.
 * This is the main function to call to hide any kind of tooltip.
 */
export function hideTooltip ()
{
    _hideTooltipInternal();
    _clearStickyState(); // Ensure sticky state is cleared on any explicit hide
    clearHoverHideTimer(); // Also clear any pending hover hides
    lastHoveredTriggerElement = null;
}


function _populateAndPositionTooltip (triggerElement, field, forSticky = false)
{
    if (!state.tooltipsEnabled || !state.tooltipRefGlobal || !state.tooltipRefGlobal.tooltip) return;

    const tooltipElement = state.tooltipRefGlobal.tooltip;
    const supportsSpeech = tts.isSpeechSupported();
    const usedKey = field.dataset.keyUsed;
    const questionText = getQuestion(usedKey) || "No information available for this field.";

    tooltipElement.innerHTML = ""; // Clear previous content

    const textSpan = document.createElement("span");
    textSpan.classList.add("tooltip-text");
    textSpan.textContent = questionText;
    tooltipElement.appendChild(textSpan);

    // --- Refresh Button ---
    const refreshBtn = document.createElement("button");
    refreshBtn.setAttribute("aria-label", "Refresh definition");
    refreshBtn.innerHTML = SVG_REFRESH_ICON;
    const currentRefreshCount = getRefreshCount(usedKey);
    if (currentRefreshCount >= MAX_REFRESH_COUNT)
    {
        refreshBtn.disabled = true;
        refreshBtn.setAttribute("title", `Refresh limit reached (${MAX_REFRESH_COUNT} max)`);
    } else
    {
        refreshBtn.setAttribute("title", "Refresh definition");
    }
    refreshBtn.addEventListener("click", (clickEvent) =>
    {
        clickEvent.stopPropagation();
        if (refreshBtn.disabled) return;
        if (!isTooltipSticky && !forSticky) clearHoverHideTimer(); // Keep hover tooltip open during interaction

        const now = Date.now();
        const lastRefresh = getLastRefreshTime(usedKey);
        if (now - lastRefresh < REFRESH_COOLDOWN_MS)
        {
            const waitTime = ((REFRESH_COOLDOWN_MS - (now - lastRefresh)) / 1000).toFixed(1);
            const originalText = textSpan.textContent;
            textSpan.textContent = `Wait ${waitTime}s...`;
            setTimeout(() =>
            {
                if (tooltipElement.style.display === 'block' && tooltipElement.contains(textSpan) && textSpan.textContent === `Wait ${waitTime}s...`)
                {
                    textSpan.textContent = originalText;
                }
            }, 1500);
            if (!isTooltipSticky && !forSticky) startHoverHideTimer(EXTENDED_TOOLTIP_HIDE_DELAY_MS); // Restart timer if it was hover
            return;
        }
        setLastRefreshTime(usedKey, now);
        textSpan.textContent = "Refreshing...";
        refreshBtn.disabled = true;
        fetchTooltipsForKeys([usedKey])
            .then((data) =>
            { /* ... update text ... */
                if (data && data[usedKey])
                {
                    updateQuestionMatrix({ [usedKey]: data[usedKey] });
                    if (tooltipElement.style.display === 'block' && tooltipElement.contains(textSpan)) textSpan.textContent = data[usedKey];
                    incrementRefreshCount(usedKey);
                } else
                {
                    if (tooltipElement.style.display === 'block' && tooltipElement.contains(textSpan)) textSpan.textContent = getQuestion(usedKey) || "Refresh failed.";
                }
            })
            .catch((err) =>
            {
                if (tooltipElement.style.display === 'block' && tooltipElement.contains(textSpan)) textSpan.textContent = "Error refreshing.";
                console.log("Error during refresh fetch:", err);
            })
            .finally(() =>
            {
                if (getRefreshCount(usedKey) >= MAX_REFRESH_COUNT)
                {
                    if (tooltipElement.contains(refreshBtn)) refreshBtn.disabled = true;
                    refreshBtn.setAttribute("title", `Refresh limit reached (${MAX_REFRESH_COUNT} max)`);
                } else
                {
                    if (tooltipElement.contains(refreshBtn))
                    {
                        refreshBtn.disabled = false;
                        refreshBtn.setAttribute("title", "Refresh definition");
                    }
                }
                if (!isTooltipSticky && !forSticky && tooltipElement.style.display === 'block')
                {
                    // If interaction was quick and mouse left, the tooltip's own mouseleave will handle it.
                    // Or, if mouse is still over, this keeps it open a bit longer.
                    clearHoverHideTimer();
                }
            });
    });
    tooltipElement.appendChild(refreshBtn);

    // --- Audio Button ---
    if (supportsSpeech)
    {
        const audioBtn = document.createElement("button");
        audioBtn.setAttribute("aria-label", "Read tooltip aloud");
        audioBtn.setAttribute("title", "Read aloud");
        audioBtn.innerHTML = SVG_SPEAKER;
        audioBtn.addEventListener("click", (clickEvent) =>
        {
            clickEvent.stopPropagation();
            const textToSpeak = textSpan.textContent;
            tts.speak(textToSpeak, null);
            // For both hover and sticky, clicking audio should not immediately hide it.
            // If hover, it should extend its life. If sticky, it just stays.
            if (!isTooltipSticky && !forSticky)
            {
                clearHoverHideTimer(); // Keep open
                startHoverHideTimer(EXTENDED_TOOLTIP_HIDE_DELAY_MS * 2); // Give more time for listening
            }
        });
        tooltipElement.appendChild(audioBtn);
    }

    tooltipElement.style.display = "block";

    const iconRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;

    let potentialTop = iconRect.bottom + margin;
    let potentialLeft = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);

    if (potentialTop + tooltipRect.height > viewportHeight - margin) potentialTop = iconRect.top - tooltipRect.height - margin;
    if (potentialTop < margin) potentialTop = margin;
    if (potentialLeft < margin) potentialLeft = margin;
    if (potentialLeft + tooltipRect.width > viewportWidth - margin) potentialLeft = viewportWidth - tooltipRect.width - margin;

    tooltipElement.style.top = `${potentialTop}px`;
    tooltipElement.style.left = `${potentialLeft}px`;
}


// --- Hover Logic Exposed ---
export function startHoverHideTimer (delay = STANDARD_TOOLTIP_HIDE_DELAY_MS)
{
    if (isTooltipSticky) return; // Don't start hover timer if a tooltip is sticky
    clearHoverHideTimer();
    hoverHideTimer = setTimeout(() =>
    {
        // Check if it's sticky *now* or if the hover was on the sticky element's trigger
        if (!isTooltipSticky && state.tooltipRefGlobal.tooltip.style.display === 'block')
        {
            if (lastHoveredTriggerElement !== currentStickyTriggerElement)
            { // ensure we don't hide a newly sticky one
                _hideTooltipInternal();
            }
        }
        hoverHideTimer = null;
        lastHoveredTriggerElement = null;
    }, delay);
}

export function clearHoverHideTimer ()
{
    if (hoverHideTimer)
    {
        clearTimeout(hoverHideTimer);
        hoverHideTimer = null;
    }
}

export function showTooltipForHover (evt, field)
{
    const triggerElement = evt.currentTarget;
    lastHoveredTriggerElement = triggerElement;

    // If a tooltip is sticky and this hover is for ITS trigger, do nothing (it's already shown and sticky).
    if (isTooltipSticky && currentStickyTriggerElement === triggerElement)
    {
        clearHoverHideTimer(); // In case mouse left and re-entered quickly
        return;
    }

    // If a tooltip is sticky for a DIFFERENT trigger, a hover will temporarily show new content
    // but won't unstick the original one.
    // If no tooltip is sticky, this just shows a normal hover tooltip.

    clearHoverHideTimer();    // Clear any pending hide for previous hover
    _hideTooltipInternal();   // Hide any currently visible (potentially from another hover)
    // This won't clear sticky state of *another* element.

    _populateAndPositionTooltip(triggerElement, field, false);
}

// --- Sticky Logic Exposed ---
export function handleTooltipTriggerClick (evt, field)
{
    const clickedTrigger = evt.currentTarget;

    clearHoverHideTimer(); // Cancel any pending hover-hide action

    // Case 1: Clicking the currently sticky trigger again to close it.
    if (isTooltipSticky && currentStickyTriggerElement === clickedTrigger)
    {
        hideTooltip(); // This will also clear sticky state.
        return;
    }

    // Case 2: Clicking a trigger to make its tooltip sticky.
    // If another tooltip was sticky, unstick it.
    if (isTooltipSticky)
    {
        _clearStickyState(); // Unstick previous, but don't hide its content yet if it's the same element
    }
    _hideTooltipInternal(); // Hide whatever was visible (could be a hover tooltip)

    // Make the new one sticky
    isTooltipSticky = true;
    currentStickyTriggerElement = clickedTrigger;
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.setAttribute('data-sticky', 'true');
    }


    _populateAndPositionTooltip(clickedTrigger, field, true); // true for forSticky

    // Add "click elsewhere" listener
    // Use setTimeout to ensure this click event doesn't immediately trigger it
    setTimeout(() =>
    {
        // Check if the tooltip is still meant to be sticky for THIS trigger
        if (isTooltipSticky && currentStickyTriggerElement === clickedTrigger)
        {
            activeDocumentClickHandler = (event) =>
            {
                if (!state.tooltipRefGlobal || !state.tooltipRefGlobal.tooltip)
                {
                    _clearStickyState(); return;
                }
                const isClickInsideTooltip = state.tooltipRefGlobal.tooltip.contains(event.target);
                // Check if click is on the trigger that made it sticky
                const isClickOnStickyTrigger = currentStickyTriggerElement && currentStickyTriggerElement.contains(event.target);

                if (!isClickInsideTooltip && !isClickOnStickyTrigger)
                {
                    hideTooltip(); // This will clear sticky state and hide
                }
                // If click is on the sticky trigger, this handler does nothing;
                // the main handleTooltipTriggerClick function handles the toggle.
            };
            document.addEventListener('click', activeDocumentClickHandler, true);
        }
    }, 0);
}