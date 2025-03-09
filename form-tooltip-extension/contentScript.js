
(function ()
{
    let questionMatrix = {};

    function createTooltipContainer ()
    {
        const tooltipContainer = document.createElement("div");
        tooltipContainer.style.position = "fixed";
        tooltipContainer.style.top = "0";
        tooltipContainer.style.left = "0";
        tooltipContainer.style.width = "100%";
        tooltipContainer.style.height = "100%";
        tooltipContainer.style.pointerEvents = "none";
        document.body.appendChild(tooltipContainer);

        const shadow = tooltipContainer.attachShadow({ mode: "open" });
        const style = document.createElement("style");

        // CHANGE #1: No '!important' for display.
        style.textContent = `
    .tooltip {
        position: absolute !important;
    padding: 4px 8px !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
    color: #fff !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    display: none; /* removed !important here */
    z-index: 999999 !important; /* optionally raise this */
    pointer-events: none !important;
    white-space: nowrap !important;
        }
    `;
        shadow.appendChild(style);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        shadow.appendChild(tooltip);

        return { container: tooltipContainer, tooltip, shadow };
    }

    function determineBestKey (field)
    {
        if (field.id) return field.id;
        if (field.name) return field.name;
        if (field.placeholder && field.placeholder.trim()) return field.placeholder.trim();
        return null;
    }

    function addTooltipToField (field, tooltipRef)
    {
        if (field.dataset.tooltipInjected) return;
        field.dataset.tooltipInjected = "true";

        if (!field.dataset.keyUsed)
        {
            field.dataset.keyUsed = determineBestKey(field) || "";
        }

        const iconContainer = document.createElement("span");
        iconContainer.style.display = "inline-flex";
        iconContainer.style.alignItems = "center";
        iconContainer.style.marginLeft = "16px";
        iconContainer.style.zIndex = "100000";

        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "20");
        icon.setAttribute("height", "20");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-label", "Help");
        icon.style.cursor = "pointer";
        icon.innerHTML = `
    <path fill="#000"
        d="M12 2C6.47 2 2 6.47
               2 12s4.47 10 10 10 10-4.47
               10-10S17.53 2 12 2zm.07
               15H10v-2h2v2zm1.07-4.75c-.73.73-1.17
               1.24-1.17 2.33h-2v-.5c0-.83.44-1.61
               1.17-2.34l1.24-1.24c.33-.33.49-.78.49-1.25
               0-.98-.8-1.78-1.78-1.78S10 8.98 10
               9.96H8c0-1.69 1.37-3.06 3.06-3.06S14
               8.27 14 10c0 .89-.44 1.61-1.07 2.25z"
    />
    `;

        icon.addEventListener("mouseenter", (e) =>
        {
            const usedKey = field.dataset.keyUsed;
            let question = "";
            if (usedKey && questionMatrix[usedKey])
            {
                question = questionMatrix[usedKey];
            } else
            {
                question = "Please fill out this field.";
            }
            tooltipRef.tooltip.textContent = question;

            tooltipRef.tooltip.style.display = "block";
            const rect = e.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";
        });

        icon.addEventListener("mousemove", (e) =>
        {
            const rect = e.target.getBoundingClientRect();
            tooltipRef.tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
            tooltipRef.tooltip.style.left = rect.left + window.scrollX + 5 + "px";
        });

        icon.addEventListener("mouseleave", () =>
        {
            tooltipRef.tooltip.style.display = "none";
        });

        iconContainer.appendChild(icon);
        field.insertAdjacentElement("afterend", iconContainer);
    }

    function processFormFields (tooltipRef)
    {
        const fields = document.querySelectorAll("input, textarea, select");
        fields.forEach((field) => addTooltipToField(field, tooltipRef));
    }

    function observeDynamicFields (tooltipRef)
    {
        const targetNode = document.body || document.documentElement;
        const observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                mutation.addedNodes.forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE)
                    {
                        if (node.matches("input, textarea, select"))
                        {
                            addTooltipToField(node, tooltipRef);
                        }
                        const childFields = node.querySelectorAll("input, textarea, select");
                        childFields.forEach((f) => addTooltipToField(f, tooltipRef));
                    }
                });
            });
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function gatherKeysFromFields ()
    {
        const fields = document.querySelectorAll("input, textarea, select");
        const uniqueKeys = new Set();
        fields.forEach((field) =>
        {
            const bestKey = determineBestKey(field);
            if (bestKey) uniqueKeys.add(bestKey);
        });
        return [...uniqueKeys];
    }

    function initTooltips ()
    {
        if (!document.body) return;

        const tooltipRef = createTooltipContainer();
        const keys = gatherKeysFromFields();

        fetch("http://localhost:3000/api/question-lookup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ keys })
        })
            .then((resp) => resp.json())
            .then((data) =>
            {
                questionMatrix = data;
                processFormFields(tooltipRef);
                observeDynamicFields(tooltipRef);
            })
            .catch((err) =>
            {
                console.error("Failed to fetch question mappings:", err);
                processFormFields(tooltipRef);
                observeDynamicFields(tooltipRef);
            });
    }

    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", initTooltips);
    } else
    {
        initTooltips();
    }
})();
