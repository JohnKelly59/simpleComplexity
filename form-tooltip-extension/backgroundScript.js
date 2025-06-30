// backgroundScript.js

// Use a polyfill or a simple check to ensure cross-browser compatibility.
if (typeof browser === "undefined")
{
    var browser = chrome;
}

// The URL of the page on your website that the user is sent to *after*
// successfully authenticating with Google and your server.
const AUTH_SUCCESS_URL = 'https://app.simple-complexity.com/auth/google/extension/success';

/**
 * Listens for new tabs being created or updated.
 * When it detects that the user has successfully logged in on your website,
 * it extracts the token from the URL and closes the auth tab.
 */
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
{
    // Check if the tab has finished loading and its URL is the one we expect after a successful login.
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith(AUTH_SUCCESS_URL))
    {
        console.log('Authentication success page loaded. Storing token...');

        try
        {
            const urlObj = new URL(tab.url);
            const token = urlObj.searchParams.get("token");

            if (token)
            {
                // Store the token securely in the extension's storage.
                browser.storage.sync.set({ authToken: token }, () =>
                {
                    console.log('Auth token successfully stored.');
                    // Close the now-unneeded authentication tab.
                    browser.tabs.remove(tabId);
                });
            } else
            {
                console.warn('Auth success URL detected, but no token was found in the query parameters.');
                // Still close the tab to avoid leaving it open.
                browser.tabs.remove(tabId);
            }
        } catch (error)
        {
            console.error('Error processing auth success URL:', error);
            browser.tabs.remove(tabId);
        }
    }
});


/**
 * iOS/Safari Limitation Note:
 * The contextMenus API is not supported on iOS. Therefore, the feature
 * to right-click selected text will not be available on that platform.
 * This code is kept for compatibility with desktop Safari on macOS.
 */
function setupContextMenu ()
{
    // Check if contextMenus API is available before using it.
    if (browser.contextMenus)
    {
        browser.contextMenus.create({
            id: "fetchTooltipForSelection",
            title: "Get Definition for \"%s\"",
            contexts: ["selection"]
        });
    }
}

function initializeContextMenu ()
{
    if (browser.contextMenus)
    {
        browser.contextMenus.removeAll(() =>
        {
            setupContextMenu();
        });
    }
}

// --- Event Listeners ---

// Run when the extension is first installed or updated.
browser.runtime.onInstalled.addListener(() =>
{
    console.log("Extension installed/updated. Initializing context menu for desktop Safari.");
    initializeContextMenu();
});

// Run when the browser starts.
browser.runtime.onStartup.addListener(() =>
{
    console.log("Browser startup. Initializing context menu for desktop Safari.");
    initializeContextMenu();
});

// Listen for clicks on the context menu item.
if (browser.contextMenus)
{
    browser.contextMenus.onClicked.addListener((info, tab) =>
    {
        if (info.menuItemId === "fetchTooltipForSelection" && tab?.id)
        {
            browser.tabs.sendMessage(
                tab.id,
                { type: "FETCH_SELECTED_TEXT_TOOLTIP" },
                (response) =>
                {
                    if (browser.runtime.lastError)
                    {
                        console.warn("Could not send message to content script:", browser.runtime.lastError.message);
                    }
                }
            );
        }
    });
}
