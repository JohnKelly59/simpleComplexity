// contentScripts/main.js
import
{
    state,
    updateQuestionMatrix,
    setTooltipsEnabled as setGlobalTooltipsEnabled,
    setTooltipRef,
    setSpeedDialRef,
    resetRefreshTracking,
    setRecordingOptions
} from './mainState.js';
import
{
    initTTS,
    cancelSpeech as cancelAllTTS
} from './tts.js';
import
{
    fetchTooltipsForKeys
} from './api.js';
import
{
    createTooltipContainer
} from './tooltipManager.js';
import
{
    fetchAndShowSelectedTextTooltip
} from './temporaryTooltip.js';
import
{
    processAllFormFields,
    gatherKeysFromAllFields,
    removeAllTooltipIcons,
} from './fieldProcessor.js';
import
{
    observeDynamicFields,
    disconnectObserver
} from './domObserver.js';
import
{
    createSpeedDial,
    updateSpeedDialAppearance,
    toggleSpeedDialVisibility
} from './speedDial.js';
import
{
    startDemo
} from './demo.js'; // Import the new demo function

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
            updateSpeedDialAppearance(enabled); // This will also hide speed dial actions if tooltips are off
            return;
        } else if (enabled && document.querySelector(".tooltip-icon-container"))
        {
            // Already enabled and icons present, do nothing.
            return;
        }
    }


    if (!enabled)
    { // Hide any active persistent tooltip
        removeAllTooltipIcons();
        disconnectObserver();
        console.log("Form field tooltips disabled.");
    } else
    {
        console.log("Form field tooltips enabled. Processing fields...");
        removeAllTooltipIcons();
        resetRefreshTracking();

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
                    processAllFormFields();
                    console.log(`Processed ${Object.keys(data).length} tooltips on enable.`);
                })
                .catch(err =>
                {
                    console.log("Error fetching tooltips on enable:", err);
                    processAllFormFields();
                })
                .finally(() =>
                {
                    observeDynamicFields();
                });
        } else
        {
            processAllFormFields();
            observeDynamicFields();
        }
    }
    // Update speed dial appearance (main button opacity, actions menu) based on tooltip state
    updateSpeedDialAppearance(enabled);

    // Additionally, ensure the entire speed dial is shown/hidden based on its own toggle
    // This needs to be called AFTER updateSpeedDialAppearance if tooltips are disabled,
    // as updateSpeedDialAppearance might hide it.
    if (state.speedDialRef)
    { // Check if speedDialRef exists
        toggleSpeedDialVisibility(state.speedDialEnabledGlobal);
    }
}

// New function to handle speed dial visibility specifically
function toggleSpeedDialGlobal (enabled)
{
    state.speedDialEnabledGlobal = enabled; // Store in global state
    if (state.speedDialRef)
    { // Check if speedDialRef exists
        toggleSpeedDialVisibility(enabled); // Call the function from speedDial.js
    }
    console.log("Speed Dial visibility global set to:", enabled);
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

    initTTS();

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


    // Create Speed Dial UI only if it's enabled or default to enabled
    // The actual visibility will be handled by toggleSpeedDialGlobal after storage check
    let speedDialUI = state.speedDialRef;
    if (!speedDialUI && (typeof state.speedDialEnabledGlobal === 'undefined' || state.speedDialEnabledGlobal))
    {
        const existingSpeedDial = document.getElementById('tooltipSpeedDial');
        if (!existingSpeedDial)
        { // Only create if it truly doesn't exist
            speedDialUI = createSpeedDial();
            if (speedDialUI) setSpeedDialRef(speedDialUI);
        } else if (existingSpeedDial)
        { // If it exists, re-assign to state.speedDialRef
            speedDialUI = {
                speedDial: existingSpeedDial,
                mainButton: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton'),
                actionsContainer: existingSpeedDial.querySelector('.tooltip-speed-dial-actions'),
                refreshButton: existingSpeedDial.querySelector('.tooltip-speed-dial-actions button'),
                mainImg: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton img')
            };
            setSpeedDialRef(speedDialUI);
        }
    }


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
                    processAllFormFields();
                })
                .finally(() =>
                {
                    observeDynamicFields();
                });
        } else
        {
            console.log("No initial fields found requiring tooltips.");
            processAllFormFields();
            observeDynamicFields();
        }
    } else
    {
        console.log("Tooltips are initially disabled.");
        removeAllTooltipIcons();
    }

    updateSpeedDialAppearance(state.tooltipsEnabled);
    // After basic initialization, set speed dial visibility based on its stored state
    if (state.speedDialRef)
    {
        toggleSpeedDialVisibility(state.speedDialEnabledGlobal);
    }
    console.log("Tooltip system initialization complete.");
}

