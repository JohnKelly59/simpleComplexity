// popup.js

// Use a polyfill or a simple check to ensure cross-browser compatibility.
if (typeof browser === "undefined")
{
    var browser = chrome;
}

document.addEventListener("DOMContentLoaded", function ()
{
    // --- Element References ---
    const mainAppBtn = document.getElementById('mainAppBtn');
    const toggleTooltipsCheckbox = document.getElementById("toggleTooltips");
    const toggleSpeedDialCheckbox = document.getElementById("toggleSpeedDial");
    const loginBtn = document.getElementById("loginBtn");
    const emailField = document.getElementById("emailField");
    const passwordField = document.getElementById("passwordField");
    const googleSignInBtn = document.getElementById("googleSignInBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const helpBtn = document.getElementById("helpBtn");
    const loginSection = document.getElementById("loginSection");
    const logoutSection = document.getElementById("logoutSection");
    const popupMessage = document.getElementById("popup-message");

    // The URL on your server that will start the Google OAuth process.
    const GOOGLE_AUTH_URL = 'https://app.simple-complexity.com/auth/google/extension';

    // --- UI Functions ---
    function showPopupMessage (message)
    {
        popupMessage.textContent = message;
        popupMessage.style.display = "block";
        setTimeout(() =>
        {
            popupMessage.style.display = "none";
        }, 3000);
    }

    function updateAuthUI (isLoggedIn)
    {
        if (isLoggedIn)
        {
            loginSection.style.display = "none";
            logoutSection.style.display = "block";
        } else
        {
            loginSection.style.display = "block";
            logoutSection.style.display = "none";
        }
    }

    // --- Event Listeners ---

    if (mainAppBtn)
    {
        mainAppBtn.addEventListener('click', function ()
        {
            window.open('https://app.simple-complexity.com/', '_blank');
        });
    }

    // Tooltip toggle
    browser.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        toggleTooltipsCheckbox.checked = result.tooltipsEnabled !== false;
    });
    toggleTooltipsCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleTooltipsCheckbox.checked;
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        {
            if (tabs[0]?.id)
            {
                browser.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_TOOLTIPS", enabled: isChecked });
            }
        });
    });

    // Speed Dial toggle
    browser.storage.sync.get(["speedDialEnabled"], (result) =>
    {
        toggleSpeedDialCheckbox.checked = result.speedDialEnabled !== false;
    });
    toggleSpeedDialCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleSpeedDialCheckbox.checked;
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        {
            if (tabs[0]?.id)
            {
                browser.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_SPEED_DIAL", enabled: isChecked });
            }
        });
    });

    // Email/Password login
    if (loginBtn)
    {
        loginBtn.addEventListener("click", async function ()
        {
            const email = (emailField?.value || "").trim();
            const password = (passwordField?.value || "").trim();
            if (!email || !password)
            {
                showPopupMessage("Email and password are required.");
                return;
            }
            try
            {
                const resp = await fetch("https://app.simple-complexity.com/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                if (!resp.ok)
                {
                    const errData = await resp.json();
                    throw new Error(errData.error || "Login failed");
                }
                const data = await resp.json();
                if (data.token)
                {
                    browser.storage.sync.set({ authToken: data.token }, () =>
                    {
                        showPopupMessage("Login successful!");
                        updateAuthUI(true);
                    });
                } else
                {
                    showPopupMessage("Invalid credentials.");
                }
            } catch (err)
            {
                showPopupMessage("Login failed. Please try again.");
            }
        });
    }

    // **MODIFIED FOR SAFARI/IOS**
    // Google Sign In now opens a new tab for the web-based auth flow.
    if (googleSignInBtn)
    {
        googleSignInBtn.addEventListener("click", () =>
        {
            browser.tabs.create({ url: GOOGLE_AUTH_URL });
            window.close(); // Close the popup after opening the auth tab
        });
    }

    // Logout
    if (logoutBtn)
    {
        logoutBtn.addEventListener("click", function ()
        {
            browser.storage.sync.remove("authToken", () =>
            {
                showPopupMessage("You have been logged out.");
                updateAuthUI(false);
            });
        });
    }

    // Help Button
    if (helpBtn)
    {
        helpBtn.addEventListener("click", () =>
        {
            browser.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            {
                if (tabs[0]?.id)
                {
                    browser.tabs.sendMessage(tabs[0].id, { type: "START_DEMO" });
                    window.close();
                }
            });
        });
    }

    // --- Initial State Check ---
    // Check login status when the popup opens
    browser.storage.sync.get(["authToken"], (result) =>
    {
        updateAuthUI(!!result.authToken);
    });
});
