// scripts/domObserver.js
import { MUTATION_OBSERVER_DEBOUNCE_MS, DYNAMIC_FIELD_MATCH_SELECTOR } from './config.js';
import { determineBestKey } from './utils.js';
import { addTooltipToField } from './fieldProcessor.js';
import { fetchTooltipsForKeys } from './api.js';
import { state, getQuestion, updateQuestionMatrix } from './mainState.js';

/**
 * @file Observes the DOM for dynamically added or modified form fields
 * and attaches tooltips to them.
 */

let observer = null;
let debounceTimer = null;

/**
 * Processes a list of fields that might need tooltips.
 * Fetches new tooltip data if necessary, then adds icons.
 * @param {HTMLElement[]} fieldsToProcess Array of field elements.
 */
function processPotentiallyNewFields (fieldsToProcess)
{
    if (fieldsToProcess.length === 0) return;

    const uniqueFields = [...new Set(fieldsToProcess)];
    const fieldsToAddIcons = uniqueFields.filter(f =>
        f.offsetParent !== null &&      // Visible
        !f.disabled &&                  // Not disabled
        f.closest('form') &&            // Inside a form
        f.dataset.tooltipInjected !== "true" // Not already processed
    );

    if (fieldsToAddIcons.length > 0)
    {
        const newKeysToFetch = fieldsToAddIcons
            .map(f =>
            {
                const key = determineBestKey(f);
                if (key) f.dataset.potentialKey = key; // Temporarily store for later use
                return key;
            })
            .filter(key => key && !getQuestion(key)); // Only fetch keys we don't have data for

        const uniqueNewKeys = [...new Set(newKeysToFetch)];

        const applyTooltipsToFields = () =>
        {
            fieldsToAddIcons.forEach(field =>
            {
                // Re-check conditions as DOM might have changed during async fetch
                if (field.offsetParent !== null && !field.disabled && field.closest('form') && field.dataset.tooltipInjected !== "true")
                {
                    const key = field.dataset.potentialKey || determineBestKey(field); // Use stored or re-determine
                    if (key && getQuestion(key))
                    { // Ensure we have the question data now
                        addTooltipToField(field);
                    }
                    delete field.dataset.potentialKey; // Clean up
                }
            });
        };

        if (uniqueNewKeys.length > 0)
        {
            console.log('Fetching tooltips for dynamically added/updated keys:', uniqueNewKeys);
            fetchTooltipsForKeys(uniqueNewKeys)
                .then(newData =>
                {
                    updateQuestionMatrix(newData);
                    applyTooltipsToFields();
                })
                .catch(err =>
                {
                    console.log("Error fetching dynamic tooltips:", err);
                    applyTooltipsToFields(); // Attempt to apply with existing data anyway
                });
        } else
        {
            // No new keys to fetch, but existing keys might now apply to new fields
            applyTooltipsToFields();
        }
    }
}


/**
 * Initializes a MutationObserver to watch for dynamically added form fields.
 */
export function observeDynamicFields ()
{
    if (!window.MutationObserver)
    {
        console.warn("MutationObserver not supported, dynamic fields won't get tooltips automatically.");
        return;
    }

    if (observer) observer.disconnect(); // Disconnect previous observer if any

    observer = new MutationObserver((mutations) =>
    {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() =>
        {
            if (!state.tooltipsEnabled) return; // Don't process if tooltips are off

            let potentiallyAddedOrModifiedFields = [];
            mutations.forEach((mutation) =>
            {
                // Check for added nodes
                mutation.addedNodes.forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE)
                    {
                        // Check if the node itself is a field
                        if (node.matches?.(DYNAMIC_FIELD_MATCH_SELECTOR))
                        {
                            potentiallyAddedOrModifiedFields.push(node);
                        }
                        // Check for fields within the added node
                        potentiallyAddedOrModifiedFields.push(...node.querySelectorAll?.(DYNAMIC_FIELD_MATCH_SELECTOR));
                    }
                });

                // Check for attribute changes on existing fields (e.g., 'disabled' removed, or id/name changed)
                if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE)
                {
                    if (mutation.target.matches?.(DYNAMIC_FIELD_MATCH_SELECTOR))
                    {
                        // If a field became enabled, or its key might have changed
                        if (mutation.attributeName === 'disabled' || mutation.attributeName === 'id' || mutation.attributeName === 'name' || mutation.attributeName === 'data-tooltip-key' || mutation.attributeName === 'placeholder')
                        {
                            // If it was previously injected, remove the old icon to re-evaluate
                            if (mutation.target.dataset.tooltipInjected === "true")
                            {
                                const iconContainer = mutation.target.nextElementSibling;
                                if (iconContainer && iconContainer.classList.contains('tooltip-icon-container'))
                                {
                                    iconContainer.remove();
                                }
                                mutation.target.dataset.tooltipInjected = "false";
                                delete mutation.target.dataset.keyUsed;
                            }
                            potentiallyAddedOrModifiedFields.push(mutation.target);
                        }
                    }
                }
            });

            if (potentiallyAddedOrModifiedFields.length > 0)
            {
                processPotentiallyNewFields(potentiallyAddedOrModifiedFields.filter(Boolean));
            }
        }, MUTATION_OBSERVER_DEBOUNCE_MS);
    });

    observer.observe(document.body || document.documentElement, {
        childList: true,    // Observe direct children being added or removed
        subtree: true,      // Observe all descendants
        attributes: true,   // Observe attribute changes
        attributeFilter: ['disabled', 'style', 'class', 'id', 'name', 'data-tooltip-key', 'placeholder'] // Specific attributes
    });
    console.log("MutationObserver initialized for dynamic fields.");
}

/**
 * Disconnects the MutationObserver.
 */
export function disconnectObserver ()
{
    if (observer)
    {
        observer.disconnect();
        observer = null;
        if (debounceTimer) clearTimeout(debounceTimer);
        console.log("MutationObserver disconnected.");
    }
}