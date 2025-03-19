document.addEventListener("DOMContentLoaded", function ()
{
    const toggleTooltipsCheckbox = document.getElementById("toggleTooltips");
    const openDashboardBtn = document.getElementById("openDashboardBtn");

    // 1) Load stored preference
    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        const storedValue = result.tooltipsEnabled;
        toggleTooltipsCheckbox.checked = (storedValue !== false);
    });

    // 2) Listen for changes to the checkbox
    toggleTooltipsCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleTooltipsCheckbox.checked;
        chrome.storage.sync.set({ tooltipsEnabled: isChecked }, () =>
        {
            console.log("Tooltips enabled set to:", isChecked);
        });

        // Send a message to the active tab to toggle tooltips
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
        {
            if (tabs && tabs[0])
            {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "TOGGLE_TOOLTIPS",
                    enabled: isChecked,
                });
            }
        });
    });

    // 3) "Open Dashboard"
    openDashboardBtn.addEventListener("click", function ()
    {
        chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
    });
});
