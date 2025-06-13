// A self-contained module for running an interactive product tour.

let demoOverlay = null;
let currentStep = -1;
let tourSteps = [];
let originalStyles = new Map();

/**
 * Creates the necessary DOM elements for the demo overlay and message box.
 */
function createDemoUI ()
{
    if (document.getElementById('simpleform-demo-overlay')) return;

    // Main overlay
    demoOverlay = document.createElement('div');
    demoOverlay.id = 'simpleform-demo-overlay';
    Object.assign(demoOverlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0)', // Start transparent, will be faded in by highlight
        zIndex: 2147483647,
        display: 'none',
        transition: 'opacity 0.3s ease-in-out',
        opacity: 0
    });

    // Message box
    const messageBox = document.createElement('div');
    messageBox.id = 'simpleform-demo-message';
    Object.assign(messageBox.style, {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        color: '#212529',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '380px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        fontFamily: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
        fontSize: '15px',
        lineHeight: '1.6'
    });

    messageBox.innerHTML = `
        <p id="simpleform-demo-text" style="margin: 0 0 16px 0;"></p>
        <div style="display: flex; justify-content: flex-end; align-items: center;">
            <button id="simpleform-demo-end" style="background: none; border: none; color: #555; cursor: pointer; font-size: 14px;">End Demo</button>
            <button id="simpleform-demo-next" style="background-color: #116530; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-left: 12px; font-size: 14px;">Next</button>
        </div>
    `;

    demoOverlay.appendChild(messageBox);
    document.body.appendChild(demoOverlay);

    document.getElementById('simpleform-demo-next').onclick = advanceDemo;
    document.getElementById('simpleform-demo-end').onclick = endDemo;
}

/**
 * Cleans up all demo-related elements and styles from the DOM.
 */
function cleanupDemo ()
{
    if (demoOverlay)
    {
        demoOverlay.remove();
        demoOverlay = null;
    }
    // Restore original styles
    originalStyles.forEach((style, element) =>
    {
        element.style.outline = style.outline;
        element.style.boxShadow = style.boxShadow;
        element.style.zIndex = style.zIndex;
        element.style.position = style.position;
    });
    originalStyles.clear();
}

/**
 * Highlights a specific element by bringing it to the front and dimming the rest of the page.
 * @param {HTMLElement | null} element The element to highlight.
 */
function highlightElement (element)
{
    // Clear previous highlights and restore styles
    originalStyles.forEach((style, el) =>
    {
        el.style.outline = style.outline;
        el.style.boxShadow = style.boxShadow;
        el.style.zIndex = style.zIndex;
        el.style.position = style.position;
    });
    originalStyles.clear();

    if (!element) return;

    // Save original styles before overwriting
    originalStyles.set(element, {
        outline: element.style.outline,
        boxShadow: element.style.boxShadow,
        zIndex: element.style.zIndex,
        position: element.style.position
    });

    element.style.outline = '3px solid #D4A017';
    element.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
    element.style.zIndex = '2147483647';
    element.style.position = 'relative';
}

/**
 * Displays the message for the current demo step, positioned relative to the highlighted element.
 * @param {string} text The message text to display.
 * @param {HTMLElement | null} element The element the message relates to.
 */
function showStepMessage (text, element)
{
    const messageBox = document.getElementById('simpleform-demo-message');
    if (!messageBox) return;

    document.getElementById('simpleform-demo-text').innerHTML = text;

    if (element)
    {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        // Timeout allows for scroll to finish before calculating position
        setTimeout(() =>
        {
            const rect = element.getBoundingClientRect();
            messageBox.style.transform = '';
            let top = rect.bottom + 15;
            let left = rect.left;

            if (top + messageBox.offsetHeight > window.innerHeight)
            {
                top = rect.top - messageBox.offsetHeight - 15;
            }
            if (left + messageBox.offsetWidth > window.innerWidth)
            {
                left = window.innerWidth - messageBox.offsetWidth - 15;
            }
            if (left < 15)
            {
                left = 15;
            }

            messageBox.style.top = `${top + window.scrollY}px`;
            messageBox.style.left = `${left + window.scrollX}px`;
        }, 300); // Adjust timeout if scrolling is slower

    } else
    {
        // Center the message box if no element is targeted
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
    }
}

