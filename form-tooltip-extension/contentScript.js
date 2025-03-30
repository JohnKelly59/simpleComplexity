(function ()
{
    let questionMatrix = {};
    let refreshCounts = {};
    let tooltipsEnabled = true;
    let tooltipRefGlobal = null;
    let lastRefreshTimes = {};

    /**
     * Helper: fetch with stored auth token in header.
     */
    function fetchWithAuth (url, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            chrome.storage.sync.get(["authToken"], async (storageResult) =>
            {
                const bearerToken =
                    typeof storageResult.authToken === "string"
                        ? storageResult.authToken
                        : storageResult.authToken?.token || "";

                const headers = {
                    ...options.headers,
                    Authorization: `Bearer ${bearerToken}`,
                };

                try
                {
                    const response = await fetch(url, { ...options, headers });
                    resolve(response);
                } catch (err)
                {
                    reject(err);
                }
            });
        });
    }

    /**
     * Fetch tooltips for given keys from the backend.
     */
    function fetchTooltipsForKeys (keys = [])
    {
        return fetchWithAuth("http://localhost:8000/api/question-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
        })
            .then((resp) => resp.json())
            .catch((err) =>
            {
                console.error("Failed to fetch question mappings:", err);
                return {};
            });
    }

    /**
     * Determine a "best" unique key based on
     * field attributes (id, name, placeholder, etc.).
     */
    function determineBestKey (field)
    {
        const baseKey =
            field.id ||
            field.name ||
            (field.placeholder && field.placeholder.trim()) ||
            null;

        if (baseKey) return baseKey;

        if (field.tagName.toLowerCase() === "select")
        {
            if (field.options && field.options.length > 0)
            {
                const firstOptionText = field.options[0].text.trim();
                return firstOptionText || "Select field";
            }
            return "Select field";
        }

        return "Unknown field";
    }

    /**
     * Create the container for the tooltip (using a shadow root).
     */
    function createTooltipContainer ()
    {
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2147483647,
        });
        document.body.appendChild(container);

        const shadow = container.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = `
            .tooltip {
                position: absolute !important;
                padding: 4px 8px !important;
                background-color: rgba(0, 0, 0, 0.7) !important;
                color: #fff !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                display: none;
                pointer-events: auto !important;
                white-space: nowrap !important;
                z-index: 2147483647 !important;
            }
        `;
        shadow.appendChild(style);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        shadow.appendChild(tooltip);

        return { container, tooltip, shadow, hideTimer: null };
    }

    /**
     * Add a tooltip icon next to a field if not already present.
     */
    function addTooltipToField (field, tooltipRef)
    {
        if (field.dataset.tooltipInjected === "true" || !tooltipsEnabled) return;
        field.dataset.tooltipInjected = "true";
        field.dataset.keyUsed = field.dataset.keyUsed || determineBestKey(field);

        const iconContainer = document.createElement("span");
        Object.assign(iconContainer.style, {
            display: "inline-flex",
            alignItems: "center",
            marginLeft: "16px",
            zIndex: "100000",
        });
        iconContainer.classList.add("tooltip-icon-container");

        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "20");
        icon.setAttribute("height", "20");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-label", "Help");
        icon.style.cursor = "pointer";
        icon.innerHTML = `
            <path fill="#000"
                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 
                   10 10 10-4.47 10-10S17.53 2 12 2zm.07 
                   15H10v-2h2v2zm1.07-4.75c-.73.73-1.17 
                   1.24-1.17 2.33h-2v-.5c0-.83.44-1.61 
                   1.17-2.34l1.24-1.24c.33-.33.49-.78.49-1.25
                   0-.98-.8-1.78-1.78-1.78S10 8.98 
                   10 9.96H8c0-1.69 1.37-3.06 
                   3.06-3.06S14 8.27 14 10c0 .89-.44 
                   1.61-1.07 2.25z"
            />
        `;

        // Show the tooltip on mouseenter
        const showTooltip = (evt) =>
        {
            if (!tooltipsEnabled) return;

            const usedKey = field.dataset.keyUsed;
            const question = questionMatrix[usedKey] || "Please fill out this field.";
            tooltipRef.tooltip.innerHTML = "";

            const textSpan = document.createElement("span");
            textSpan.textContent = question;
            tooltipRef.tooltip.appendChild(textSpan);

            // Refresh button within tooltip
            refreshCounts[usedKey] = refreshCounts[usedKey] || 0;
            const refreshBtn = document.createElement("button");
            Object.assign(refreshBtn.style, {
                marginLeft: "8px",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: "11px",
                borderRadius: "3px",
                pointerEvents: "auto",
            });
            refreshBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#fff"
                        d="M17.65 6.35A7.95 7.95 0 0 0 
                           12 4C8.74 4 6 6.03 4.69 9h2.02a6.011
                           6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4
                           l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0
                           12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011
                           6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
                </svg>
            `;

            if (refreshCounts[usedKey] >= 3)
            {
                refreshBtn.disabled = true;
            }

            refreshBtn.addEventListener("click", (clickEvent) =>
            {
                clickEvent.stopPropagation();
                clickEvent.preventDefault();
                if (refreshCounts[usedKey] >= 3) return;

                const now = Date.now();
                const lastRefresh = lastRefreshTimes[usedKey] || 0;
                if (now - lastRefresh < 5000)
                {
                    console.log(`Wait 5s before refreshing again for "${usedKey}".`);
                    return;
                }
                lastRefreshTimes[usedKey] = now;

                // Re-fetch data for this key
                fetchTooltipsForKeys([usedKey])
                    .then((data) =>
                    {
                        if (data[usedKey])
                        {
                            questionMatrix[usedKey] = data[usedKey];
                            textSpan.textContent = data[usedKey];
                        }
                    })
                    .catch((err) =>
                    {
                        console.error("Failed to refresh question:", err);
                    })
                    .finally(() =>
                    {
                        refreshCounts[usedKey]++;
                        if (refreshCounts[usedKey] >= 3)
                        {
                            refreshBtn.disabled = true;
                        }
                    });
            });

            tooltipRef.tooltip.appendChild(refreshBtn);
            tooltipRef.tooltip.style.display = "block";

            // Position the tooltip
            const rect = evt.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";

            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        };

        const startHideTimer = () =>
        {
            tooltipRef.hideTimer = setTimeout(() =>
            {
                tooltipRef.tooltip.style.display = "none";
            }, 2000);
        };

        icon.addEventListener("mouseenter", showTooltip);
        icon.addEventListener("mouseleave", () =>
        {
            if (tooltipsEnabled)
            {
                startHideTimer();
            }
        });
        icon.addEventListener("mousemove", (evt) =>
        {
            if (!tooltipsEnabled) return;
            const rect = evt.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";
        });

        iconContainer.appendChild(icon);
        field.insertAdjacentElement("afterend", iconContainer);
    }

    /**
     * Add tooltips to all existing fields.
     */
    function processFormFields (tooltipRef)
    {
        document.querySelectorAll("input, textarea, select").forEach((field) =>
        {
            addTooltipToField(field, tooltipRef);
        });
    }

    /**
     * Observe DOM mutations; if new fields are added, inject tooltips as well.
     */
    function observeDynamicFields (tooltipRef)
    {
        const observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                mutation.addedNodes.forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE)
                    {
                        if (node.matches?.("input, textarea, select"))
                        {
                            addTooltipToField(node, tooltipRef);
                        }
                        node.querySelectorAll?.("input, textarea, select").forEach((f) =>
                        {
                            addTooltipToField(f, tooltipRef);
                        });
                    }
                });
            });
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Gather unique keys from all form fields.
     */
    function gatherKeysFromFields ()
    {
        const keys = new Set();
        document.querySelectorAll("input, textarea, select").forEach((field) =>
        {
            const key = determineBestKey(field);
            if (key) keys.add(key);
        });
        return Array.from(keys);
    }

    /**
     * Remove all injected icons from the page.
     */
    function removeAllTooltipIcons ()
    {
        document.querySelectorAll(".tooltip-icon-container").forEach((iconContainer) =>
        {
            const maybeField = iconContainer.previousElementSibling;
            if (maybeField)
            {
                maybeField.dataset.tooltipInjected = "false";
            }
            iconContainer.remove();
        });
    }

    /**
     * Enable or disable tooltips globally.
     */
    function toggleTooltips (enabled)
    {
        tooltipsEnabled = enabled;
        if (refreshBtnGlobal)
        {
            refreshBtnGlobal.style.display = tooltipsEnabled ? "block" : "none";
        }
        if (!tooltipsEnabled)
        {
            if (tooltipRefGlobal)
            {
                tooltipRefGlobal.tooltip.style.display = "none";
            }
            removeAllTooltipIcons();
        } else if (tooltipRefGlobal)
        {
            processFormFields(tooltipRefGlobal);
        }
    }

    // --- Refresh Button Setup ---

    let refreshBtnGlobal = null;

    /**
     * Helper function to check if the page background is light.
     */
    function isBackgroundLight ()
    {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3)
        {
            const r = parseInt(rgb[0], 10);
            const g = parseInt(rgb[1], 10);
            const b = parseInt(rgb[2], 10);
            // Calculate brightness based on the standard formula
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128; // if brightness is high, background is light
        }
        return true; // fallback: assume light background
    }

    function createRefreshButton ()
    {
        // Button container
        const btn = document.createElement("button");
        btn.id = "formTooltipRefreshBtn";
        btn.title = "Refresh Tips";

        // Set button background based on page background:
        // If the page background is light, use #1f2937 (dark); else use white.
        const btnBgColor = isBackgroundLight() ? "#1f2937" : "#fff";

        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: btnBgColor,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 2147483647,
        });

        // Icon inside the button
        const iconImg = document.createElement("img");
        // Replace with your desired icon file (e.g., SC_COLOR.png or another file)
        iconImg.src = isBackgroundLight() ? chrome.runtime.getURL("icon128.png") : chrome.runtime.getURL("SC_COLOR.png");
        iconImg.alt = "Refresh";
        iconImg.style.width = "28px";
        iconImg.style.height = "28px";

        // Center the icon in the circular button
        iconImg.style.position = "absolute";
        iconImg.style.top = "50%";
        iconImg.style.left = "50%";
        iconImg.style.transform = "translate(-50%, -50%)";

        btn.appendChild(iconImg);

        btn.addEventListener("click", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            if (!tooltipsEnabled) return;

            // Re-fetch tooltip data for all fields
            const keys = gatherKeysFromFields();
            fetchTooltipsForKeys(keys)
                .then((data) =>
                {
                    questionMatrix = data;
                    processFormFields(tooltipRefGlobal);
                })
                .catch((err) =>
                {
                    console.error("Failed to refresh questions on button click:", err);
                });
        });

        document.body.appendChild(btn);
        return btn;
    }

    /**
     * Initialize tooltips on page load.
     */
    function initTooltips ()
    {
        if (!document.body) return;

        tooltipRefGlobal = createTooltipContainer();

        // Keep tooltip open if mouse enters it
        tooltipRefGlobal.tooltip.addEventListener("mouseenter", () =>
        {
            if (tooltipRefGlobal.hideTimer)
            {
                clearTimeout(tooltipRefGlobal.hideTimer);
                tooltipRefGlobal.hideTimer = null;
            }
        });

        // Start hide timer if mouse leaves tooltip
        tooltipRefGlobal.tooltip.addEventListener("mouseleave", () =>
        {
            if (tooltipsEnabled)
            {
                tooltipRefGlobal.hideTimer = setTimeout(() =>
                {
                    tooltipRefGlobal.tooltip.style.display = "none";
                }, 2000);
            }
        });

        // Fetch all keys once and add tooltips
        const keys = gatherKeysFromFields();
        fetchTooltipsForKeys(keys).then((data) =>
        {
            questionMatrix = data;
            if (tooltipsEnabled)
            {
                processFormFields(tooltipRefGlobal);
            }
            observeDynamicFields(tooltipRefGlobal);
        });

        // Create the refresh button (bottom-right corner)
        refreshBtnGlobal = createRefreshButton();
        refreshBtnGlobal.style.display = tooltipsEnabled ? "block" : "none";
    }

    // Read the stored state for tooltipsEnabled, then init
    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        tooltipsEnabled = result.tooltipsEnabled !== false;
        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", initTooltips);
        } else
        {
            initTooltips();
        }
    });

    // Listen for messages to toggle tooltips on/off
    chrome.runtime.onMessage.addListener((message) =>
    {
        if (message.type === "TOGGLE_TOOLTIPS")
        {
            toggleTooltips(message.enabled);
        }
    });
})();
