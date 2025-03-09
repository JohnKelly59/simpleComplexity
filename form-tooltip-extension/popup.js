document.getElementById("settingsBtn").addEventListener("click", function ()
{
    // Open the extension dashboard in a new tab.
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
});