/**
 * Defines the sequence of steps for the interactive tour.
 */
function defineTourSteps ()
{
    tourSteps = [
        {
            text: "Welcome to the <strong>SimpleForm</strong> demo! Let's take a quick look at the features.",
        },
        {
            selector: '.tooltip-icon-container',
            text: "We automatically add these <strong>help icons</strong> next to form fields. Hover over or click them to get a quick definition.",
            fallbackText: "This page doesn't seem to have any forms, but if it did, you'd see help icons next to the fields."
        },
        {
            selector: '#tooltipSpeedDial_mainButton',
            text: "This floating button is the <strong>Speed Dial</strong>. Clicking it reveals several quick actions.",
            action: (element) =>
            {
                if (element)
                {
                    element.click(); // Programmatically click the button to open the menu
                }
            },
            fallbackText: "The Speed Dial provides quick actions. It seems to be hidden right now, but you can enable it from the extension popup."
        },
        {
            selector: '.tooltip-speed-dial-actions button[aria-label="Refresh all tooltips"]',
            text: "The <strong>Refresh</strong> button rescans the page for form fields and fetches the latest definitions for all of them at once.",
        },
        {
            selector: '.tooltip-speed-dial-actions button[aria-label="Open Question Assistant"]',
            text: "The <strong>Question Assistant</strong> opens a chat window where you can ask for definitions directly, instead of finding them on the page.",
        },
        {
            selector: '.tooltip-speed-dial-actions button[aria-label="Open Support Chat"]',
            text: "The <strong>Support Chat</strong> connects you to an assistant that can answer questions about how to fill out the form.",
        },
        {
            selector: 'p:not(:empty)', // Find any non-empty paragraph
            text: "You can also <strong>select any text</strong> on the page, right-click it, and choose 'Get Definition for...' to look it up instantly.",
            fallbackText: "You can also select any text on the page, right-click, and ask for a definition via the context menu.",
            action: () =>
            { // Action to close the speed dial before moving to the next step
                const mainButton = document.querySelector('#tooltipSpeedDial_mainButton');
                const actionsContainer = document.querySelector('.tooltip-speed-dial-actions');
                if (mainButton && actionsContainer && actionsContainer.style.display === 'flex')
                {
                    mainButton.click();
                }
            }
        },
        {
            text: "You're all set! You can control all features from the extension icon in your browser toolbar. Enjoy!",
        }
    ];
}


/**
 * Advances the demo to the next step.
 */
function advanceDemo ()
{
    currentStep++;
    if (currentStep >= tourSteps.length)
    {
        endDemo();
        return;
    }

    const step = tourSteps[currentStep];
    const element = step.selector ? document.querySelector(step.selector) : null;

    highlightElement(element);

    showStepMessage(element ? step.text : step.fallbackText || step.text, element);

    // Execute the action for the current step, if it exists
    if (step.action && typeof step.action === 'function')
    {
        // Use a small delay for actions that change the UI, allowing the user to see the change
        setTimeout(() => step.action(element), 500);
    }

    if (currentStep === tourSteps.length - 1)
    {
        document.getElementById('simpleform-demo-next').textContent = "Finish";
    } else
    {
        document.getElementById('simpleform-demo-next').textContent = "Next";
    }
}

/**
 * Ends the demo and cleans up the UI.
 */
function endDemo ()
{
    if (demoOverlay)
    {
        demoOverlay.style.opacity = '0';
        setTimeout(cleanupDemo, 300);
    }
    currentStep = -1;
    tourSteps = [];
}

/**
 * The main entry point to start the demo.
 */
export function startDemo ()
{
    if (currentStep !== -1)
    {
        console.log("Demo is already in progress.");
        return;
    }

    createDemoUI();
    defineTourSteps();

    demoOverlay.style.display = 'block';
    requestAnimationFrame(() =>
    {
        demoOverlay.style.opacity = '1';
    });

    currentStep = -1; // Start before the first step
    advanceDemo();
}