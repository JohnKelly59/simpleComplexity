// tooltip.js

// All state and helper functions this module needs will be passed into the init function.
let state;
let helpers;

// Internal state for the tooltip module
let hoverHideTimer = null;
let isTooltipSticky = false;
let currentStickyTriggerElement = null;
let activeDocumentClickHandler = null;
let lastHoveredTriggerElement = null;

// Constants
const MAX_REFRESH_COUNT = 3;
const REFRESH_COOLDOWN_MS = 5000;
const STANDARD_TOOLTIP_HIDE_DELAY_MS = 300;
const EXTENDED_TOOLTIP_HIDE_DELAY_MS = 700;
const TEMP_TOOLTIP_MAX_SELECTION_LENGTH = 250;
const TEMP_TOOLTIP_AUTOCLOSE_SUCCESS_MS = 15000;
const TEMP_TOOLTIP_AUTOCLOSE_ERROR_MS = 8000;

// SVGs
const SVG_SPEAKER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`;
const SVG_REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/></svg>`;
const SVG_HELP_ICON_PATH = `<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v2h-2zm0 4h2v4h-2z"/><path fill="none" d="M0 0h24v24H0z"/>`;


/**
 * Initializes the tooltip module with necessary state and helper functions from the main SDK.
 * @param {object} sdkState - The main state object from the SDK.
 * @param {object} sdkHelpers - An object containing helper functions from the SDK.
 */
export function initTooltips (sdkState, sdkHelpers)
{
    state = sdkState;
    helpers = sdkHelpers;
}

function _clearStickyState ()
{
    if (activeDocumentClickHandler)
    {
        document.removeEventListener("click", activeDocumentClickHandler, true);
        activeDocumentClickHandler = null;
    }
    isTooltipSticky = false;
    currentStickyTriggerElement = null;
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.removeAttribute("data-sticky");
    }
}

function _hideTooltipInternal ()
{
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.style.display = "none";
        helpers.cancelSpeech();
    }
}

function clearHoverHideTimer ()
{
    if (hoverHideTimer)
    {
        clearTimeout(hoverHideTimer);
        hoverHideTimer = null;
    }
}

function startHoverHideTimer (delay = STANDARD_TOOLTIP_HIDE_DELAY_MS)
{
    if (isTooltipSticky) return;
    clearHoverHideTimer();
    hoverHideTimer = setTimeout(() =>
    {
        if (!isTooltipSticky && state.tooltipRefGlobal.tooltip.style.display === "block")
        {
            if (lastHoveredTriggerElement !== currentStickyTriggerElement)
            {
                _hideTooltipInternal();
            }
        }
        hoverHideTimer = null;
        lastHoveredTriggerElement = null;
    }, delay);
}


