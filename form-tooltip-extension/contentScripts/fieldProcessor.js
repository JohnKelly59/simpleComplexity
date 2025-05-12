// scripts/fieldProcessor.js
import { SVG_HELP_ICON_PATH, FORM_FIELD_SELECTOR } from './config.js';
import { determineBestKey } from './utils.js';
// Import all necessary functions from tooltipManager
import
{
    showTooltipForHover,
    startHoverHideTimer,
    clearHoverHideTimer, // Though icon mouseenter calls showTooltipForHover which calls this
    handleTooltipTriggerClick,
    hideTooltip // General hide if needed, though usually managed by tooltipManager
} from './tooltipManager.js';
import { state, getQuestion } from './mainState.js';

/**
 * @file Responsible for finding form fields and attaching tooltip icons to them.
 */

export function addTooltipToField (field)
{
    if (!field || field.dataset.tooltipInjected === "true" || !state.tooltipsEnabled) return;
    if (!field.closest('form') || field.offsetParent === null) return;

    const key = determineBestKey(field);
    if (!key || !getQuestion(key))
    {
        return;
    }

    field.dataset.keyUsed = key;
    field.dataset.tooltipInjected = "true";

    const iconContainer = document.createElement("span");
    iconContainer.classList.add("tooltip-icon-container");
    Object.assign(iconContainer.style, {
        display: "inline-flex", alignItems: "center", marginLeft: "5px",
        verticalAlign: "middle", position: "relative", zIndex: "1000",
        cursor: "pointer",
    });

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "24");
    icon.setAttribute("height", "24");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-label", "Help Information");
    icon.setAttribute("role", "button");
    icon.setAttribute("tabindex", "0");
    icon.style.fill = "#555";
    icon.style.display = 'block';
    icon.innerHTML = SVG_HELP_ICON_PATH;

    // --- Event listeners for hover ---
    icon.addEventListener("mouseenter", (evt) => showTooltipForHover(evt, field));
    icon.addEventListener("focus", (evt) => showTooltipForHover(evt, field)); // Accessibility for hover
    icon.addEventListener("mouseleave", () => startHoverHideTimer()); // Default delay
    icon.addEventListener("blur", () => startHoverHideTimer());      // Accessibility for hover

    // --- Event listener for click (to make sticky or toggle) ---
    icon.addEventListener("click", (evt) =>
    {
        evt.stopPropagation(); // Prevent click from bubbling to document if not intended
        handleTooltipTriggerClick(evt, field);
    });

    // Keyboard accessibility for click (Enter/Space)
    icon.addEventListener("keydown", (evt) =>
    {
        if (evt.key === "Enter" || evt.key === " ")
        {
            evt.preventDefault();
            evt.stopPropagation();
            handleTooltipTriggerClick(evt, field); // Simulate click for sticky
        }
    });

    iconContainer.appendChild(icon);

    // Icon placement logic (remains the same)
    const fieldParent = field.parentNode;
    let fieldLabel = field.id ? document.querySelector(`label[for="${field.id}"]`) : null;
    if (fieldLabel && field.nextElementSibling === fieldLabel)
    {
        fieldLabel.insertAdjacentElement("afterend", iconContainer);
    } else if (field.labels && field.labels.length > 0 && field.labels[0] === fieldParent)
    {
        field.insertAdjacentElement('afterend', iconContainer);
    } else
    {
        field.insertAdjacentElement("afterend", iconContainer);
    }
}

// processAllFormFields, gatherKeysFromAllFields, removeAllTooltipIcons remain the same
// ... (copy the rest of these functions from your existing fieldProcessor.js) ...
/**
 * Processes all eligible form fields on the page and adds tooltip icons.
 */
export function processAllFormFields ()
{
    if (!state.tooltipsEnabled || !state.tooltipRefGlobal) return;

    document.querySelectorAll(FORM_FIELD_SELECTOR).forEach((field) =>
    {
        if (field.offsetParent !== null)
        { // Check if field is visible
            addTooltipToField(field);
        }
    });
}

/**
 * Gathers all unique keys (labels/names) from visible form fields on the page.
 * @returns {string[]} An array of unique keys.
 */
export function gatherKeysFromAllFields ()
{
    const keys = new Set();
    document.querySelectorAll(FORM_FIELD_SELECTOR).forEach((field) =>
    {
        if (field.offsetParent !== null && !field.disabled && field.closest('form'))
        {
            const key = determineBestKey(field);
            if (key) keys.add(key);
        }
    });
    return Array.from(keys);
}

/**
 * Removes all tooltip icons and associated data attributes from fields.
 */
export function removeAllTooltipIcons ()
{
    document.querySelectorAll(".tooltip-icon-container").forEach((iconContainer) =>
    {
        let fieldElement = iconContainer.previousElementSibling;

        if (fieldElement && (fieldElement.tagName === 'INPUT' || fieldElement.tagName === 'TEXTAREA' || fieldElement.tagName === 'SELECT'))
        {
            // Standard case
        } else if (iconContainer.parentElement)
        {
            let potentialField = null;
            const children = Array.from(iconContainer.parentElement.childNodes);
            const iconIndex = children.indexOf(iconContainer);
            if (iconIndex > 0)
            {
                const prevSibling = children[iconIndex - 1];
                if (prevSibling && (prevSibling.tagName === 'INPUT' || prevSibling.tagName === 'TEXTAREA' || prevSibling.tagName === 'SELECT'))
                {
                    potentialField = prevSibling;
                }
            }
            if (!potentialField)
            {
                potentialField = Array.from(iconContainer.parentElement.querySelectorAll('input, textarea, select')).find(
                    el => el.nextElementSibling === iconContainer || (el.parentElement.isSameNode(iconContainer.parentElement) && el.compareDocumentPosition(iconContainer) & Node.DOCUMENT_POSITION_FOLLOWING)
                );
            }
            fieldElement = potentialField || fieldElement;
        }

        if (fieldElement && fieldElement.dataset)
        {
            fieldElement.dataset.tooltipInjected = "false";
            delete fieldElement.dataset.keyUsed;
        }
        iconContainer.remove();
    });
}