// scripts/temporaryTooltip.js
import
{
    SVG_SPEAKER,
    TEMP_TOOLTIP_MAX_SELECTION_LENGTH,
    TEMP_TOOLTIP_AUTOCLOSE_SUCCESS_MS,
    TEMP_TOOLTIP_AUTOCLOSE_ERROR_MS
} from './config.js';
import * as tts from './tts.js';
import { fetchTooltipsForKeys } from './api.js';
import { state, setTemporaryTooltipRef } from './mainState.js';

/**
 * @file Manages the display of temporary tooltips, typically for selected text definitions.
 */

/**
 * Displays a temporary tooltip on the page, e.g., for showing definitions of selected text.
 * @param {string} text The content of the tooltip.
 * @param {object} position An object with `top`, `bottom`, `left` properties for positioning.
 * @param {string} [status="success"] "success" or "error" to style the tooltip.
 */
export function displayTemporaryTooltip (text, position, status = "success")
{
    // Remove existing temporary tooltip if any
    if (state.temporaryTooltipRef)
    {
        if (state.temporaryTooltipRef.dataset.autoCloseTimer)
        {
            clearTimeout(parseInt(state.temporaryTooltipRef.dataset.autoCloseTimer));
        }
        tts.cancelSpeech(); // Stop TTS from previous temp tooltip
        state.temporaryTooltipRef.remove();
        setTemporaryTooltipRef(null);
    }

    const tempTooltip = document.createElement("div");
    tempTooltip.setAttribute("role", status === "error" ? "alert" : "status");
    tempTooltip.id = "temporary-selection-tooltip"; // For identification
    Object.assign(tempTooltip.style, {
        position: "absolute",
        padding: "6px 12px",
        backgroundColor: status === "success" ? "rgba(30, 41, 59, 0.95)" : "rgba(185, 28, 28, 0.95)", // Dark blue-gray or red
        color: "#f1f5f9", // Light gray text
        borderRadius: "6px",
        fontSize: "13px",
        fontFamily: "sans-serif",
        zIndex: 2147483647, // Max z-index
        maxWidth: "350px",
        wordWrap: "break-word",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        pointerEvents: "auto", // Allow interaction
        border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border
        opacity: 0, // Start transparent for fade-in
        transform: 'translateY(5px)', // Start slightly offset for slide-in
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center'
    });

    const textContent = document.createElement('span');
    textContent.textContent = text;
    textContent.style.flexGrow = '1';
    textContent.style.paddingRight = tts.isSpeechSupported() && status === "success" ? '52px' : '20px'; // Space for buttons
    tempTooltip.appendChild(textContent);

    // --- Audio Button (only for success status and if TTS supported) ---
    if (tts.isSpeechSupported() && status === "success")
    {
        const audioBtn = document.createElement("button");
        Object.assign(audioBtn.style, {
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '0',
            color: 'rgba(255, 255, 255, 0.7)', marginLeft: '8px',
            position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', lineHeight: '1'
        });
        audioBtn.innerHTML = SVG_SPEAKER;
        audioBtn.setAttribute("aria-label", "Read definition aloud");
        audioBtn.setAttribute("title", "Read aloud");
        audioBtn.onmouseenter = () => audioBtn.style.color = 'rgba(255, 255, 255, 1)';
        audioBtn.onmouseleave = () => audioBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        audioBtn.onclick = (e) =>
        {
            e.stopPropagation();
            const textToSpeak = textContent.textContent;
            tts.speak(textToSpeak, null);
            // Prevent auto-close while speaking or after interacting
            if (state.temporaryTooltipRef && state.temporaryTooltipRef.dataset.autoCloseTimer)
            {
                clearTimeout(parseInt(state.temporaryTooltipRef.dataset.autoCloseTimer));
                state.temporaryTooltipRef.dataset.autoCloseTimer = ''; // Clear timer
            }
        };
        tempTooltip.appendChild(audioBtn);
    }

    // --- Close Button ---
    const closeButton = document.createElement("button");
    Object.assign(closeButton.style, {
        position: 'absolute', top: '3px', right: '3px', background: 'transparent', border: 'none',
        color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', cursor: 'pointer', padding: '0 4px',
        lineHeight: '1', fontWeight: 'bold', borderRadius: '50%', width: '20px', height: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    closeButton.textContent = '×'; // Multiplication sign as close icon
    closeButton.setAttribute("aria-label", "Close definition");
    closeButton.onmouseenter = () => closeButton.style.color = 'rgba(255, 255, 255, 1)';
    closeButton.onmouseleave = () => closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
    closeButton.onclick = (e) =>
    {
        e.stopPropagation();
        if (state.temporaryTooltipRef)
        {
            tts.cancelSpeech(); // Stop TTS if any
            state.temporaryTooltipRef.style.opacity = '0';
            state.temporaryTooltipRef.style.transform = 'translateY(5px)';
            if (state.temporaryTooltipRef.dataset.autoCloseTimer)
            {
                clearTimeout(parseInt(state.temporaryTooltipRef.dataset.autoCloseTimer));
            }
            setTimeout(() =>
            {
                if (state.temporaryTooltipRef) state.temporaryTooltipRef.remove();
                setTemporaryTooltipRef(null);
            }, 200); // Allow fade-out animation
        }
    };
    tempTooltip.appendChild(closeButton);

    // Position the tooltip based on selection or fallback
    position = position || { bottom: window.innerHeight / 2 + 10, left: window.innerWidth / 2, top: window.innerHeight / 2 - 10 };
    let topPos = (position.bottom || position.top || 0) + window.scrollY + 8; // Default below selection
    let leftPos = (position.left || 0) + window.scrollX;

    document.body.appendChild(tempTooltip);
    setTemporaryTooltipRef(tempTooltip); // Store reference

    // Calculate actual dimensions and adjust position
    const tooltipRect = tempTooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const margin = 5; // Viewport margin

    if (topPos + tooltipRect.height > viewportHeight + scrollY - margin)
    { // Overflow bottom
        topPos = (position.top || 0) + scrollY - tooltipRect.height - 8; // Place above
    }
    if (topPos < scrollY + margin) topPos = scrollY + margin; // Clamp to top

    leftPos = leftPos - (tooltipRect.width / 2); // Center horizontally
    if (leftPos < scrollX + margin) leftPos = scrollX + margin; // Clamp to left
    if (leftPos + tooltipRect.width > viewportWidth + scrollX - margin)
    { // Clamp to right
        leftPos = viewportWidth + scrollX - tooltipRect.width - margin;
    }

    tempTooltip.style.top = `${topPos}px`;
    tempTooltip.style.left = `${leftPos}px`;

    // Trigger fade-in and slide-in animation
    requestAnimationFrame(() =>
    {
        requestAnimationFrame(() =>
        { // Double requestAnimationFrame for styles to apply before transition
            tempTooltip.style.opacity = 1;
            tempTooltip.style.transform = 'translateY(0)';
        });
    });

    // Auto-close timer
    const autoCloseDuration = status === "success" ? TEMP_TOOLTIP_AUTOCLOSE_SUCCESS_MS : TEMP_TOOLTIP_AUTOCLOSE_ERROR_MS;
    const autoCloseTimer = setTimeout(() =>
    {
        // Check if this specific tooltip is still the active one
        if (state.temporaryTooltipRef === tempTooltip)
        {
            tts.cancelSpeech();
            closeButton.click(); // Gracefully close
        }
    }, autoCloseDuration);
    tempTooltip.dataset.autoCloseTimer = autoCloseTimer.toString();
}


/**
 * Fetches and displays a tooltip for the currently selected text on the page.
 * Triggered by a context menu click or a keyboard shortcut.
 */
export async function fetchAndShowSelectedTextTooltip ()
{
    if (!state.tooltipsEnabled)
    {
        console.log("Tooltips disabled, cannot fetch definition for selection.");
        return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText)
    {
        console.log("No text selected for definition lookup.");
        return;
    }

    let range, rect;
    try
    {
        if (!selection || selection.rangeCount === 0) throw new Error("No range in selection");
        range = selection.getRangeAt(0);
        const clientRects = range.getClientRects();
        // Use the first client rect if available, otherwise fall back to bounding rect.
        // This can be more accurate for multi-line selections.
        rect = clientRects.length > 0 ? clientRects[0] : range.getBoundingClientRect();
        rect = { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height }; // Make a plain object
        if (rect.width === 0 && rect.height === 0 && clientRects.length <= 1)
        { // Check if the rect is valid
            throw new Error("Selection rect has zero dimensions.");
        }
    } catch (e)
    {
        console.warn("Could not get precise selection geometry, using fallback position.", e);
        // Fallback position: center of the viewport
        rect = {
            top: window.innerHeight / 2 - 10,
            bottom: window.innerHeight / 2 + 10,
            left: window.innerWidth / 2,
            width: 0, height: 0 // Indicate fallback
        };
    }


    if (selectedText.length > TEMP_TOOLTIP_MAX_SELECTION_LENGTH)
    {
        console.log(`Selected text exceeds maximum length of ${TEMP_TOOLTIP_MAX_SELECTION_LENGTH}.`);
        displayTemporaryTooltip(
            `Selection too long (max ${TEMP_TOOLTIP_MAX_SELECTION_LENGTH} chars). Selected ${selectedText.length}.`,
            rect,
            "error"
        );
        return;
    }

    displayTemporaryTooltip("Fetching definition...", rect, "success"); // Initial "loading" message

    try
    {
        const responseData = await fetchTooltipsForKeys([selectedText]);
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
        console.log("Error fetching selected text tooltip:", error);
        displayTemporaryTooltip("Error fetching definition.", rect, "error");
    }
}