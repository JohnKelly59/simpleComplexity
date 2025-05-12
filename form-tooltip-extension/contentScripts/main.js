// scripts/main.js
import
{
    state, updateQuestionMatrix, setTooltipsEnabled as setGlobalTooltipsEnabled,
    setTooltipRef, setSpeedDialRef, resetRefreshTracking
} from './mainState.js';
import { initTTS, cancelSpeech as cancelAllTTS } from './tts.js';
import { fetchTooltipsForKeys } from './api.js';
import { createTooltipContainer } from './tooltipManager.js';
import { fetchAndShowSelectedTextTooltip } from './temporaryTooltip.js';
import
{
    processAllFormFields, gatherKeysFromAllFields,
    removeAllTooltipIcons,
} from './fieldProcessor.js';
import { observeDynamicFields, disconnectObserver } from './domObserver.js';
import { createSpeedDial, updateSpeedDialAppearance } from './speedDial.js';

/**
 * @file Main entry point for the content script.
 * Initializes all modules and handles coordination and global state changes.
 */

/**
 * Toggles the global enabled state of tooltips and updates the UI accordingly.
 * @param {boolean} enabled Whether to enable or disable tooltips.
 */
function toggleTooltipsGlobal (enabled)
{
    const changed = state.tooltipsEnabled !== enabled;
    setGlobalTooltipsEnabled(enabled);

    if (!changed && document.querySelector(".tooltip-icon-container"))
    { // If already in correct state but icons exist/don't exist
        if (enabled && !document.querySelector(".tooltip-icon-container"))
        {
            // Force re-initialization if enabled but no icons (e.g. after error)
        } else if (!enabled && document.querySelector(".tooltip-icon-container"))
        {
            // Force removal if disabled but icons exist
            removeAllTooltipIcons();
            updateSpeedDialAppearance(enabled);
            return;
        } else if (enabled && document.querySelector(".tooltip-icon-container"))
        {
            // Already enabled and icons present, do nothing.
            return;
        }
    }


    if (!enabled)
    {   // Hide any active persistent tooltip
        removeAllTooltipIcons();
        // No need to explicitly hide temporary tooltip here, as it's managed separately
        // and new ones won't be created if tooltipsEnabled is false.
        disconnectObserver(); // Stop observing DOM changes when disabled
        console.log("Form field tooltips disabled.");
    } else
    {
        console.log("Form field tooltips enabled. Processing fields...");
        // Re-initialize or refresh everything
        removeAllTooltipIcons(); // Clear old state
        resetRefreshTracking();  // Reset refresh counts for a fresh start

        // Ensure tooltip container exists or is recreated if it was somehow removed
        if (!state.tooltipRefGlobal || !document.getElementById('form-tooltip-container'))
        {
            const tooltipUI = createTooltipContainer();
            if (tooltipUI) setTooltipRef(tooltipUI);
        }

        const keys = gatherKeysFromAllFields();
        if (keys.length > 0)
        {
            fetchTooltipsForKeys(keys)
                .then((data) =>
                {
                    updateQuestionMatrix(data);
                    processAllFormFields(); // Add icons based on fetched data
                    console.log(`Processed ${Object.keys(data).length} tooltips on enable.`);
                })
                .catch(err =>
                {
                    console.log("Error fetching tooltips on enable:", err);
                    // Still process fields, maybe some data is stale but usable, or no data is fine
                    processAllFormFields();
                })
                .finally(() =>
                {
                    observeDynamicFields(); // Start observing after initial processing
                });
        } else
        {
            processAllFormFields(); // Process even if no keys (e.g. to show "no data" if applicable)
            observeDynamicFields(); // Start observing
        }
    }
    updateSpeedDialAppearance(enabled);
}


/**
 * Initializes all tooltip functionalities.
 * Fetches initial data, sets up DOM elements, and observers.
 */
