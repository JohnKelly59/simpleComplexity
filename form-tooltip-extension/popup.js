document.addEventListener("DOMContentLoaded", function ()
{
    const toggleTooltipsCheckbox = document.getElementById("toggleTooltips");
    const openDashboardBtn = document.getElementById("openDashboardBtn");
    const openSigninBtn = document.getElementById("openSigninBtn");
    const fetchTokenBtn = document.getElementById("fetchTokenBtn");

    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        const storedValue = result.tooltipsEnabled;
        toggleTooltipsCheckbox.checked = storedValue !== false;
    });

    toggleTooltipsCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleTooltipsCheckbox.checked;
        chrome.storage.sync.set({ tooltipsEnabled: isChecked }, () =>
        {
            console.log("Tooltips enabled set to:", isChecked);
        });

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

    openDashboardBtn.addEventListener("click", function ()
    {
        chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
    });

    openSigninBtn.addEventListener("click", function ()
    {
        chrome.tabs.create({ url: "http://localhost:3000/auth/login" });
    });

    fetchTokenBtn.addEventListener("click", async function ()
    {
        try
        {
            const resp = await fetch("http://localhost:3000/api/get-token", {
                method: "GET",
                credentials: "include",
            });
            if (!resp.ok)
            {
                throw new Error("Failed to get token. Are you logged in?");
            }
            const data = await resp.json();
            if (data.token)
            {
                chrome.storage.sync.set({ authToken: data.token }, () =>
                {
                    alert("Token stored in extension!");
                    console.log("Token stored:", data.token);
                });
            } else
            {
                alert("No token returned. Possibly not logged in on the site.");
            }
        } catch (err)
        {
            console.error(err);
            alert("Could not retrieve token. Check console for details.");
        }
    });
});
