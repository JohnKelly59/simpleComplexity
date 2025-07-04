// scripts/utils.js

/**
 * @file Provides miscellaneous utility functions.
 */

/**
 * Determines if the current browser is Safari.
 * @returns {boolean} True if the browser is Safari, false otherwise.
 */
export function isSafari ()
{
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Determines if the document body's background color is light or dark.
 * Used for selecting an appropriate icon color.
 * @returns {boolean} True if the background is light, false otherwise.
 */
export function isBackgroundLight ()
{
    try
    {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3)
        {
            const [r, g, b] = rgb.map((x) => parseInt(x, 10));
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128;
        }
    } catch (e)
    {
        console.warn("Could not determine background color, defaulting to light.", e);
    }
    return true; // Default to light background
}

/**
 * Tries to determine the best key (label or name) for a given form field
 * to use for fetching its tooltip.
 * @param {HTMLElement} field The form field element.
 * @returns {string|null} The determined key, or null if no suitable key is found.
 */
export function determineBestKey (field)
{
    if (field.labels && field.labels.length > 0 && field.labels[0].textContent.trim())
    {
        return field.labels[0].textContent.trim();
    }
    if (field.id)
    {
        const labelElement = document.querySelector(`label[for="${field.id}"]`);
        if (labelElement && labelElement.textContent.trim())
        {
            return labelElement.textContent.trim();
        }
    }

    if (field.dataset.tooltipKey && field.dataset.tooltipKey.trim())
    {
        return field.dataset.tooltipKey.trim();
    }

    const baseKey = field.name || field.id || null;
    if (baseKey) return baseKey;

    if (field.tagName.toLowerCase() === "select")
    {
        if (field.options && field.options.length > 0)
        {
            for (let i = 0; i < field.options.length; i++)
            {
                const optionText = field.options[i].text.trim();
                // Avoid generic placeholder options
                if (optionText && !/^(select|choose|\-\-|please select|select an option)/i.test(optionText) && field.options[i].value !== '')
                {
                    return optionText;
                }
            }
            const firstOptionText = field.options[0]?.text.trim();
            return firstOptionText || "Select field"; // Fallback for select
        }
        return "Select field"; // Default for empty select
    }

    if (field.placeholder && field.placeholder.trim())
    {
        return field.placeholder.trim();
    }

    const ariaLabel = field.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim())
    {
        return ariaLabel.trim();
    }
    const ariaLabelledBy = field.getAttribute('aria-labelledby');
    if (ariaLabelledBy)
    {
        const labelledByElement = document.getElementById(ariaLabelledBy);
        if (labelledByElement && labelledByElement.textContent.trim())
        {
            return labelledByElement.textContent.trim();
        }
    }

    return null; // No suitable key found
}