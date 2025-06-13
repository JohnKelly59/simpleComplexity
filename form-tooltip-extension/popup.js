document.addEventListener("DOMContentLoaded", function ()
{
    var mainAppBtn = document.getElementById('mainAppBtn');
    if (mainAppBtn)
    {
        mainAppBtn.addEventListener('click', function ()
        {
            window.open('https://app.simple-complexity.com/', '_blank');
        });
    }


    const toggleTooltipsCheckbox = document.getElementById("toggleTooltips");
    const toggleSpeedDialCheckbox = document.getElementById("toggleSpeedDial"); // New checkbox
    const loginBtn = document.getElementById("loginBtn");
    const emailField = document.getElementById("emailField");
    const passwordField = document.getElementById("passwordField");
    const googleSignInBtn = document.getElementById("googleSignInBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const helpBtn = document.getElementById("helpBtn");

    const loginSection = document.getElementById("loginSection");
    const logoutSection = document.getElementById("logoutSection");
    const popupMessage = document.getElementById("popup-message");

    function showPopupMessage (message)
    {
        popupMessage.textContent = message;
        popupMessage.style.display = "block";
        setTimeout(() =>
        {
            popupMessage.style.display = "none";
        }, 3000); // Adjust time as needed
    }

    // 1. Check if the user is already signed in (token present):
    chrome.storage.sync.get(["authToken"], (result) =>
    {
        if (result.authToken)
        {
            // Token exists - user is signed in
            loginSection.style.display = "none";
            logoutSection.style.display = "block";
        } else
        {
            // No token - user is not signed in
            loginSection.style.display = "block";
            logoutSection.style.display = "none";
        }
    });

    // 2. Tooltip toggle
    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        toggleTooltipsCheckbox.checked = result.tooltipsEnabled !== false;
    });

    toggleTooltipsCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleTooltipsCheckbox.checked;
        chrome.storage.sync.set({ tooltipsEnabled: isChecked }, () =>
        {
            console.log("Tooltips enabled set to:", isChecked);
        });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
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

    // 3. Speed Dial toggle
    chrome.storage.sync.get(["speedDialEnabled"], (result) =>
    {
        // Default to true if not set
        toggleSpeedDialCheckbox.checked = result.speedDialEnabled !== false;
    });

    toggleSpeedDialCheckbox.addEventListener("change", function ()
    {
        const isChecked = toggleSpeedDialCheckbox.checked;
        chrome.storage.sync.set({ speedDialEnabled: isChecked }, () =>
        {
            console.log("Speed Dial visibility set to:", isChecked);
        });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        {
            if (tabs && tabs[0] && tabs[0].id)
            {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "TOGGLE_SPEED_DIAL",
                    enabled: isChecked,
                });
            }
        });
    });


    // 4. Email/Password login
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
                    chrome.storage.sync.set({ authToken: data.token }, () =>
                    {
                        showPopupMessage("Login successful. Token stored!");
                        console.log("Token stored:", data.token);
                        // Hide login, show logout
                        loginSection.style.display = "none";
                        logoutSection.style.display = "block";
                    });
                } else
                {
                    showPopupMessage("No token returned. Possibly invalid credentials.");
                }
            } catch (err)
            {
                //console.log("Login error:", err);
                showPopupMessage("Login failed. Check console for details.");
            }
        });
    }

    // 5. Google Sign In
    if (googleSignInBtn)
    {
        googleSignInBtn.addEventListener("click", () =>
        {
            const extensionRedirectUri = chrome.identity.getRedirectURL();
            const authUrl = `https://app.simple-complexity.com/auth/google/extension?redirect_uri=${encodeURIComponent(extensionRedirectUri)}`;
            console.log('extension', extensionRedirectUri)
            console.log('authUrl', authUrl)
            chrome.identity.launchWebAuthFlow(
                {
                    url: authUrl,
                    interactive: true,
                },
                function (redirectedUrl)
                {
                    if (chrome.runtime.lastError)
                    {
                        // console.log(
                        //     "Google auth error:",
                        //     chrome.runtime.lastError.message
                        // );
                        showPopupMessage("Google auth failed: " + chrome.runtime.lastError.message);
                        return;
                    }

                    const urlObj = new URL(redirectedUrl);
                    const token = urlObj.searchParams.get("token");
                    if (token)
                    {
                        chrome.storage.sync.set({ authToken: token }, () =>
                        {
                            showPopupMessage("Google Sign-In successful! Token stored.");
                            console.log("Stored token:", token);
                            // Hide login, show logout
                            loginSection.style.display = "none";
                            logoutSection.style.display = "block";
                        });
                    } else
                    {
                        showPopupMessage("No token found in final URL. Check server logic.");
                    }
                }
            );
        });
    }

    // 6. Logout
    if (logoutBtn)
    {
        logoutBtn.addEventListener("click", function ()
        {
            chrome.storage.sync.remove("authToken", () =>
            {
                showPopupMessage("You have been logged out.");
                // Show login UI again
                loginSection.style.display = "block";
                logoutSection.style.display = "none";
            });
        });
    }

    // 7. Help Button
    if (helpBtn)
    {
        helpBtn.addEventListener("click", () =>
        {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            {
                if (tabs && tabs[0] && tabs[0].id)
                {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "START_DEMO",
                    }, (response) =>
                    {
                        if (chrome.runtime.lastError)
                        {
                            console.warn("Could not start demo:", chrome.runtime.lastError.message);
                        } else
                        {
                            console.log("Demo started.");
                        }
                    });
                    window.close(); // Close the popup after starting the demo
                }
            });
        });
    }
});