function _populateAndPositionTooltip (triggerElement, field, forSticky = false)
{
    if (!state.tooltipsEnabled || !state.tooltipRefGlobal || !state.tooltipRefGlobal.tooltip) return;

    const tooltipElement = state.tooltipRefGlobal.tooltip;
    const supportsSpeech = helpers.isSpeechSupported();
    const usedKey = field.dataset.keyUsed;
    const questionText = helpers.getQuestion(usedKey) || "No information available for this field.";

    tooltipElement.innerHTML = ""; // Clear previous content

    const textSpan = document.createElement("span");
    textSpan.classList.add("tooltip-text");
    textSpan.textContent = questionText;
    tooltipElement.appendChild(textSpan);

    // Refresh Button
    const refreshBtn = document.createElement("button");
    refreshBtn.setAttribute("aria-label", "Refresh definition");
    refreshBtn.innerHTML = SVG_REFRESH_ICON;

    if (helpers.getRefreshCount(usedKey) >= MAX_REFRESH_COUNT)
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
        if (!isTooltipSticky && !forSticky) clearHoverHideTimer();

        const now = Date.now();
        if (now - helpers.getLastRefreshTime(usedKey) < REFRESH_COOLDOWN_MS)
        {
            // Handle cooldown feedback
            return;
        }

        helpers.setLastRefreshTime(usedKey, now);
        textSpan.textContent = "Refreshing...";
        refreshBtn.disabled = true;

        helpers.fetchTooltipsForKeys([usedKey]).then((data) =>
        {
            if (data && data[usedKey])
            {
                helpers.updateQuestionMatrix({ [usedKey]: data[usedKey] });
                if (tooltipElement.style.display === "block") textSpan.textContent = data[usedKey];
                helpers.incrementRefreshCount(usedKey);
            } else
            {
                if (tooltipElement.style.display === "block") textSpan.textContent = helpers.getQuestion(usedKey) || "Refresh failed.";
            }
        }).catch(() =>
        {
            if (tooltipElement.style.display === "block") textSpan.textContent = "Error refreshing.";
        }).finally(() =>
        {
            if (helpers.getRefreshCount(usedKey) >= MAX_REFRESH_COUNT)
            {
                refreshBtn.disabled = true;
                refreshBtn.setAttribute("title", `Refresh limit reached (${MAX_REFRESH_COUNT} max)`);
            } else
            {
                refreshBtn.disabled = false;
                refreshBtn.setAttribute("title", "Refresh definition");
            }
            if (!isTooltipSticky && !forSticky) clearHoverHideTimer();
        });
    });
    tooltipElement.appendChild(refreshBtn);

    // Text-to-Speech Button
    if (supportsSpeech)
    {
        const audioBtn = document.createElement("button");
        audioBtn.setAttribute("aria-label", "Read tooltip aloud");
        audioBtn.setAttribute("title", "Read aloud");
        audioBtn.innerHTML = SVG_SPEAKER;
        audioBtn.addEventListener("click", (clickEvent) =>
        {
            clickEvent.stopPropagation();
            helpers.speak(textSpan.textContent, null);
            if (!isTooltipSticky && !forSticky)
            {
                clearHoverHideTimer();
                startHoverHideTimer(EXTENDED_TOOLTIP_HIDE_DELAY_MS * 2);
            }
        });
        tooltipElement.appendChild(audioBtn);
    }

    // Positioning logic
    tooltipElement.style.display = "block";
    const iconRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const margin = 8;
    let top = iconRect.bottom + margin;
    let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;

    if (top + tooltipRect.height > window.innerHeight - margin)
    {
        top = iconRect.top - tooltipRect.height - margin;
    }
    if (left < margin)
    {
        left = margin;
    }
    if (left + tooltipRect.width > window.innerWidth - margin)
    {
        left = window.innerWidth - tooltipRect.width - margin;
    }
    tooltipElement.style.top = `${top}px`;
    tooltipElement.style.left = `${left}px`;
}

function showTooltipForHover (evt, field)
{
    const triggerElement = evt.currentTarget;
    lastHoveredTriggerElement = triggerElement;
    if (isTooltipSticky && currentStickyTriggerElement === triggerElement)
    {
        clearHoverHideTimer();
        return;
    }
    clearHoverHideTimer();
    _hideTooltipInternal();
    _populateAndPositionTooltip(triggerElement, field, false);
}

function handleTooltipTriggerClick (evt, field)
{
    const clickedTrigger = evt.currentTarget;
    clearHoverHideTimer();
    if (isTooltipSticky && currentStickyTriggerElement === clickedTrigger)
    {
        hideTooltip();
        return;
    }
    if (isTooltipSticky)
    {
        _clearStickyState();
    }
    _hideTooltipInternal();
    isTooltipSticky = true;
    currentStickyTriggerElement = clickedTrigger;
    if (state.tooltipRefGlobal && state.tooltipRefGlobal.tooltip)
    {
        state.tooltipRefGlobal.tooltip.setAttribute("data-sticky", "true");
    }
    _populateAndPositionTooltip(clickedTrigger, field, true);

    setTimeout(() =>
    {
        if (isTooltipSticky && currentStickyTriggerElement === clickedTrigger)
        {
            activeDocumentClickHandler = (event) =>
            {
                const isClickInside = state.tooltipRefGlobal.tooltip.contains(event.target);
                const isClickOnTrigger = currentStickyTriggerElement && currentStickyTriggerElement.contains(event.target);
                if (!isClickInside && !isClickOnTrigger)
                {
                    hideTooltip();
                }
            };
            document.addEventListener("click", activeDocumentClickHandler, true);
        }
    }, 0);
}


