(function ()
{
    let questionMatrix = {};
    let refreshCounts = {};
    let tooltipsEnabled = true;
    let tooltipRefGlobal = null;
    let lastRefreshTimes = {};
    let speedDialRef = null;
    let temporaryTooltipRef = null;
    let activeFetches = 0;

    // --- Utility Functions ---

    function isBackgroundLight ()
    {
        try
        {
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3)
            {
                const [r, g, b] = rgb.map((x) => parseInt(x, 10));
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 128;
            }
        } catch (e)
        {
            console.warn("Could not determine background color, defaulting to light.", e);
        }
        return true;
    }

    // --- Loading Indicator Logic ---

    const loaderSVG = `
        <svg width="28" height="28" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style="display: block; margin: auto;">
            <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="3">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                    </path>
                </g>
            </g>
        </svg>`;

    function showLoaderOnSpeedDial ()
    {
        if (speedDialRef && speedDialRef.mainButton && speedDialRef.mainImg)
        {
            // Store original content if not already loading (using a data attribute)
            if (!speedDialRef.mainButton.dataset.isLoading)
            {
                speedDialRef.mainButton.dataset.originalContent = speedDialRef.mainButton.innerHTML;
                speedDialRef.mainButton.innerHTML = loaderSVG;
                speedDialRef.mainButton.dataset.isLoading = "true";
            }
        }
    }

    function hideLoaderOnSpeedDial ()
    {
        if (speedDialRef && speedDialRef.mainButton && speedDialRef.mainButton.dataset.isLoading === "true")
        {
            // Restore original content only if it was stored
            if (speedDialRef.mainButton.dataset.originalContent)
            {
                speedDialRef.mainButton.innerHTML = speedDialRef.mainButton.dataset.originalContent;
            } else
            {
                // Fallback if original somehow wasn't stored (shouldn't happen often)
                speedDialRef.mainButton.innerHTML = ''; // Clear loader
                speedDialRef.mainButton.appendChild(speedDialRef.mainImg); // Re-add original img ref
            }
            delete speedDialRef.mainButton.dataset.isLoading;
            delete speedDialRef.mainButton.dataset.originalContent;
        }
    }


    // --- Data Fetching ---

    function fetchWithAuth (url, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            // Show loader only when the first fetch starts
            if (activeFetches === 0)
            {
                showLoaderOnSpeedDial();
            }
            activeFetches++;

            chrome.storage.sync.get(["authToken"], (storageResult) =>
            {
                if (chrome.runtime.lastError)
                {
                    activeFetches--; // Decrement count on error before fetch
                    if (activeFetches === 0) hideLoaderOnSpeedDial();
                    reject(new Error(`Storage error: ${chrome.runtime.lastError.message}`));
                    return;
                }

                const bearerToken =
                    typeof storageResult.authToken === "string"
                        ? storageResult.authToken
                        : storageResult.authToken?.token || "";

                const headers = {
                    ...options.headers,
                    Authorization: `Bearer ${bearerToken}`,
                };

                fetch(url, { ...options, headers })
                    .then(resolve)
                    .catch(reject)
                    .finally(() =>
                    { // Use finally to ensure cleanup happens on success or error
                        activeFetches--;
                        // Hide loader only when the last concurrent fetch finishes
                        if (activeFetches === 0)
                        {
                            hideLoaderOnSpeedDial();
                        }
                    });
            });
        });
    }

    function fetchTooltipsForKeys (keys = [])
    {
        if (!Array.isArray(keys) || keys.length === 0)
        {
            return Promise.resolve({});
        }

        const uniqueKeys = [...new Set(keys)].filter(k => typeof k === 'string' && k.trim() !== '');
        if (uniqueKeys.length === 0)
        {
            return Promise.resolve({});
        }

        return fetchWithAuth("http://localhost:8000/api/question-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys: uniqueKeys }),
        })
            .then((resp) =>
            {
                if (!resp.ok)
                {
                    // Try to read error body if possible
                    return resp.text().then(text =>
                    {
                        return {}; // Return empty on error
                    }).catch(() => ({})); // Return empty if reading body fails too
                }
                return resp.json();
            })
            .catch((err) =>
            {
                return {}; // Return empty on network error
            });
    }


    // --- Field Identification ---

    function determineBestKey (field)
    {
        if (field.labels && field.labels.length > 0 && field.labels[0].textContent.trim())
        {
            return field.labels[0].textContent.trim();
        }
        if (field.id)
        {
            const labelElement = document.querySelector(`label[for="${field.id}"]`);
            if (labelElement && labelElement.textContent.trim())
            {
                return labelElement.textContent.trim();
            }
        }

        // Prioritize data-tooltip-key attribute if present
        if (field.dataset.tooltipKey && field.dataset.tooltipKey.trim())
        {
            return field.dataset.tooltipKey.trim();
        }

        const baseKey = field.name || field.id || null; // Use name before id as fallback after label/data-attr
        if (baseKey) return baseKey;

        if (field.tagName.toLowerCase() === "select")
        {
            if (field.options && field.options.length > 0)
            {
                for (let i = 0; i < field.options.length; i++)
                {
                    const optionText = field.options[i].text.trim();
                    // More robust check for placeholder options
                    if (optionText && !/^(select|choose|\-\-|please select|select an option)/i.test(optionText) && field.options[i].value !== '')
                    {
                        return optionText; // Use first meaningful option text
                    }
                }
                // If only placeholder options, use the first one or a default
                const firstOptionText = field.options[0]?.text.trim();
                return firstOptionText || "Select field";
            }
            return "Select field"; // Default for empty select
        }

        if (field.placeholder && field.placeholder.trim())
        {
            return field.placeholder.trim();
        }

        // Added: Try aria-label or aria-labelledby as a last resort
        const ariaLabel = field.getAttribute('aria-label');
        if (ariaLabel && ariaLabel.trim())
        {
            return ariaLabel.trim();
        }
        const ariaLabelledBy = field.getAttribute('aria-labelledby');
        if (ariaLabelledBy)
        {
            const labelledByElement = document.getElementById(ariaLabelledBy);
            if (labelledByElement && labelledByElement.textContent.trim())
            {
                return labelledByElement.textContent.trim();
            }
        }


        return null; // Return null if no suitable key found
    }

    // --- Tooltip UI ---

    function createTooltipContainer ()
    {
        const container = document.createElement("div");
        container.id = "form-tooltip-container";
        Object.assign(container.style, {
            position: "fixed", // Important for positioning relative to viewport
            top: "0",
            left: "0",
            width: "0", // Takes no space itself
            height: "0",
            pointerEvents: "none", // Allows clicks to pass through container
            zIndex: 2147483647, // Max z-index
        });
        document.body.appendChild(container);

        const shadow = container.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        style.textContent = `
            .tooltip {
                position: absolute !important; /* Positioned relative to the fixed container */
                padding: 4px 8px !important;
                background-color: rgba(0, 0, 0, 0.85) !important;
                color: #fff !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                font-family: sans-serif !important;
                display: none; /* Initially hidden */
                pointer-events: auto !important; /* Allows interaction with tooltip */
                white-space: normal !important;
                max-width: 250px !important;
                word-wrap: break-word !important;
                z-index: 1 !important; /* Stack within the container */
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                line-height: 1.4;
            }
            .tooltip button {
                margin-left: 8px;
                cursor: pointer;
                border: none;
                background: transparent;
                color: #a7a7a7; /* Lighter color for icon */
                font-size: 11px;
                border-radius: 3px;
                pointer-events: auto;
                vertical-align: middle;
                padding: 0;
                line-height: 1;
            }
             .tooltip button:hover {
                 color: #ffffff;
             }
            .tooltip button svg {
                display: block; /* Prevents extra space below SVG */
                vertical-align: middle; /* Align icon with text */
            }
            .tooltip button:disabled {
                cursor: not-allowed;
                opacity: 0.4;
                color: #777777 !important; /* Distinct disabled color */
            }
            .tooltip-text {
                vertical-align: middle; /* Align text with button */
            }
        `;
        shadow.appendChild(style);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.setAttribute("role", "tooltip");
        shadow.appendChild(tooltip);

        return { container, tooltip, shadow, hideTimer: null };
    }

    function addTooltipToField (field, tooltipRef)
    {
        // Ensure field is valid and hasn't already been processed
        if (!field || field.dataset.tooltipInjected === "true" || !tooltipsEnabled) return;

        // Only add to fields within a form and visible
        if (!field.closest('form') || field.offsetParent === null)
        {
            return;
        }

        // Try to find the key. If no key, don't add icon.
        const key = determineBestKey(field);
        if (!key)
        {
            return;
        }
        field.dataset.keyUsed = key;

        // Check if we actually have a definition for this key before adding icon
        if (!questionMatrix[key])
        {
            return;
        }

        field.dataset.tooltipInjected = "true"; // Mark as processed

        const iconContainer = document.createElement("span");
        iconContainer.classList.add("tooltip-icon-container");
        // Basic styling, can be adjusted
        Object.assign(iconContainer.style, {
            display: "inline-flex", // Use inline-flex for better alignment
            alignItems: "center",
            marginLeft: "5px",
            verticalAlign: "middle", // Align with text/input middle
            position: "relative", // Needed if any absolute positioning inside later
            zIndex: "1000", // Ensure icon is clickable over other elements
            cursor: "pointer", // Indicate clickability
        });

        // The ONLY two lines changed: make the icon 24×24 instead of 16×16
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "24"); // bigger icon for better visibility
        icon.setAttribute("height", "24");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-label", "Help Information");
        icon.setAttribute("role", "img");
        icon.style.fill = "#555"; // Standard icon color
        icon.style.display = 'block'; // Prevent extra space below icon
        icon.innerHTML = `
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v2h-2zm0 4h2v4h-2z"/>
            <path fill="none" d="M0 0h24v24H0z"/>
        `;

        const showTooltip = (evt) =>
        {
            if (!tooltipsEnabled || !tooltipRef) return; // Check tooltipRef exists

            const usedKey = field.dataset.keyUsed;
            const question = questionMatrix[usedKey] || "No information available for this field.";

            tooltipRef.tooltip.innerHTML = ""; // Clear previous content

            const textSpan = document.createElement("span");
            textSpan.classList.add("tooltip-text");
            textSpan.textContent = question;
            tooltipRef.tooltip.appendChild(textSpan);

            // --- Refresh Button ---
            refreshCounts[usedKey] = refreshCounts[usedKey] || 0;
            const refreshBtn = document.createElement("button");
            refreshBtn.setAttribute("aria-label", "Refresh definition");
            refreshBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
                </svg>
            `;
            if (refreshCounts[usedKey] >= 3)
            {
                refreshBtn.disabled = true;
                refreshBtn.setAttribute("title", "Refresh limit reached (3 max)");
            } else
            {
                refreshBtn.setAttribute("title", "Refresh definition");
            }

            refreshBtn.addEventListener("click", (clickEvent) =>
            {
                clickEvent.stopPropagation(); // Prevent tooltip closing
                clickEvent.preventDefault();

                if (refreshBtn.disabled) return; // Already checked count, but good practice

                const now = Date.now();
                const lastRefresh = lastRefreshTimes[usedKey] || 0;
                const cooldown = 5000; // 5 seconds

                if (now - lastRefresh < cooldown)
                {
                    const waitTime = ((cooldown - (now - lastRefresh)) / 1000).toFixed(1);
                    console.log(`Please wait ${waitTime}s before refreshing "${usedKey}" again.`);
                    const originalText = textSpan.textContent;
                    textSpan.textContent = `Wait ${waitTime}s...`;
                    setTimeout(() =>
                    {
                        if (textSpan.textContent === `Wait ${waitTime}s...`)
                        {
                            textSpan.textContent = originalText;
                        }
                    }, 1500);
                    return;
                }
                lastRefreshTimes[usedKey] = now; // Update last refresh time immediately

                textSpan.textContent = "Refreshing...";
                refreshBtn.disabled = true; // Disable while fetching

                fetchTooltipsForKeys([usedKey]) // Re-fetches using the main authenticated function
                    .then((data) =>
                    {
                        if (data && data[usedKey])
                        {
                            questionMatrix[usedKey] = data[usedKey]; // Update global matrix
                            textSpan.textContent = data[usedKey]; // Update tooltip text
                            refreshCounts[usedKey]++; // Increment count only on successful fetch
                        } else
                        {
                            textSpan.textContent = questionMatrix[usedKey] || "Refresh failed.";
                            console.warn(`Refresh for "${usedKey}" did not return data or failed.`);
                        }
                    })
                    .catch((err) =>
                    {
                        textSpan.textContent = "Error refreshing.";
                    })
                    .finally(() =>
                    {
                        if (refreshCounts[usedKey] >= 3)
                        {
                            refreshBtn.disabled = true;
                            refreshBtn.setAttribute("title", "Refresh limit reached (3 max)");
                        } else
                        {
                            refreshBtn.disabled = false;
                        }
                        if (tooltipRef.hideTimer) clearTimeout(tooltipRef.hideTimer);
                        tooltipRef.hideTimer = null;
                    });
            });
            tooltipRef.tooltip.appendChild(refreshBtn);

            tooltipRef.tooltip.style.display = "block"; // Make visible *before* getting rect

            const iconRect = icon.getBoundingClientRect();
            const tooltipRect = tooltipRef.tooltip.getBoundingClientRect(); // Get dimensions after display:block

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 8;

            let potentialTop = iconRect.bottom + margin;
            let potentialLeft = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);

            if (potentialTop + tooltipRect.height > viewportHeight - margin)
            {
                potentialTop = iconRect.top - tooltipRect.height - margin;
            }
            if (potentialTop < margin)
            {
                potentialTop = margin;
            }
            if (potentialLeft < margin)
            {
                potentialLeft = margin;
            }
            if (potentialLeft + tooltipRect.width > viewportWidth - margin)
            {
                potentialLeft = viewportWidth - tooltipRect.width - margin;
            }

            tooltipRef.tooltip.style.top = `${potentialTop}px`;
            tooltipRef.tooltip.style.left = `${potentialLeft}px`;

            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        };

        const startHideTimer = () =>
        {
            if (!tooltipRef) return;
            if (tooltipRef.hideTimer) clearTimeout(tooltipRef.hideTimer);

            tooltipRef.hideTimer = setTimeout(() =>
            {
                if (tooltipRef && tooltipRef.tooltip)
                {
                    tooltipRef.tooltip.style.display = "none";
                }
                tooltipRef.hideTimer = null;
            }, 300);
        };

        icon.addEventListener("mouseenter", showTooltip);
        icon.addEventListener("focus", showTooltip);
        icon.addEventListener("mouseleave", startHideTimer);
        icon.addEventListener("blur", startHideTimer);

        tooltipRef.tooltip.addEventListener("mouseenter", () =>
        {
            if (tooltipRef.hideTimer)
            {
                clearTimeout(tooltipRef.hideTimer);
                tooltipRef.hideTimer = null;
            }
        });
        tooltipRef.tooltip.addEventListener("mouseleave", startHideTimer);

        iconContainer.appendChild(icon);

        const fieldParent = field.parentNode;
        let nextElement = field.nextElementSibling;
        let fieldLabel = field.id ? document.querySelector(`label[for="${field.id}"]`) : null;

        if (fieldLabel && nextElement === fieldLabel)
        {
            fieldLabel.insertAdjacentElement("afterend", iconContainer);
        }
        else if (field.labels && field.labels.length > 0 && field.labels[0] === fieldParent)
        {
            field.insertAdjacentElement('afterend', iconContainer);
        }
        else
        {
            field.insertAdjacentElement("afterend", iconContainer);
        }

    } // End addTooltipToField


    // --- DOM Processing and Observation ---

    function processFormFields (tooltipRef)
    {
        if (!tooltipsEnabled) return;

        document.querySelectorAll(
            'form input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not(:disabled), form textarea:not(:disabled), form select:not(:disabled)'
        ).forEach((field) =>
        {
            if (field.offsetParent !== null)
            {
                addTooltipToField(field, tooltipRef);
            }
        });
    }

    function observeDynamicFields (tooltipRef)
    {
        if (!window.MutationObserver)
        {
            console.warn("MutationObserver not supported, dynamic fields won't get tooltips automatically.");
            return;
        }

        const observer = new MutationObserver((mutations) =>
        {
            if (observer.debounceTimer) clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(() =>
            {
                if (!tooltipsEnabled) return;

                let potentiallyAddedFields = [];
                mutations.forEach((mutation) =>
                {
                    mutation.addedNodes.forEach((node) =>
                    {
                        if (node.nodeType === Node.ELEMENT_NODE)
                        {
                            if (node.matches?.('form input:not([type="hidden"]), form textarea, form select'))
                            {
                                potentiallyAddedFields.push(node);
                            }
                            potentiallyAddedFields.push(...node.querySelectorAll?.('form input:not([type="hidden"]), form textarea, form select'));
                        }
                    });
                    if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE)
                    {
                        if (mutation.target.matches?.('form input:not([type="hidden"]), form textarea, form select'))
                        {
                            potentiallyAddedFields.push(mutation.target);
                        }
                    }
                });

                if (potentiallyAddedFields.length > 0)
                {
                    const uniqueFields = [...new Set(potentiallyAddedFields)];
                    const fieldsToAddIcons = uniqueFields.filter(f =>
                        f.offsetParent !== null &&
                        !f.disabled &&
                        f.closest('form') &&
                        f.dataset.tooltipInjected !== "true"
                    );

                    if (fieldsToAddIcons.length > 0)
                    {
                        const newKeysToFetch = fieldsToAddIcons
                            .map(f => determineBestKey(f))
                            .filter(key => key && !questionMatrix.hasOwnProperty(key));

                        const uniqueNewKeys = [...new Set(newKeysToFetch)];

                        const processFieldsAfterFetch = () =>
                        {
                            fieldsToAddIcons.forEach(field =>
                            {
                                if (field.offsetParent !== null && !field.disabled && field.closest('form') && field.dataset.tooltipInjected !== "true")
                                {
                                    const key = field.dataset.keyUsed || determineBestKey(field);
                                    if (key && questionMatrix[key])
                                    {
                                        addTooltipToField(field, tooltipRef);
                                    }
                                }
                            });
                        };

                        if (uniqueNewKeys.length > 0)
                        {
                            console.log('Fetching tooltips for dynamically added/updated keys:', uniqueNewKeys);
                            fetchTooltipsForKeys(uniqueNewKeys)
                                .then(newData =>
                                {
                                    questionMatrix = { ...questionMatrix, ...newData };
                                    processFieldsAfterFetch();
                                })
                                .catch(err =>
                                {
                                    processFieldsAfterFetch();
                                });
                        } else
                        {
                            processFieldsAfterFetch();
                        }
                    }
                }
            }, 500);
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'style', 'class']
        });
    }

    function gatherKeysFromFields ()
    {
        const keys = new Set();
        document.querySelectorAll(
            'form input:not([type="hidden"]), form textarea, form select'
        ).forEach((field) =>
        {
            if (field.offsetParent !== null && !field.disabled)
            {
                const key = determineBestKey(field);
                if (key) keys.add(key);
            }
        });
        return Array.from(keys);
    }

    function removeAllTooltipIcons ()
    {
        document.querySelectorAll(".tooltip-icon-container").forEach((iconContainer) =>
        {
            try
            {
                const field = iconContainer.parentElement.querySelector('input, textarea, select');
                if (field && field.dataset)
                {
                    field.dataset.tooltipInjected = "false";
                    delete field.dataset.keyUsed;
                }
            } catch (e)
            {
                console.warn("Could not reliably find field to reset tooltip status", e);
            }

            iconContainer.remove();
        });
        refreshCounts = {};
        lastRefreshTimes = {};
    }

    function toggleTooltips (enabled)
    {
        const changed = tooltipsEnabled !== enabled;
        tooltipsEnabled = enabled;

        if (!changed) return;

        if (!tooltipsEnabled)
        {
            if (tooltipRefGlobal && tooltipRefGlobal.tooltip)
            {
                tooltipRefGlobal.tooltip.style.display = "none";
                if (tooltipRefGlobal.hideTimer) clearTimeout(tooltipRefGlobal.hideTimer);
                tooltipRefGlobal.hideTimer = null;
            }
            removeAllTooltipIcons();
            console.log("Form field tooltips disabled.");
        } else if (tooltipRefGlobal)
        {
            console.log("Form field tooltips enabled. Processing fields...");
            const keys = gatherKeysFromFields();
            fetchTooltipsForKeys(keys).then((data) =>
            {
                questionMatrix = data;
                processFormFields(tooltipRefGlobal);
                console.log(`Processed ${Object.keys(data).length} tooltips on enable.`);
            });
        }

        if (speedDialRef && speedDialRef.mainButton)
        {
            speedDialRef.mainButton.style.opacity = enabled ? '1' : '0.7';
            speedDialRef.mainButton.title = enabled ? "Tooltip Options" : "Tooltips Disabled";
            if (!enabled && speedDialRef.actionsContainer.style.display === 'flex')
            {
                speedDialRef.actionsContainer.style.display = 'none';
                speedDialRef.mainButton.style.transform = "rotate(0deg)";
            }
        }
    }


    // --- Speed Dial UI ---

    function createSpeedDial ()
    {
        if (document.getElementById("tooltipSpeedDial") || !document.body) return;

        const speedDial = document.createElement("div");
        speedDial.id = "tooltipSpeedDial";
        Object.assign(speedDial.style, {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: 2147483646,
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
        });

        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("tooltip-speed-dial-actions");
        Object.assign(actionsContainer.style, {
            display: "none",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "12px",
            gap: "10px",
        });

        const refreshButton = document.createElement("button");
        refreshButton.setAttribute("aria-label", "Refresh all tooltips");
        refreshButton.setAttribute("title", "Refresh all tooltips");
        Object.assign(refreshButton.style, {
            width: "40px", height: "40px", borderRadius: "50%", border: "none", cursor: "pointer",
            backgroundColor: "#4b5563",
            color: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: 'background-color 0.2s ease',
        });
        refreshButton.onmouseenter = () => refreshButton.style.backgroundColor = '#6b7280';
        refreshButton.onmouseleave = () => refreshButton.style.backgroundColor = '#4b5563';

        refreshButton.innerHTML = `
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                 <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/>
             </svg>
            `;
        refreshButton.addEventListener("click", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();

            if (!tooltipsEnabled)
            {
                console.log("Tooltips are disabled, cannot refresh.");
                actionsContainer.style.display = "none";
                if (speedDialRef && speedDialRef.mainButton) speedDialRef.mainButton.style.transform = "rotate(0deg)";
                return;
            }
            console.log("Refreshing all form field tooltips via speed dial...");
            refreshButton.disabled = true;
            refreshButton.style.opacity = '0.6';
            refreshButton.style.cursor = 'not-allowed';

            const keys = gatherKeysFromFields();
            fetchTooltipsForKeys(keys)
                .then((data) =>
                {
                    questionMatrix = data;
                    removeAllTooltipIcons();
                    processFormFields(tooltipRefGlobal);
                    console.log("All form field tooltips refreshed.");
                })
                .catch((err) =>
                {
                })
                .finally(() =>
                {
                    refreshButton.disabled = false;
                    refreshButton.style.opacity = '1';
                    refreshButton.style.cursor = 'pointer';
                    actionsContainer.style.display = "none";
                    if (speedDialRef && speedDialRef.mainButton) speedDialRef.mainButton.style.transform = "rotate(0deg)";
                });
        });
        actionsContainer.appendChild(refreshButton);

        const mainButton = document.createElement("button");
        mainButton.id = "tooltipSpeedDial_mainButton";
        mainButton.setAttribute("aria-label", "Open tooltip options");
        mainButton.setAttribute("title", tooltipsEnabled ? "Tooltip Options" : "Tooltips Disabled");
        Object.assign(mainButton.style, {
            width: "56px", height: "56px", borderRadius: "50%", border: "none", cursor: "pointer",
            backgroundColor: "#1f2937",
            color: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.2s ease-out, background-color 0.2s ease, opacity 0.2s ease",
            opacity: tooltipsEnabled ? '1' : '0.7',
        });
        mainButton.onmouseenter = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#374151'; };
        mainButton.onmouseleave = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#1f2937'; };

        const mainImg = document.createElement("img");
        mainImg.alt = "";
        mainImg.style.width = "28px";
        mainImg.style.height = "28px";
        try
        {
            const iconPath = isBackgroundLight() ? "icon128.png" : "SC_COLOR.png";
            mainImg.src = chrome.runtime.getURL(iconPath);
        } catch (e)
        {
            try { mainImg.src = chrome.runtime.getURL("icon128.png"); } catch { }
        }
        mainButton.appendChild(mainImg);

        mainButton.addEventListener("click", () =>
        {
            if (!tooltipsEnabled)
            {
                console.log("Tooltips disabled, options unavailable.");
                return;
            }
            if (mainButton.dataset.isLoading === 'true')
            {
                return;
            }

            const isOpen = actionsContainer.style.display === "flex";
            actionsContainer.style.display = isOpen ? "none" : "flex";
            mainButton.style.transform = isOpen ? "rotate(0deg)" : "rotate(45deg)";
        });

        speedDial.appendChild(actionsContainer);
        speedDial.appendChild(mainButton);
        document.body.appendChild(speedDial);

        return { speedDial, mainButton, actionsContainer, refreshButton, mainImg };
    }


    // --- Temporary Tooltip for Selection ---

    function displayTemporaryTooltip (text, position, status = "success")
    {
        if (temporaryTooltipRef)
        {
            if (temporaryTooltipRef.dataset.autoCloseTimer)
            {
                clearTimeout(parseInt(temporaryTooltipRef.dataset.autoCloseTimer));
            }
            temporaryTooltipRef.remove();
            temporaryTooltipRef = null;
        }

        const tempTooltip = document.createElement("div");
        tempTooltip.setAttribute("role", "status");
        tempTooltip.id = "temporary-selection-tooltip";
        Object.assign(tempTooltip.style, {
            position: "absolute",
            padding: "6px 12px",
            paddingRight: "25px",
            backgroundColor: status === "success" ? "rgba(30, 41, 59, 0.95)" : "rgba(185, 28, 28, 0.95)",
            color: "#f1f5f9",
            borderRadius: "6px",
            fontSize: "13px",
            fontFamily: "sans-serif",
            zIndex: 2147483647,
            maxWidth: "350px",
            wordWrap: "break-word",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            pointerEvents: "auto",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            opacity: 0,
            transform: 'translateY(5px)',
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            lineHeight: '1.4',
        });
        tempTooltip.textContent = text;

        position = position || { bottom: window.innerHeight / 2 + 10, left: window.innerWidth / 2, top: window.innerHeight / 2 - 10, width: 0, height: 20 };

        let top = (position.bottom || 0) + window.scrollY + 8;
        let left = (position.left || 0) + window.scrollX;

        document.body.appendChild(tempTooltip);
        temporaryTooltipRef = tempTooltip;

        const tooltipRect = tempTooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const margin = 5;

        if (top + tooltipRect.height > viewportHeight + scrollY - margin)
        {
            top = (position.top || 0) + scrollY - tooltipRect.height - 8;
        }
        if (top < scrollY + margin) top = scrollY + margin;
        if (left < scrollX + margin) left = scrollX + margin;
        if (left + tooltipRect.width > viewportWidth + scrollX - margin)
        {
            left = viewportWidth + scrollX - tooltipRect.width - margin;
        }

        tempTooltip.style.top = `${top}px`;
        tempTooltip.style.left = `${left}px`;

        const closeButton = document.createElement("button");
        Object.assign(closeButton.style, {
            position: 'absolute', top: '3px', right: '3px', background: 'transparent', border: 'none',
            color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', cursor: 'pointer', padding: '0 4px',
            lineHeight: '1', fontWeight: 'bold', borderRadius: '50%', width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        closeButton.textContent = '×';
        closeButton.setAttribute("aria-label", "Close definition");
        closeButton.onmouseenter = () => closeButton.style.color = 'rgba(255, 255, 255, 1)';
        closeButton.onmouseleave = () => closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
        closeButton.onclick = (e) =>
        {
            e.stopPropagation();
            if (temporaryTooltipRef)
            {
                temporaryTooltipRef.style.opacity = '0';
                temporaryTooltipRef.style.transform = 'translateY(5px)';
                if (temporaryTooltipRef.dataset.autoCloseTimer)
                {
                    clearTimeout(parseInt(temporaryTooltipRef.dataset.autoCloseTimer));
                }
                setTimeout(() =>
                {
                    if (temporaryTooltipRef) temporaryTooltipRef.remove();
                    temporaryTooltipRef = null;
                }, 200);
            }
        };
        tempTooltip.appendChild(closeButton);

        requestAnimationFrame(() =>
        {
            requestAnimationFrame(() =>
            {
                tempTooltip.style.opacity = 1;
                tempTooltip.style.transform = 'translateY(0)';
            });
        });

        const autoCloseDuration = status === "success" ? 15000 : 8000;
        const autoCloseTimer = setTimeout(() =>
        {
            if (temporaryTooltipRef === tempTooltip)
            {
                closeButton.click();
            }
        }, autoCloseDuration);

        tempTooltip.dataset.autoCloseTimer = autoCloseTimer.toString();
    }

    async function fetchAndShowSelectedTextTooltip ()
    {
        if (!tooltipsEnabled)
        {
            console.log("Tooltips disabled, cannot fetch definition for selection.");
            return;
        }

        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();

        if (!selectedText)
        {
            console.log("No text selected for definition lookup.");
            return;
        }

        const MAX_LENGTH = 250;
        let range, rect;

        try
        {
            range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if (!range) throw new Error("No range in selection");

            const clientRects = range.getClientRects();
            rect = clientRects.length > 0 ? clientRects[0] : range.getBoundingClientRect();

            rect = {
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                right: rect.left + 1,
                width: 1,
                height: rect.height
            };

        } catch (e)
        {
            rect = { bottom: window.innerHeight / 2 + 10, left: window.innerWidth / 2, top: window.innerHeight / 2 - 10 };
        }

        if (selectedText.length > MAX_LENGTH)
        {
            console.log(`Selected text exceeds maximum length of ${MAX_LENGTH}.`);
            displayTemporaryTooltip(`Selection too long (max ${MAX_LENGTH} chars). Selected ${selectedText.length}.`, rect, "error");
            return;
        }

        displayTemporaryTooltip("Fetching definition...", rect, "success");

        try
        {
            const responseData = await fetchTooltipsForKeys([selectedText]);
            const tooltipText = responseData ? responseData[selectedText] : null;

            if (tooltipText)
            {
                displayTemporaryTooltip(tooltipText, rect, "success");
            } else
            {
                displayTemporaryTooltip(`No definition found for "${selectedText}"`, rect, "error");
            }
        } catch (error)
        {
            displayTemporaryTooltip("Error fetching definition.", rect, "error");
        }
    }


    // --- Initialization and Event Listeners ---

    function initTooltips ()
    {
        if (!document.body)
        {
            console.warn("Document body not ready for tooltip initialization.");
            setTimeout(initTooltips, 100);
            return;
        }
        console.log("Initializing tooltips...");

        if (!tooltipRefGlobal)
        {
            tooltipRefGlobal = createTooltipContainer();
        }

        if (tooltipsEnabled)
        {
            removeAllTooltipIcons();
            const initialKeys = gatherKeysFromFields();
            console.log(`Found ${initialKeys.length} initial keys from form fields.`);
            if (initialKeys.length > 0)
            {
                fetchTooltipsForKeys(initialKeys).then((data) =>
                {
                    questionMatrix = data;
                    processFormFields(tooltipRefGlobal);
                    console.log(`Processed ${Object.keys(data).length} initial tooltips.`);
                }).catch(err => { });
            } else
            {
                console.log("No initial fields found to process.");
            }
        } else
        {
            console.log("Tooltips initially disabled, skipping form field processing.");
            removeAllTooltipIcons();
        }

        observeDynamicFields(tooltipRefGlobal);

        if (!speedDialRef && document.body)
        {
            speedDialRef = createSpeedDial();
        } else if (speedDialRef && speedDialRef.mainButton)
        {
            speedDialRef.mainButton.style.opacity = tooltipsEnabled ? '1' : '0.7';
            speedDialRef.mainButton.title = tooltipsEnabled ? "Tooltip Options" : "Tooltips Disabled";
        }

        console.log("Tooltip initialization complete.");
    }

    chrome.storage.sync.get(["tooltipsEnabled"], (result) =>
    {
        if (chrome.runtime.lastError)
        {
            tooltipsEnabled = true;
        } else
        {
            tooltipsEnabled = result.tooltipsEnabled !== false;
        }

        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", initTooltips);
        } else
        {
            initTooltips();
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    {
        let responseSent = false;
        const sendAsyncResponse = (response) =>
        {
            if (!responseSent)
            {
                sendResponse(response);
                responseSent = true;
            }
        };

        if (message.type === "TOGGLE_TOOLTIPS")
        {
            toggleTooltips(message.enabled);
            sendAsyncResponse({ status: "Tooltip visibility updated", enabled: tooltipsEnabled });
        }
        else if (message.type === "FETCH_SELECTED_TEXT_TOOLTIP")
        {
            fetchAndShowSelectedTextTooltip()
                .then(() =>
                {
                    sendAsyncResponse({ status: "Attempted to fetch tooltip for selection" });
                })
                .catch(err =>
                {
                    sendAsyncResponse({ status: "Error processing selection tooltip request", error: err.message });
                });
            return true;
        }
        else
        {
            console.log("Received unhandled message type in content script:", message.type, message);
        }

        return message.type === "FETCH_SELECTED_TEXT_TOOLTIP";
    });
})();
