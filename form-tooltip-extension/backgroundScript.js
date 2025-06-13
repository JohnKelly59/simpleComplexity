// backgroundScript.js

/**
 * Creates the context menu item for selected text.
 */
function setupContextMenu ()
{
    // Use chrome.contextMenus.create to add an item to the right-click menu
    chrome.contextMenus.create({
        id: "fetchTooltipForSelection", // Unique ID for this menu item
        title: "Get Definition for \"%s\"", // Text displayed; %s is replaced by selected text
        contexts: ["selection"] // Show only when text is selected
    }, () =>
    {
        // Optional callback function after creation
        if (chrome.runtime.lastError)
        {
            console.log("Error creating context menu:", chrome.runtime.lastError.message);
        } else
        {
            // console.log("Context menu 'fetchTooltipForSelection' created successfully.");
        }
    });
}

/**
 * Handles the initial setup of the context menu when the extension is installed or updated.
 * Also handles browser startup just in case.
 */
function initializeContextMenu ()
{
    // Remove any existing menu items this extension created first to avoid duplicates
    chrome.contextMenus.removeAll(() =>
    {
        // console.log("Removed existing context menus, setting up new one.");
        setupContextMenu(); // Create the new context menu item
    });
}

// --- Event Listeners ---

// 1. Run when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() =>
{
    console.log("Extension installed or updated. Initializing context menu.");
    initializeContextMenu();
});

// 2. Run when the browser starts (if the extension is already enabled)
// This covers cases where the browser was closed and reopened.
chrome.runtime.onStartup.addListener(() =>
{
    console.log("Browser startup detected. Ensuring context menu exists.");
    initializeContextMenu(); // Re-initialize to be safe
});

// 3. Listen for clicks on any context menu item created by this extension
chrome.contextMenus.onClicked.addListener((info, tab) =>
{
    // Check if the click was on our specific menu item
    if (info.menuItemId === "fetchTooltipForSelection")
    {
        // Check if we have valid tab information to send the message to
        if (tab && tab.id)
        {
            // console.log(`Context menu clicked for selection: "${info.selectionText}" in tab ${tab.id}`);

            // Send a message to the content script in the specific tab where the click occurred
            chrome.tabs.sendMessage(
                tab.id,
                {
                    type: "FETCH_SELECTED_TEXT_TOOLTIP" // Message type the content script listens for
                    // selectedText: info.selectionText // Optional: send text, but content script can get it too
                },
                (response) =>
                { // Optional: Callback to handle the response from the content script
                    if (chrome.runtime.lastError)
                    {
                        // Log if sending the message failed (e.g., content script not ready/injected)
                        console.warn("Could not send message to content script:", chrome.runtime.lastError.message);
                        // Consider retry logic or notifying the user if this happens often
                    } else
                    {
                        // Log the response received from the content script (if it sends one)
                        // console.log("Content script responded:", response);
                    }
                }
            );
        } else
        {
            console.log("Context menu clicked, but could not get target tab information.");
        }
    }
});

// Optional: Keep the service worker alive if needed for frequent events or listeners
// Usually not necessary just for context menus and messaging.
// chrome.runtime.onConnect.addListener(port => {
//   console.log('Keeping service worker alive with port:', port.name);
// });