// --- EXPORTED FUNCTIONS ---

/**
 * Globally enables or disables all tooltip functionality.
 * @param {boolean} enabled - Whether to enable or disable tooltips.
 */
export function toggleTooltipsGlobal (enabled)
{
    localStorage.setItem(helpers.TOOLTIPS_ENABLED_STORAGE_KEY, String(enabled));
    state.tooltipsEnabled = enabled;

    if (!enabled)
    {
        removeAllTooltipIcons();
        helpers.disconnectObserver();
    } else
    {
        removeAllTooltipIcons();
        helpers.resetRefreshTracking();
        if (!state.tooltipRefGlobal) helpers.setTooltipRef(createTooltipContainer());
        const keys = helpers.gatherKeysFromAllFields();
        if (keys.length > 0)
        {
            helpers.fetchTooltipsForKeys(keys).then(data =>
            {
                helpers.updateQuestionMatrix(data);
                helpers.processAllFormFields();
            }).finally(helpers.observeDynamicFields);
        } else
        {
            helpers.observeDynamicFields();
        }
    }
    helpers.updateSpeedDialAppearance(state.speedDialRef, enabled);
}


export function createTooltipContainer ()
{
    const container = document.createElement("div");
    container.id = "form-tooltip-container";
    Object.assign(container.style, {
        position: "fixed", top: "0", left: "0", width: "0", height: "0",
        pointerEvents: "none", zIndex: 2147483647
    });
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: "open" });
    shadow.innerHTML = `
        <style>
            .tooltip {
                position: absolute !important; padding: 4px 8px !important;
                background-color: rgba(0, 0, 0, 0.85) !important; color: #fff !important;
                border-radius: 4px !important; font-size: 12px !important;
                font-family: sans-serif !important; display: none;
                pointer-events: auto !important; max-width: 250px !important;
                word-wrap: break-word !important; z-index: 1 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3); line-height: 1.4;
            }
            .tooltip button { margin-left: 8px; cursor: pointer; border: none; background: transparent; color: #a7a7a7; }
            .tooltip button:hover { color: #ffffff; }
            .tooltip-text { vertical-align: middle; }
        </style>
    `;

    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("tooltip");
    tooltipElement.setAttribute("role", "tooltip");
    shadow.appendChild(tooltipElement);

    tooltipElement.addEventListener("mouseenter", () =>
    {
        if (!isTooltipSticky) clearHoverHideTimer();
    });
    tooltipElement.addEventListener("mouseleave", () =>
    {
        if (!isTooltipSticky) startHoverHideTimer(EXTENDED_TOOLTIP_HIDE_DELAY_MS);
    });

    return { container, tooltip: tooltipElement, shadow };
}

export function hideTooltip ()
{
    _hideTooltipInternal();
    _clearStickyState();
    clearHoverHideTimer();
    lastHoveredTriggerElement = null;
}

export function addTooltipToField (field)
{
    if (!field || field.dataset.tooltipInjected === "true" || !state.tooltipsEnabled) return;
    if (!field.closest("form") || field.offsetParent === null) return;

    const key = helpers.determineBestKey(field);
    if (!key || !helpers.getQuestion(key)) return;

    field.dataset.keyUsed = key;
    field.dataset.tooltipInjected = "true";

    const iconContainer = document.createElement("span");
    iconContainer.classList.add("tooltip-icon-container");
    Object.assign(iconContainer.style, {
        display: "inline-flex", alignItems: "center", marginLeft: "5px",
        verticalAlign: "middle", position: "relative", zIndex: "1000", cursor: "pointer"
    });

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("width", "24");
    icon.setAttribute("height", "24");
    icon.style.fill = "#555";
    icon.innerHTML = SVG_HELP_ICON_PATH;

    icon.addEventListener("mouseenter", (evt) => showTooltipForHover(evt, field));
    icon.addEventListener("mouseleave", () => startHoverHideTimer());
    icon.addEventListener("focus", (evt) => showTooltipForHover(evt, field));
    icon.addEventListener("blur", () => startHoverHideTimer());
    icon.addEventListener("click", (evt) =>
    {
        evt.stopPropagation();
        handleTooltipTriggerClick(evt, field);
    });

    iconContainer.appendChild(icon);
    field.insertAdjacentElement("afterend", iconContainer);
}


