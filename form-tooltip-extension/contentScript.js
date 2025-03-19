(function ()
{
    // Global variables
    let questionMatrix = {};
    let refreshCounts = {};
    let tooltipsEnabled = true;
    let tooltipRefGlobal = null;

    // Create tooltip container with Shadow DOM and return a reference object
    const createTooltipContainer = () =>
    {
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
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
          z-index: 999999 !important;
          pointer-events: auto !important;
          white-space: nowrap !important;
        }
      `;
        shadow.appendChild(style);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        shadow.appendChild(tooltip);

        // Property to manage a shared hide-timer
        return { container, tooltip, shadow, hideTimer: null };
    };

    /**
     * Determine the best key from a field using id, name, or placeholder.
     * Fall back to something meaningful for <select> if no id/name/placeholder.
     */
    const determineBestKey = (field) =>
    {
        // Use existing id, name, or placeholder if they exist
        const baseKey =
            field.id ||
            field.name ||
            (field.placeholder && field.placeholder.trim()) ||
            null;

        if (baseKey)
        {
            return baseKey;
        }

        // If this is a <select> without id/name/placeholder,
        // fall back to something from its first option or a generic fallback.
        if (field.tagName.toLowerCase() === "select")
        {
            if (field.options && field.options.length > 0)
            {
                const firstOptionText = field.options[0].text.trim();
                return firstOptionText || "Select field";
            }
            return "Select field";
        }

        // Final fallback for any other field
        return "Unknown field";
    };

    // Attach a tooltip icon to the field (if not already added)
    const addTooltipToField = (field, tooltipRef) =>
    {
        if (field.dataset.tooltipInjected === "true" || !tooltipsEnabled) return;
        field.dataset.tooltipInjected = "true";

        // Determine & store which key we ended up using
        field.dataset.keyUsed = field.dataset.keyUsed || determineBestKey(field) || "";

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
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47
             10-10S17.53 2 12 2zm.07 15H10v-2h2v2zm1.07-4.75c-.73.73-1.17
             1.24-1.17 2.33h-2v-.5c0-.83.44-1.61 1.17-2.34l1.24-1.24c.33-.33.49-.78.49-1.25
             0-.98-.8-1.78-1.78-1.78S10 8.98 10 9.96H8c0-1.69 1.37-3.06 3.06-3.06S14
             8.27 14 10c0 .89-.44 1.61-1.07 2.25z"
        />
      `;

        // Function to display tooltip content
        const showTooltip = (e) =>
        {
            if (!tooltipsEnabled) return;
            const usedKey = field.dataset.keyUsed;
            const question = questionMatrix[usedKey] || "Please fill out this field.";
            tooltipRef.tooltip.innerHTML = "";

            const textSpan = document.createElement("span");
            textSpan.textContent = question;
            tooltipRef.tooltip.appendChild(textSpan);

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="#fff" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011
            6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12
            20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
          </svg>
        `;
            if (refreshCounts[usedKey] >= 3) refreshBtn.disabled = true;
            refreshBtn.addEventListener("click", (event) =>
            {
                event.stopPropagation();
                event.preventDefault();
                if (refreshCounts[usedKey] >= 3) return;
                fetch("http://localhost:3000/api/question-lookup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ keys: [usedKey] }),
                })
                    .then((resp) => resp.json())
                    .then((data) =>
                    {
                        if (data[usedKey])
                        {
                            questionMatrix[usedKey] = data[usedKey];
                            textSpan.textContent = data[usedKey];
                        }
                    })
                    .catch((err) => console.error("Failed to refresh question:", err))
                    .finally(() =>
                    {
                        refreshCounts[usedKey]++;
                        if (refreshCounts[usedKey] >= 3) refreshBtn.disabled = true;
                    });
            });
            tooltipRef.tooltip.appendChild(refreshBtn);

            tooltipRef.tooltip.style.display = "block";
            const rect = e.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";

            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        };

        // Start a timer to hide the tooltip after a short delay
        const startHideTimer = () =>
        {
            tooltipRef.hideTimer = setTimeout(() =>
            {
                tooltipRef.tooltip.style.display = "none";
            }, 2000);
        };

        // Attach icon events
        icon.addEventListener("mouseenter", showTooltip);
        icon.addEventListener("mouseleave", () =>
        {
            if (tooltipsEnabled) startHideTimer();
        });
        icon.addEventListener("mousemove", (e) =>
        {
            if (!tooltipsEnabled) return;
            const rect = e.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";
        });

        iconContainer.appendChild(icon);
        field.insertAdjacentElement("afterend", iconContainer);
    };

    // Process all existing form fields and attach tooltips
    const processFormFields = (tooltipRef) =>
    {
        document.querySelectorAll("input, textarea, select").forEach((field) =>
        {
            addTooltipToField(field, tooltipRef);
        });
    };

    // Observe dynamic additions to the DOM for new form fields
    const observeDynamicFields = (tooltipRef) =>
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
                            addTooltipToField(f, tooltipRef)
                        );
                    }
                });
            });
        });
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });
    };

    // Gather all unique keys from existing form fields
    const gatherKeysFromFields = () =>
    {
        const keys = new Set();
        document.querySelectorAll("input, textarea, select").forEach((field) =>
        {
            const key = determineBestKey(field);
            if (key) keys.add(key);
        });
        return Array.from(keys);
    };

    /**
     * Remove all tooltip icons from the page AND reset `data-tooltipInjected`
     * so that toggling them on again will properly re-inject.
     */
    const removeAllTooltipIcons = () =>
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
    };

    // Toggle tooltips on or off
    const toggleTooltips = (enabled) =>
    {
        tooltipsEnabled = enabled;
        if (!tooltipsEnabled)
        {
            if (tooltipRefGlobal) tooltipRefGlobal.tooltip.style.display = "none";
            removeAllTooltipIcons();
        } else if (tooltipRefGlobal)
        {
            processFormFields(tooltipRefGlobal);
        }
    };

    // Initialize tooltips on the page
    const initTooltips = () =>
    {
        if (!document.body) return;
        tooltipRefGlobal = createTooltipContainer();

        // Global tooltip container events (attached only once)
        tooltipRefGlobal.tooltip.addEventListener("mouseenter", () =>
        {
            if (tooltipRefGlobal.hideTimer)
            {
                clearTimeout(tooltipRefGlobal.hideTimer);
                tooltipRefGlobal.hideTimer = null;
            }
        });
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

        const keys = gatherKeysFromFields();
        fetch("http://localhost:3000/api/question-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
        })
            .then((resp) => resp.json())
            .then((data) =>
            {
                questionMatrix = data;
                if (tooltipsEnabled) processFormFields(tooltipRefGlobal);
                observeDynamicFields(tooltipRefGlobal);
            })
            .catch((err) =>
            {
                console.error("Failed to fetch question mappings:", err);
                // Even if it fails, we still proceed with local defaults
                if (tooltipsEnabled) processFormFields(tooltipRefGlobal);
                observeDynamicFields(tooltipRefGlobal);
            });
    };

    // Check stored tooltipsEnabled setting and initialize when DOM is ready
    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        // default = true if not found
        tooltipsEnabled = result.tooltipsEnabled !== false;
        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", initTooltips);
        } else
        {
            initTooltips();
        }
    });

    // Listen for extension messages to toggle tooltips
    chrome.runtime.onMessage.addListener((message) =>
    {
        if (message.type === "TOGGLE_TOOLTIPS") toggleTooltips(message.enabled);
    });
})();
