(function ()
{
    // Set default to not show tooltips
    let questionMatrix = {};
    let refreshCounts = {};
    let tooltipsEnabled = false;
    let tooltipRefGlobal = null;
    let lastRefreshTimes = {};

    // -------------------------------------------
    // 1) fetchWithAuth function using configuration options
    // -------------------------------------------
    async function fetchWithAuth (url, options = {})
    {
        // Read the API token from the global configuration object
        const token = window.TooltipEmbedConfig?.apiToken || "";
        const headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        };
        return fetch(url, { ...options, headers });
    }

    // -------------------------------------------
    // 2) fetchTooltipsForKeys using configurable API base URL
    // -------------------------------------------
    function fetchTooltipsForKeys (keys = [])
    {
        const apiBaseUrl = window.TooltipEmbedConfig?.apiBaseUrl || "";
        return fetchWithAuth(`${apiBaseUrl}/question-lookup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
        })
            .then((resp) =>
            {
                // If you’re receiving a 302 on first load, confirm your route
                // is publicly accessible or that your token is valid.
                return resp.json();
            })
            .catch((err) =>
            {
                console.error("Failed to fetch question mappings:", err);
                return {};
            });
    }

    // -------------------------------------------
    // 3) Determine best key from a field
    // -------------------------------------------
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

    // -------------------------------------------
    // 4) Create the tooltip container
    // -------------------------------------------
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

    // -------------------------------------------
    // 5) Add the tooltip to a single field
    // -------------------------------------------
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

    // -------------------------------------------
    // 6) Process all form fields
    // -------------------------------------------
    function processFormFields (tooltipRef)
    {
        document.querySelectorAll("input, textarea, select").forEach((field) =>
        {
            addTooltipToField(field, tooltipRef);
        });
    }

    // -------------------------------------------
    // 7) Observe DOM mutations for dynamically added fields
    // -------------------------------------------
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

    // -------------------------------------------
    // 8) Gather unique keys from fields
    // -------------------------------------------
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

    // -------------------------------------------
    // 9) Remove all tooltip icons
    // -------------------------------------------
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

    // -------------------------------------------
    // 10) Toggle tooltips globally and automatically refresh when enabling
    // -------------------------------------------
    function toggleTooltips (enabled)
    {
        tooltipsEnabled = enabled;
        if (tooltipRefGlobal)
        {
            if (enabled)
            {
                // When enabling tooltips, automatically refresh by gathering keys and fetching data.
                const keys = gatherKeysFromFields();
                fetchTooltipsForKeys(keys)
                    .then((data) =>
                    {
                        questionMatrix = data;
                        processFormFields(tooltipRefGlobal);
                    })
                    .catch((err) =>
                    {
                        console.error("Failed to refresh tooltips:", err);
                    });
            } else
            {
                // If disabling, hide any open tooltip and remove tooltip icons.
                tooltipRefGlobal.tooltip.style.display = "none";
                removeAllTooltipIcons();
            }
        }
    }

    // -------------------------------------------
    // 11) Create a Speed Dial with two actions:
    //     a) Toggle tooltips on/off
    //     b) Refresh tooltips
    // -------------------------------------------
    let speedDialRef = null;
    function createSpeedDial ()
    {
        // Container
        const speedDial = document.createElement("div");
        speedDial.id = "tooltipSpeedDial";
        speedDial.style.position = "fixed";
        speedDial.style.bottom = "20px";
        speedDial.style.right = "20px";
        speedDial.style.zIndex = 2147483647;
        speedDial.style.display = "flex";
        speedDial.style.flexDirection = "column";
        speedDial.style.alignItems = "flex-end";

        // Main FAB (Speed Dial Trigger)
        const mainButton = document.createElement("button");
        mainButton.id = "tooltipSpeedDial_mainButton";
        mainButton.textContent = "⋮"; // or any icon
        Object.assign(mainButton.style, {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1f2937",
            color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
        });
        speedDial.appendChild(mainButton);

        // Actions container
        const actionsContainer = document.createElement("div");
        actionsContainer.style.display = "none"; // hidden by default
        actionsContainer.style.flexDirection = "column";
        actionsContainer.style.gap = "8px";
        actionsContainer.style.marginBottom = "8px";

        // 1) Toggle tooltips
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle Tooltips";
        Object.assign(toggleButton.style, {
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#4b5563",
            color: "#fff",
        });
        toggleButton.addEventListener("click", () =>
        {
            // Toggle the tooltipsEnabled boolean and auto-refresh if enabling
            toggleTooltips(!tooltipsEnabled);
        });
        actionsContainer.appendChild(toggleButton);

        // 2) Refresh tooltips
        const refreshButton = document.createElement("button");
        refreshButton.textContent = "Refresh Tooltips";
        Object.assign(refreshButton.style, {
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#4b5563",
            color: "#fff",
        });
        refreshButton.addEventListener("click", (event) =>
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
        actionsContainer.appendChild(refreshButton);

        speedDial.appendChild(actionsContainer);
        document.body.appendChild(speedDial);

        // Toggle the actions on main button click
        mainButton.addEventListener("click", () =>
        {
            actionsContainer.style.display =
                actionsContainer.style.display === "none" ? "flex" : "none";
        });

        return {
            speedDial,
            mainButton,
            actionsContainer,
            toggleButton,
            refreshButton,
        };
    }

    // -------------------------------------------
    // 12) Initialize tooltips
    // -------------------------------------------
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

        // Gather all keys and fetch them (but only process form fields if tooltips are enabled)
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

        // Create our Speed Dial with toggle & refresh actions
        speedDialRef = createSpeedDial();
    }

    // Run `initTooltips` when the DOM is ready
    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", initTooltips);
    } else
    {
        initTooltips();
    }

    // Expose toggle function globally if you want external toggling
    window.toggleFormTooltips = toggleTooltips;
})();