function initialize ()
{
    if (!document.body)
    {
        console.warn("Document body not ready for tooltip initialization. Retrying...");
        setTimeout(initialize, 100);
        return;
    }
    console.log("Initializing tooltips system...");

    initTTS(); // Initialize Text-to-Speech engine

    // Create persistent tooltip UI
    // Check if it exists from a previous script run (e.g., extension reloaded)
    let tooltipUI = state.tooltipRefGlobal;
    const existingTooltipContainer = document.getElementById('form-tooltip-container');
    if (!tooltipUI && existingTooltipContainer && existingTooltipContainer.shadowRoot)
    {
        tooltipUI = {
            container: existingTooltipContainer,
            tooltip: existingTooltipContainer.shadowRoot.querySelector('.tooltip'),
            shadow: existingTooltipContainer.shadowRoot
        };
    } else if (!tooltipUI)
    {
        tooltipUI = createTooltipContainer();
    }
    if (tooltipUI) setTooltipRef(tooltipUI);


    // Create Speed Dial UI
    let speedDialUI = state.speedDialRef;
    const existingSpeedDial = document.getElementById('tooltipSpeedDial');
    if (!speedDialUI && existingSpeedDial)
    {
        speedDialUI = {
            speedDial: existingSpeedDial,
            mainButton: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton'),
            actionsContainer: existingSpeedDial.querySelector('.tooltip-speed-dial-actions'),
            refreshButton: existingSpeedDial.querySelector('.tooltip-speed-dial-actions button'), // Assumes first button is refresh
            mainImg: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton img')
        };
    } else if (!speedDialUI)
    {
        speedDialUI = createSpeedDial();
    }
    if (speedDialUI) setSpeedDialRef(speedDialUI);


    // Initial state application based on stored preference
    if (state.tooltipsEnabled)
    {
        const initialKeys = gatherKeysFromAllFields();
        console.log(`Found ${initialKeys.length} initial keys for tooltips.`);
        if (initialKeys.length > 0)
        {
            fetchTooltipsForKeys(initialKeys)
                .then((data) =>
                {
                    updateQuestionMatrix(data);
                    processAllFormFields();
                    console.log(`Processed ${Object.keys(data).length} initial tooltips.`);
                })
                .catch(err =>
                {
                    console.log("Initial tooltip data fetch failed:", err);
                    processAllFormFields(); // Attempt to process with no data or stale if any
                })
                .finally(() =>
                {
                    observeDynamicFields(); // Start observing after initial setup
                });
        } else
        {
            console.log("No initial fields found requiring tooltips.");
            processAllFormFields(); // Process fields (e.g. if some have hardcoded keys)
            observeDynamicFields();
        }
    } else
    {
        console.log("Tooltips are initially disabled.");
        removeAllTooltipIcons(); // Ensure no icons are present if disabled
        // Observer will be started if/when tooltips are enabled.
    }

    updateSpeedDialAppearance(state.tooltipsEnabled);
    console.log("Tooltip system initialization complete.");
}

// --- Event Listeners and Startup ---

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    let responseSent = false;
    const sendAsyncResponse = (response) =>
    {
        if (!responseSent)
        {
            try
            {
                sendResponse(response);
                responseSent = true;
            } catch (e)
            {
                // This can happen if the message port was closed (e.g. popup closed)
                // console.warn("Failed to send response (port may have closed):", e.message);
            }
        }
    };

    if (message.type === "TOGGLE_TOOLTIPS")
    {
        toggleTooltipsGlobal(message.enabled);
        // Update storage, so it persists across sessions/tabs for this user
        chrome.storage.sync.set({ tooltipsEnabled: message.enabled }, () =>
        {
            if (chrome.runtime.lastError)
            {
                console.warn("Error saving tooltip toggle state:", chrome.runtime.lastError.message);
            }
        });
        sendAsyncResponse({ status: "Updated", enabled: state.tooltipsEnabled });
    } else if (message.type === "FETCH_SELECTED_TEXT_TOOLTIP")
    {
        // This is an async operation, so return true to keep sendResponse alive
        (async () =>
        {
            try
            {
                await fetchAndShowSelectedTextTooltip();
                sendAsyncResponse({ status: "Attempted fetch for selected text" });
            } catch (err)
            {
                console.log("Error handling FETCH_SELECTED_TEXT_TOOLTIP:", err);
                sendAsyncResponse({ status: "Error", error: err.message });
            }
        })();
        return true; // Indicate async response
    } else
    {
        console.log("Unhandled message received in content script:", message.type);
    }
    // For synchronous messages or if sendAsyncResponse is called, return false or nothing.
    // If we returned true above, this path isn't hit for that message.
    return false;
});

// Initial load: get stored preference and then initialize the system.
chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
{
    if (chrome.runtime.lastError)
    {
        console.warn("Error getting 'tooltipsEnabled' from storage:", chrome.runtime.lastError.message);
        // Default to true if storage fails
        setGlobalTooltipsEnabled(true);
    } else
    {
        // If tooltipsEnabled is undefined in storage, default to true.
        setGlobalTooltipsEnabled(result.tooltipsEnabled !== false);
    }

    // Defer initialization until the DOM is fully loaded.
    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", initialize);
    } else
    {
        initialize(); // DOM is already ready
    }
});

// Clean up on page unload (though content scripts are often destroyed anyway)
window.addEventListener('beforeunload', () =>
{
    cancelAllTTS();
    disconnectObserver();
    const tooltipContainer = document.getElementById('form-tooltip-container');
    if (tooltipContainer) tooltipContainer.remove();
    const speedDial = document.getElementById('tooltipSpeedDial');
    if (speedDial) speedDial.remove();
    const tempTooltip = document.getElementById('temporary-selection-tooltip');
    if (tempTooltip) tempTooltip.remove();

    console.log("Tooltip system resources cleaned up.");
});