export function removeAllTooltipIcons ()
{
    document.querySelectorAll(".tooltip-icon-container").forEach((iconContainer) =>
    {
        const field = iconContainer.previousElementSibling;
        if (field && field.dataset)
        {
            field.dataset.tooltipInjected = "false";
            delete field.dataset.keyUsed;
        }
        iconContainer.remove();
    });
}


export function displayTemporaryTooltip (text, position, status = "success")
{
    // Hide any existing temporary tooltip
    if (state.temporaryTooltipRef)
    {
        if (state.temporaryTooltipRef.dataset.autoCloseTimer)
        {
            clearTimeout(parseInt(state.temporaryTooltipRef.dataset.autoCloseTimer));
        }
        helpers.cancelSpeech();
        state.temporaryTooltipRef.remove();
        helpers.setTemporaryTooltipRef(null);
    }

    const tempTooltip = document.createElement("div");
    Object.assign(tempTooltip.style, {
        position: "absolute", padding: "6px 12px",
        backgroundColor: status === "success" ? "rgba(30, 41, 59, 0.95)" : "rgba(185, 28, 28, 0.95)",
        color: "#f1f5f9", borderRadius: "6px", fontSize: "13px",
        zIndex: 2147483647, maxWidth: "350px", pointerEvents: "auto",
    });
    tempTooltip.textContent = text;

    // Positioning logic
    const top = (position.bottom || position.top || 0) + window.scrollY + 8;
    const left = (position.left || 0) + window.scrollX - (tempTooltip.offsetWidth / 2);
    tempTooltip.style.top = `${top}px`;
    tempTooltip.style.left = `${left}px`;

    document.body.appendChild(tempTooltip);
    helpers.setTemporaryTooltipRef(tempTooltip);

    const autoCloseDuration = status === "success" ? TEMP_TOOLTIP_AUTOCLOSE_SUCCESS_MS : TEMP_TOOLTIP_AUTOCLOSE_ERROR_MS;
    const timer = setTimeout(() =>
    {
        if (state.temporaryTooltipRef === tempTooltip)
        {
            tempTooltip.remove();
            helpers.setTemporaryTooltipRef(null);
        }
    }, autoCloseDuration);
    tempTooltip.dataset.autoCloseTimer = timer.toString();
}

export async function fetchAndShowSelectedTextTooltip ()
{
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (!selectedText) return;

    let rect;
    try
    {
        rect = selection.getRangeAt(0).getBoundingClientRect();
    } catch (e)
    {
        rect = { top: window.innerHeight / 2, left: window.innerWidth / 2, bottom: window.innerHeight / 2, width: 0, height: 0 };
    }

    if (selectedText.length > TEMP_TOOLTIP_MAX_SELECTION_LENGTH)
    {
        displayTemporaryTooltip(`Selection too long (max ${TEMP_TOOLTIP_MAX_SELECTION_LENGTH} chars).`, rect, "error");
        return;
    }

    displayTemporaryTooltip("Fetching definition...", rect, "success");
    try
    {
        const responseData = await helpers.fetchTooltipsForKeys([selectedText]);
        const tooltipText = responseData ? responseData[selectedText] : null;
        if (tooltipText)
        {
            displayTemporaryTooltip(tooltipText, rect, "success");
        } else
        {
            displayTemporaryTooltip(`No definition found for "${selectedText}"`, rect, "error");
        }
    } catch (error)
    {
        displayTemporaryTooltip("Error fetching definition.", rect, "error");
    }
}