// --- Event Listeners and Startup ---

browser.runtime.onMessage.addListener((message, sender, sendResponse) =>
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
            } catch (e) { }
        }
    };

    if (message.type === "TOGGLE_TOOLTIPS")
    {
        toggleTooltipsGlobal(message.enabled);
        browser.storage.sync.set({
            tooltipsEnabled: message.enabled
        }, () =>
        {
            if (browser.runtime.lastError)
            {
                console.warn("Error saving tooltip toggle state:", browser.runtime.lastError.message);
            }
        });
        sendAsyncResponse({
            status: "Tooltips Updated",
            enabled: state.tooltipsEnabled
        });
    } else if (message.type === "TOGGLE_SPEED_DIAL")
    { // New message handler
        toggleSpeedDialGlobal(message.enabled);
        browser.storage.sync.set({
            speedDialEnabled: message.enabled
        }, () =>
        {
            if (browser.runtime.lastError)
            {
                console.warn("Error saving speed dial state:", browser.runtime.lastError.message);
            }
        });
        sendAsyncResponse({
            status: "Speed Dial Updated",
            enabled: message.enabled
        });
    }
    // iOS/Safari Limitation: The context menu ("right-click" menu) is not supported.
    // The "FETCH_SELECTED_TEXT_TOOLTIP" message, which is triggered by the context menu, will not work on iOS.
    // You will need to create an alternative UI, such as a button in the speed dial, to trigger this functionality.
    else if (message.type === "FETCH_SELECTED_TEXT_TOOLTIP")
    {
        (async () =>
        {
            try
            {
                await fetchAndShowSelectedTextTooltip();
                sendAsyncResponse({
                    status: "Attempted fetch for selected text"
                });
            } catch (err)
            {
                console.log("Error handling FETCH_SELECTED_TEXT_TOOLTIP:", err);
                sendAsyncResponse({
                    status: "Error",
                    error: err.message
                });
            }
        })();
        return true;
    } else if (message.type === "START_DEMO")
    {
        startDemo();
        sendAsyncResponse({
            status: "Demo started"
        });
    } else
    {
        console.log("Unhandled message received in content script:", message.type);
    }
    return false;
});

// Load all settings from storage at once
browser.storage.sync.get(["tooltipsEnabled", "speedDialEnabled", "cameraEnabled", "micEnabled"], (result) =>
{
    if (browser.runtime.lastError)
    {
        console.warn("Error getting initial states from storage:", browser.runtime.lastError.message);
        // Set default values in case of error
        setGlobalTooltipsEnabled(true);
        state.speedDialEnabledGlobal = true;
        setRecordingOptions({ isCameraEnabled: false, isMicEnabled: false });
    } else
    {
        // Set global tooltip and speed dial visibility
        setGlobalTooltipsEnabled(result.tooltipsEnabled !== false);
        state.speedDialEnabledGlobal = result.speedDialEnabled !== false;

        // Set recording options from storage, defaulting to false if not defined
        setRecordingOptions({
            isCameraEnabled: result.cameraEnabled === true,
            isMicEnabled: result.micEnabled === true
        });
    }

    // Initialize the application after settings have been loaded
    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", initialize);
    } else
    {
        initialize();
    }
});


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