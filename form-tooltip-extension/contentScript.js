// content.js

(function ()
{
    // --- Global State Variables ---
    let questionMatrix = {}; // Stores fetched tooltips { key: questionText }
    let refreshCounts = {}; // Tracks refresh clicks per key { key: count }
    let tooltipsEnabled = true; // Master switch for form field tooltips
    let tooltipRefGlobal = null; // Reference to the main tooltip container object
    let lastRefreshTimes = {}; // Tracks last refresh timestamp per key { key: timestamp }
    let speedDialRef = null; // Reference to the speed dial elements
    let temporaryTooltipRef = null; // Reference to the temporary selection tooltip element

    // --- Helper Functions ---

    /**
     * Helper: check if page background is light.
     * Used for selecting the appropriate speed dial icon.
     */
    function isBackgroundLight ()
    {
        try
        {
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3)
            {
                const [r, g, b] = rgb.map((x) => parseInt(x, 10));
                // Formula for perceived brightness
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 128;
            }
        } catch (e)
        {
            console.warn("Could not determine background color, defaulting to light.", e);
        }
        // Default assumption if calculation fails
        return true;
    }

    /**
     * Helper: fetch wrapper that includes the auth token from chrome.storage.sync.
     */
    function fetchWithAuth (url, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            // Use chrome.storage.sync to get the token
            chrome.storage.sync.get(["authToken"], (storageResult) =>
            {
                if (chrome.runtime.lastError)
                {
                    console.error("Storage error:", chrome.runtime.lastError.message);
                    // Reject the promise if storage fails
                    reject(new Error(`Storage error: ${chrome.runtime.lastError.message}`));
                    return;
                }

                // Extract token safely, handling different storage formats
                const bearerToken =
                    typeof storageResult.authToken === "string"
                        ? storageResult.authToken
                        : storageResult.authToken?.token || ""; // Handle object or string

                // Prepare headers, merging existing options.headers if any
                const headers = {
                    ...options.headers, // Spread existing headers
                    Authorization: `Bearer ${bearerToken}`, // Add Authorization header
                };

                // Perform the fetch call with the merged options and headers
                fetch(url, { ...options, headers })
                    .then(resolve) // Resolve the promise with the response
                    .catch(reject); // Reject the promise if fetch fails
            });
        });
    }

    /**
     * Fetch tooltip definitions from the backend for given keys.
     */
    function fetchTooltipsForKeys (keys = [])
    {
        // Ensure keys is an array and not empty
        if (!Array.isArray(keys) || keys.length === 0)
        {
            return Promise.resolve({}); // Return empty object if no keys
        }

        // Use the authenticated fetch helper
        return fetchWithAuth("http://localhost:8000/api/question-lookup", { // Replace with your actual backend URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }), // Send keys in the expected format
        })
            .then((resp) =>
            {
                // Check for non-OK response status
                if (!resp.ok)
                {
                    console.error(`Failed to fetch question mappings: ${resp.status} ${resp.statusText}`);
                    // Optionally try to read error body: await resp.text()
                    return {}; // Return empty object on error status
                }
                return resp.json(); // Parse JSON response
            })
            .catch((err) =>
            {
                // Log network or other fetch errors
                console.error("Network error fetching question mappings:", err);
                return {}; // Return empty object on fetch error
            });
    }

    /**
     * Determine a "best" unique key based on form field attributes (id, name, placeholder).
     */
    function determineBestKey (field)
    {
        // Prioritize attributes: id, name, trimmed placeholder
        const baseKey =
            field.id ||
            field.name ||
            (field.placeholder && field.placeholder.trim()) ||
            null; // Return null if none found yet

        if (baseKey) return baseKey;

        // Fallback for SELECT elements without common attributes
        if (field.tagName.toLowerCase() === "select")
        {
            // Try using the text of the first option if available
            if (field.options && field.options.length > 0)
            {
                const firstOptionText = field.options[0].text.trim();
                // Use first option text or a generic fallback
                return firstOptionText || "Select field";
            }
            // Generic fallback if no options
            return "Select field";
        }

        // Absolute fallback for other unknown fields
        return "Unknown field";
    }


    // --- Main Tooltip System (for Form Fields) ---

    /**
     * Create the main container for form field tooltips (using a shadow root).
     * This container is persistent and reused.
     */
    function createTooltipContainer ()
    {
        // Create the host element for the shadow DOM
        const container = document.createElement("div");
        container.id = "form-tooltip-container"; // Add an ID for easier debugging
        Object.assign(container.style, {
            position: "fixed", // Use fixed positioning relative to viewport
            top: "0",
            left: "0",
            width: "0", // Occupy no space initially
            height: "0",
            pointerEvents: "none", // Allow clicks to pass through the container
            zIndex: 2147483647, // Max z-index to be on top
        });
        document.body.appendChild(container);

        // Attach the shadow root
        const shadow = container.attachShadow({ mode: "open" });

        // Create and append styles specific to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            .tooltip {
                position: absolute !important; /* Crucial for positioning */
                padding: 4px 8px !important;
                background-color: rgba(0, 0, 0, 0.75) !important; /* Slightly darker */
                color: #fff !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                font-family: sans-serif !important; /* Consistent font */
                display: none; /* Hidden by default */
                pointer-events: auto !important; /* Allow interaction with tooltip content */
                white-space: normal !important; /* Allow text wrapping */
                max-width: 250px !important; /* Limit width */
                word-wrap: break-word !important;
                z-index: 1 !important; /* Relative to shadow host, already max z-index */
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .tooltip button { /* Style refresh button */
                 margin-left: 8px;
                 cursor: pointer;
                 border: none;
                 background: transparent;
                 color: #fff; /* Inherit color */
                 font-size: 11px;
                 border-radius: 3px;
                 pointer-events: auto; /* Ensure button is clickable */
                 vertical-align: middle; /* Align with text */
                 padding: 0;
            }
             .tooltip button svg { /* Style SVG inside button */
                 display: block; /* Prevent extra space below SVG */
                 vertical-align: middle;
             }
            .tooltip button:disabled {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .tooltip-text { /* Span for the main text content */
                vertical-align: middle;
            }
        `;
        shadow.appendChild(style);

        // Create the tooltip element itself within the shadow DOM
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.setAttribute("role", "tooltip"); // Accessibility
        shadow.appendChild(tooltip);

        // Return references needed elsewhere
        return { container, tooltip, shadow, hideTimer: null };
    }

    /**
     * Add a tooltip icon next to a specific form field if not already present.
     */
    function addTooltipToField (field, tooltipRef) // tooltipRef is tooltipRefGlobal
    {
        // Prevent adding multiple icons and respect the global toggle
        if (field.dataset.tooltipInjected === "true" || !tooltipsEnabled) return;

        field.dataset.tooltipInjected = "true"; // Mark field as processed
        // Determine and store the key used for this field
        field.dataset.keyUsed = field.dataset.keyUsed || determineBestKey(field);

        // Create a container for the icon (span for inline layout)
        const iconContainer = document.createElement("span");
        iconContainer.classList.add("tooltip-icon-container"); // For easy removal
        Object.assign(iconContainer.style, {
            display: "inline-flex", // Use flex for alignment
            alignItems: "center", // Vertically center icon
            marginLeft: "5px", // Space between field and icon
            marginRight: "5px", // Space if something comes after
            verticalAlign: "middle", // Align container with text/field line
            position: "relative", // Needed if icon needs absolute positioning relative to this
            zIndex: "1000", // Ensure icon is above most page elements
        });

        // Create the SVG icon element
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "18"); // Slightly smaller icon
        icon.setAttribute("height", "18");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-label", "Help Information"); // Accessibility
        icon.setAttribute("role", "img");
        icon.style.cursor = "pointer";
        icon.style.fill = "#555"; // Use a neutral color, adjust as needed
        // Adjust fill based on background might be complex here, keep simple
        icon.innerHTML = `
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm.07 15H10v-2h2.07v2zm1.07-4.75c-.73.73-1.17 1.24-1.17 2.33h-2v-.5c0-.83.44-1.61 1.17-2.34l1.24-1.24c.33-.33.49-.78.49-1.25 0-.98-.8-1.78-1.78-1.78S10 8.98 10 9.96H8c0-1.69 1.37-3.06 3.06-3.06S14.13 8.27 14.13 10c0 .89-.44 1.61-1.07 2.25z"/>
        `;

        // --- Event Handlers for the Icon ---

        // Function to show the tooltip
        const showTooltip = (evt) =>
        {
            if (!tooltipsEnabled) return; // Check global toggle again

            const usedKey = field.dataset.keyUsed;
            const question = questionMatrix[usedKey] || "No information available for this field."; // Default text

            // Clear previous content (important for refresh)
            tooltipRef.tooltip.innerHTML = "";

            // Add text content
            const textSpan = document.createElement("span");
            textSpan.classList.add("tooltip-text");
            textSpan.textContent = question;
            tooltipRef.tooltip.appendChild(textSpan);

            // Add Refresh button within tooltip
            refreshCounts[usedKey] = refreshCounts[usedKey] || 0; // Initialize count if needed
            const refreshBtn = document.createElement("button");
            refreshBtn.setAttribute("aria-label", "Refresh definition");
            // SVG for refresh icon
            refreshBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
                </svg>
            `;

            // Disable button if refresh limit reached
            if (refreshCounts[usedKey] >= 3)
            {
                refreshBtn.disabled = true;
                refreshBtn.setAttribute("title", "Refresh limit reached");
            } else
            {
                refreshBtn.setAttribute("title", "Refresh definition");
            }

            // Refresh button click handler
            refreshBtn.addEventListener("click", (clickEvent) =>
            {
                clickEvent.stopPropagation(); // Prevent event bubbling
                clickEvent.preventDefault(); // Prevent default button action

                if (refreshCounts[usedKey] >= 3) return; // Double-check limit

                const now = Date.now();
                const lastRefresh = lastRefreshTimes[usedKey] || 0;
                const cooldown = 5000; // 5 seconds cooldown

                // Enforce cooldown period
                if (now - lastRefresh < cooldown)
                {
                    console.log(`Please wait ${((cooldown - (now - lastRefresh)) / 1000).toFixed(1)}s before refreshing "${usedKey}" again.`);
                    // Optional: Briefly indicate cooldown visually (e.g., flash button red)
                    return;
                }
                lastRefreshTimes[usedKey] = now; // Update last refresh time

                // Indicate loading state (optional)
                textSpan.textContent = "Refreshing...";
                refreshBtn.disabled = true;

                // Re-fetch data specifically for this key
                fetchTooltipsForKeys([usedKey])
                    .then((data) =>
                    {
                        if (data && data[usedKey]) // Check if data and key exist
                        {
                            questionMatrix[usedKey] = data[usedKey]; // Update local store
                            textSpan.textContent = data[usedKey]; // Update tooltip text
                        } else
                        {
                            // Handle case where refresh returns no data
                            textSpan.textContent = questionMatrix[usedKey] || "Refresh failed or no data.";
                            console.warn(`Refresh for "${usedKey}" did not return data.`);
                        }
                    })
                    .catch((err) =>
                    {
                        console.error(`Failed to refresh question for "${usedKey}":`, err);
                        textSpan.textContent = "Error refreshing."; // Show error in tooltip
                    })
                    .finally(() =>
                    {
                        // Increment refresh count and update button state
                        refreshCounts[usedKey]++;
                        if (refreshCounts[usedKey] >= 3)
                        {
                            refreshBtn.disabled = true;
                            refreshBtn.setAttribute("title", "Refresh limit reached");
                        } else
                        {
                            refreshBtn.disabled = false; // Re-enable if limit not reached
                        }
                    });
            });
            tooltipRef.tooltip.appendChild(refreshBtn); // Add button to tooltip

            // --- Position and Display Tooltip ---
            tooltipRef.tooltip.style.display = "block"; // Make it visible

            const rect = icon.getBoundingClientRect(); // Get icon position
            const tooltipRect = tooltipRef.tooltip.getBoundingClientRect(); // Get tooltip size (after display block)

            // Position below the icon, centering if possible, handle screen edges
            let top = rect.bottom + window.scrollY + 5; // Below icon + scroll offset + gap
            let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2); // Center below icon

            // Adjust for left edge
            if (left < window.scrollX + 5)
            {
                left = window.scrollX + 5;
            }
            // Adjust for right edge (viewport width - tooltip width - buffer)
            if (left + tooltipRect.width > window.innerWidth - 5)
            {
                left = window.innerWidth - tooltipRect.width - 5;
            }
            // Adjust for bottom edge (if it goes off screen, try placing above)
            if (top + tooltipRect.height > window.innerHeight + window.scrollY - 5)
            {
                top = rect.top + window.scrollY - tooltipRect.height - 5; // Place above icon
            }

            tooltipRef.tooltip.style.top = `${top}px`;
            tooltipRef.tooltip.style.left = `${left}px`;

            // Clear any existing hide timer if mouse re-enters quickly
            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        };

        // Function to start the timer to hide the tooltip
        const startHideTimer = () =>
        {
            // Clear existing timer before starting a new one
            if (tooltipRef.hideTimer) clearTimeout(tooltipRef.hideTimer);

            tooltipRef.hideTimer = setTimeout(() =>
            {
                tooltipRef.tooltip.style.display = "none"; // Hide the tooltip
                tooltipRef.hideTimer = null;
            }, 500); // Hide after 0.5 seconds of mouse leaving icon/tooltip
        };

        // --- Attach Event Listeners ---
        icon.addEventListener("mouseenter", showTooltip);
        icon.addEventListener("mouseleave", startHideTimer);
        // Keep tooltip visible if mouse moves onto the tooltip itself
        tooltipRef.tooltip.addEventListener("mouseenter", () =>
        {
            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        });
        tooltipRef.tooltip.addEventListener("mouseleave", startHideTimer);

        // Append icon to its container, and container next to the field
        iconContainer.appendChild(icon);
        // Insert after the field element
        field.insertAdjacentElement("afterend", iconContainer);
    }

    /**
     * Add tooltips to all existing form fields on the page.
     */
    function processFormFields (tooltipRef) // tooltipRef is tooltipRefGlobal
    {
        // Select input, textarea, and select elements that are likely user-interactive
        document.querySelectorAll(
            'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]), textarea, select'
        ).forEach((field) =>
        {
            // Check if field is visible and not disabled before adding tooltip
            if (field.offsetParent !== null && !field.disabled)
            {
                addTooltipToField(field, tooltipRef);
            }
        });
    }

    /**
     * Observe DOM mutations; if new form fields are added, inject tooltips.
     */
    function observeDynamicFields (tooltipRef) // tooltipRef is tooltipRefGlobal
    {
        // Check if MutationObserver is supported
        if (!window.MutationObserver)
        {
            console.warn("MutationObserver not supported, dynamic fields won't get tooltips automatically.");
            return;
        }

        const observer = new MutationObserver((mutations) =>
        {
            // Use setTimeout to debounce processing, improving performance on rapid changes
            if (observer.debounceTimer) clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(() =>
            {
                let potentiallyAddedFields = [];
                mutations.forEach((mutation) =>
                {
                    mutation.addedNodes.forEach((node) =>
                    {
                        // Only process element nodes
                        if (node.nodeType === Node.ELEMENT_NODE)
                        {
                            // Check if the node itself is a target field
                            if (node.matches?.('input:not([type="hidden"]), textarea, select'))
                            {
                                potentiallyAddedFields.push(node);
                            }
                            // Check if descendants of the node are target fields
                            potentiallyAddedFields.push(...node.querySelectorAll?.('input:not([type="hidden"]), textarea, select'));
                        }
                    });
                });

                // Process unique fields found
                if (potentiallyAddedFields.length > 0)
                {
                    const uniqueFields = [...new Set(potentiallyAddedFields)]; // Ensure uniqueness
                    // Fetch keys for new fields IF they don't already have a key dataset
                    const newKeysToFetch = uniqueFields
                        .filter(f => !f.dataset.keyUsed && f.offsetParent !== null && !f.disabled)
                        .map(f => determineBestKey(f));

                    if (newKeysToFetch.length > 0)
                    {
                        fetchTooltipsForKeys([...new Set(newKeysToFetch)]) // Fetch unique new keys
                            .then(newData =>
                            {
                                questionMatrix = { ...questionMatrix, ...newData }; // Merge new data
                                // Add tooltips after data is fetched
                                uniqueFields.forEach(field =>
                                {
                                    if (field.offsetParent !== null && !field.disabled)
                                    {
                                        addTooltipToField(field, tooltipRef);
                                    }
                                });
                            });
                    } else
                    {
                        // Add tooltips directly if no new keys needed (e.g., fields re-appeared)
                        uniqueFields.forEach(field =>
                        {
                            if (field.offsetParent !== null && !field.disabled)
                            {
                                addTooltipToField(field, tooltipRef);
                            }
                        });
                    }
                }
            }, 300); // Debounce time in ms
        });

        // Observe the body (or documentElement) for additions/removals in the subtree
        observer.observe(document.body || document.documentElement, {
            childList: true, // Watch for direct children additions/removals
            subtree: true,   // Watch descendants as well
        });
    }

    /**
     * Gather unique keys from all relevant form fields currently on the page.
     */
    function gatherKeysFromFields ()
    {
        const keys = new Set();
        document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach((field) =>
        {
            // Only consider visible, enabled fields
            if (field.offsetParent !== null && !field.disabled)
            {
                const key = determineBestKey(field);
                if (key && key !== "Unknown field") keys.add(key); // Add valid keys
            }
        });
        return Array.from(keys); // Convert Set to Array
    }

    /**
     * Remove all injected tooltip icons from the page.
     */
    function removeAllTooltipIcons ()
    {
        document.querySelectorAll(".tooltip-icon-container").forEach((iconContainer) =>
        {
            // Find the associated field (usually the previous sibling)
            const maybeField = iconContainer.previousElementSibling;
            if (maybeField && maybeField.dataset) // Check if it's an element with dataset
            {
                // Mark the field so icon can be re-added if needed
                maybeField.dataset.tooltipInjected = "false";
                // Optionally remove the keyUsed dataset if keys might change
                // delete maybeField.dataset.keyUsed;
            }
            // Remove the icon container itself
            iconContainer.remove();
        });
    }

    /**
     * Enable or disable form field tooltips globally.
     */
    function toggleTooltips (enabled)
    {
        tooltipsEnabled = enabled; // Update the global state
        if (!tooltipsEnabled)
        {
            // If disabling, hide the main tooltip immediately
            if (tooltipRefGlobal && tooltipRefGlobal.tooltip)
            {
                tooltipRefGlobal.tooltip.style.display = "none";
                if (tooltipRefGlobal.hideTimer) clearTimeout(tooltipRefGlobal.hideTimer);
                tooltipRefGlobal.hideTimer = null;
            }
            // Remove all icons from the fields
            removeAllTooltipIcons();
            console.log("Form field tooltips disabled.");
        } else if (tooltipRefGlobal) // If enabling
        {
            // Re-process fields to add icons back (fetches data if needed)
            const keys = gatherKeysFromFields();
            fetchTooltipsForKeys(keys).then((data) =>
            {
                questionMatrix = data;
                processFormFields(tooltipRefGlobal); // Add icons/tooltips to existing fields
                console.log("Form field tooltips enabled.");
            });
        }
    }

    // --- Speed Dial Refresh Button ---

    /**
     * Create a floating speed dial button for refreshing all tooltips.
     */
    function createSpeedDial ()
    {
        // Prevent creating multiple speed dials
        if (document.getElementById("tooltipSpeedDial")) return;

        // Main container for the speed dial
        const speedDial = document.createElement("div");
        speedDial.id = "tooltipSpeedDial";
        Object.assign(speedDial.style, {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: 2147483646, // Slightly below tooltip container
            display: "flex",
            flexDirection: "column-reverse", // Actions appear above main button
            alignItems: "center", // Center items horizontally
        });

        // Actions container (initially hidden)
        const actionsContainer = document.createElement("div");
        Object.assign(actionsContainer.style, {
            display: "none", // Hidden by default
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "12px", // Space between actions and main button
            gap: "10px", // Space between action buttons
        });

        // Refresh Button (Action)
        const refreshButton = document.createElement("button");
        refreshButton.setAttribute("aria-label", "Refresh all tooltips");
        refreshButton.setAttribute("title", "Refresh all tooltips");
        Object.assign(refreshButton.style, {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#4b5563", // Gray background
            color: "#fff", // White icon/text
            boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        });
        // Refresh SVG Icon
        refreshButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
            </svg>
         `;
        refreshButton.addEventListener("click", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            console.log("Refreshing all form field tooltips via speed dial...");
            // Indicate loading state visually (optional)
            refreshButton.disabled = true;
            refreshButton.style.opacity = '0.6';

            const keys = gatherKeysFromFields(); // Get current keys
            fetchTooltipsForKeys(keys)
                .then((data) =>
                {
                    questionMatrix = data; // Update data store
                    removeAllTooltipIcons(); // Clear old icons first
                    processFormFields(tooltipRefGlobal); // Re-add icons with fresh data
                    console.log("All form field tooltips refreshed.");
                })
                .catch((err) =>
                {
                    console.error("Failed to refresh all tooltips via speed dial:", err);
                    // Optional: Show an error indication to the user
                })
                .finally(() =>
                {
                    // Restore button state
                    refreshButton.disabled = false;
                    refreshButton.style.opacity = '1';
                    // Hide actions after click
                    actionsContainer.style.display = "none";
                });
        });
        actionsContainer.appendChild(refreshButton); // Add to actions container

        // Main FAB (Speed Dial Trigger)
        const mainButton = document.createElement("button");
        mainButton.id = "tooltipSpeedDial_mainButton";
        mainButton.setAttribute("aria-label", "Open tooltip options");
        mainButton.setAttribute("title", "Tooltip Options");
        Object.assign(mainButton.style, {
            width: "56px", // Standard FAB size
            height: "56px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1f2937", // Dark background
            color: "#fff",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease-out", // Smooth transition for icon rotation
        });

        // Main button icon (using extension icon)
        const mainImg = document.createElement("img");
        try
        {
            mainImg.src = isBackgroundLight()
                ? chrome.runtime.getURL("icon128.png") // Use light icon on light bg
                : chrome.runtime.getURL("SC_COLOR.png"); // Use dark icon on dark bg (assuming SC_COLOR is dark theme)
        } catch (e)
        {
            console.error("Error getting extension icon URL:", e);
            mainImg.src = chrome.runtime.getURL("icon128.png"); // Fallback
        }

        mainImg.alt = ""; // Decorative image
        mainImg.style.width = "28px";
        mainImg.style.height = "28px";
        mainButton.appendChild(mainImg);

        // Toggle actions on main button click
        mainButton.addEventListener("click", () =>
        {
            const isOpen = actionsContainer.style.display === "flex";
            actionsContainer.style.display = isOpen ? "none" : "flex";
            // Rotate main button icon slightly when open (optional)
            mainButton.style.transform = isOpen ? "rotate(0deg)" : "rotate(45deg)";
        });

        // Assemble the speed dial
        speedDial.appendChild(actionsContainer);
        speedDial.appendChild(mainButton);
        document.body.appendChild(speedDial);

        // Return references (though not strictly needed with IDs)
        return { speedDial, mainButton, actionsContainer, refreshButton };
    }

    // --- Context Menu Tooltip System (for Selected Text) ---

    /**
     * Create and display a temporary tooltip for selected text near the selection.
     */
    function displayTemporaryTooltip (text, position, status = "success")
    {
        // Remove existing temporary tooltip if it exists
        if (temporaryTooltipRef)
        {
            temporaryTooltipRef.remove();
            temporaryTooltipRef = null;
        }

        // Create the tooltip element
        const tempTooltip = document.createElement("div");
        tempTooltip.setAttribute("role", "tooltip");
        tempTooltip.id = "temporary-selection-tooltip"; // For easier debugging/styling
        Object.assign(tempTooltip.style, {
            position: "absolute",
            padding: "6px 12px", // Slightly larger padding
            paddingRight: "25px", // Make space for close button initially
            backgroundColor: status === "success" ? "rgba(30, 41, 59, 0.9)" : "rgba(185, 28, 28, 0.9)", // Tailwind Slate 800 / Red 700
            color: "#f1f5f9", // Tailwind Slate 100 (light gray)
            borderRadius: "6px",
            fontSize: "13px",
            fontFamily: "sans-serif",
            zIndex: 2147483647, // Max z-index
            maxWidth: "350px", // Allow slightly wider
            wordWrap: "break-word",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            pointerEvents: "auto", // Allow interaction (for close button)
            border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border
            opacity: 0, // Start hidden for fade-in
            transform: 'translateY(5px)', // Start slightly lower for animation
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out', // Smooth fade/move
        });
        tempTooltip.textContent = text;

        // Calculate position
        let top = position.bottom + window.scrollY + 8; // Below selection + scroll offset + gap
        let left = position.left + window.scrollX;   // Align with start of selection

        // Append to body *before* getting rect for position adjustment
        document.body.appendChild(tempTooltip);
        temporaryTooltipRef = tempTooltip; // Assign reference *after* creation

        const tooltipRect = tempTooltip.getBoundingClientRect(); // Get size *after* adding to DOM

        // Adjust for left/right screen edges
        if (left < window.scrollX + 5) left = window.scrollX + 5;
        if (left + tooltipRect.width > window.innerWidth - 5)
        {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        // Adjust for bottom edge (try placing above)
        if (top + tooltipRect.height > window.innerHeight + window.scrollY - 10)
        {
            top = position.top + window.scrollY - tooltipRect.height - 8; // Place above
        }
        // Adjust for top edge (if still off screen above)
        if (top < window.scrollY + 5)
        {
            top = window.scrollY + 5;
        }

        // Apply final calculated position
        tempTooltip.style.top = `${top}px`;
        tempTooltip.style.left = `${left}px`;

        // Add a close button
        const closeButton = document.createElement("button");
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '3px', // Position inside padding
            right: '3px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
            fontSize: '18px', // Larger 'x'
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: '1',
            fontWeight: 'bold',
            borderRadius: '50%', // Make it roundish
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        closeButton.textContent = '×'; // Multiplication sign
        closeButton.setAttribute("aria-label", "Close definition");
        closeButton.onmouseenter = () => closeButton.style.color = 'rgba(255, 255, 255, 1)'; // Brighter on hover
        closeButton.onmouseleave = () => closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
        closeButton.onclick = (e) =>
        {
            e.stopPropagation();
            if (temporaryTooltipRef)
            {
                // Fade out before removing
                temporaryTooltipRef.style.opacity = '0';
                temporaryTooltipRef.style.transform = 'translateY(5px)';
                setTimeout(() =>
                {
                    if (temporaryTooltipRef) temporaryTooltipRef.remove();
                    temporaryTooltipRef = null;
                }, 200); // Match transition duration
            }
        };
        tempTooltip.appendChild(closeButton);

        // Trigger fade-in animation
        requestAnimationFrame(() =>
        {
            tempTooltip.style.opacity = 1;
            tempTooltip.style.transform = 'translateY(0)';
        });


        // Set timeout to automatically remove after a longer time (e.g., 15 seconds)
        // User can close it manually earlier with the button
        const autoCloseTimer = setTimeout(() =>
        {
            if (temporaryTooltipRef === tempTooltip) // Only remove if it's still this tooltip
            {
                closeButton.click(); // Trigger the close button's logic (includes fade out)
            }
        }, 15000); // 15 seconds

        // Store timer on the element itself to clear if closed manually
        tempTooltip.dataset.autoCloseTimer = autoCloseTimer;

        // Clear timer if closed manually
        closeButton.addEventListener('click', () =>
        {
            if (tempTooltip.dataset.autoCloseTimer)
            {
                clearTimeout(parseInt(tempTooltip.dataset.autoCloseTimer));
            }
        });
    }


    /**
     * Fetch tooltip definition for the currently selected text. Triggered by background script.
     */
    async function fetchAndShowSelectedTextTooltip ()
    {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (!selectedText)
        {
            console.log("No text selected for definition lookup.");
            return; // Nothing to do
        }

        // Optional: Limit query length to prevent abuse/long requests
        const MAX_LENGTH = 250;
        if (selectedText.length > MAX_LENGTH)
        {
            console.log(`Selected text exceeds maximum length of ${MAX_LENGTH}.`);
            // Optionally show a message to the user near the selection
            try
            {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                displayTemporaryTooltip(`Selection too long (max ${MAX_LENGTH} chars)`, rect, "error");
            } catch (e) { console.error("Could not get selection range for error message:", e); }
            return;
        }

        let range, rect;
        try
        {
            range = selection.getRangeAt(0); // Get the selection's range
            rect = range.getBoundingClientRect(); // Get its position and dimensions
        } catch (e)
        {
            console.error("Could not get selection range/rect:", e);
            // Fallback position (e.g., center of the viewport) if range fails
            rect = {
                bottom: window.innerHeight / 2 + 10, left: window.innerWidth / 2,
                top: window.innerHeight / 2 - 10, right: window.innerWidth / 2,
                width: 0, height: 20 // Minimal rect
            };
        }

        // Display a temporary "loading" message immediately
        displayTemporaryTooltip("Fetching definition...", rect, "success");

        try
        {
            // Use fetchTooltipsForKeys, treating the selected text as a single key
            // ASSUMPTION: Backend handles arbitrary strings in the 'keys' array.
            const responseData = await fetchTooltipsForKeys([selectedText]);
            const tooltipText = responseData ? responseData[selectedText] : null; // Safely access the result

            if (tooltipText)
            {
                // Display the fetched definition
                displayTemporaryTooltip(tooltipText, rect, "success");
            } else
            {
                // Display "not found" message
                displayTemporaryTooltip(`No definition found for "${selectedText}"`, rect, "error");
            }
        } catch (error)
        {
            // Handle network or other errors during fetch
            console.error("Error fetching tooltip for selection:", error);
            displayTemporaryTooltip("Error fetching definition.", rect, "error");
        }
    }


    // --- Initialization and Event Listeners ---

    /**
     * Initialize all tooltip systems on page load or readiness.
     */
    function initTooltips ()
    {
        // Ensure body exists before proceeding
        if (!document.body)
        {
            console.warn("Document body not ready for tooltip initialization.");
            return;
        }
        console.log("Initializing tooltips...");

        // 1. Create the main tooltip container (only once)
        if (!tooltipRefGlobal)
        {
            tooltipRefGlobal = createTooltipContainer();
        }

        // 2. Fetch initial data for existing form fields and add icons/tooltips IF enabled
        if (tooltipsEnabled)
        {
            const initialKeys = gatherKeysFromFields();
            fetchTooltipsForKeys(initialKeys).then((data) =>
            {
                questionMatrix = data;
                processFormFields(tooltipRefGlobal); // Add tooltips to static fields
                console.log(`Processed ${Object.keys(data).length} initial tooltips.`);
            });
        } else
        {
            console.log("Tooltips initially disabled, skipping form field processing.");
        }


        // 3. Set up observer for dynamically added fields (runs regardless of initial state)
        observeDynamicFields(tooltipRefGlobal);

        // 4. Create the speed dial refresh button (only once)
        if (!speedDialRef)
        {
            speedDialRef = createSpeedDial();
        }

        console.log("Tooltip initialization complete.");
    }

    // --- Entry Point ---

    // Get the initial enabled state from storage
    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        // Default to true if the setting is not found or is not explicitly false
        tooltipsEnabled = result.tooltipsEnabled !== false;

        // Initialize once the DOM is ready
        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", initTooltips);
        } else
        {
            // DOM is already ready
            initTooltips();
        }
    });

    // Listen for messages from the background script or popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    {
        let responseSent = false; // Flag to ensure sendResponse is called only once

        if (message.type === "TOGGLE_TOOLTIPS")
        {
            toggleTooltips(message.enabled);
            // Acknowledge the message
            sendResponse({ status: "Tooltip visibility updated", enabled: tooltipsEnabled });
            responseSent = true;
        }
        else if (message.type === "FETCH_SELECTED_TEXT_TOOLTIP")
        {
            // Trigger the fetch and display for selected text
            fetchAndShowSelectedTextTooltip()
                .then(() =>
                {
                    // Acknowledge after async operation (optional)
                    if (!responseSent)
                    {
                        sendResponse({ status: "Attempted to fetch tooltip for selection" });
                        responseSent = true;
                    }
                })
                .catch(err =>
                {
                    console.error("Error in fetchAndShowSelectedTextTooltip:", err);
                    if (!responseSent)
                    {
                        sendResponse({ status: "Error processing selection tooltip request" });
                        responseSent = true;
                    }
                });
            // Indicate that sendResponse will be called asynchronously
            return true;
        }

        // If no specific handler matched, and we haven't sent a response
        if (!responseSent)
        {
            console.log("Received unhandled message type:", message.type);
            // You might still want to send a default response or nothing
        }

        // Return true if sendResponse might be called asynchronously (as in the second case)
        // Return false or undefined otherwise. Here, we return true because of the async possibility.
        return true;

    });

})(); // End IIFE (Immediately Invoked Function Expression)