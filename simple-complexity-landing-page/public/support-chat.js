// support-chat.js

let state;
let helpers;
let panelRef = null; // Module-level reference to the panel

const PANEL_ID = "ss-panel";
const BTN_OFFSET = 20;
const SUPPORT_QUERY_ENDPOINT = `http://localhost:8000/api/support-query`;

const SVG_SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

/**
 * (Internal) Sends a support question to the backend API.
 */
function sendSupportQuery (question, context = "")
{
    if (typeof question !== "string" || !question.trim()) return Promise.resolve("");
    return helpers.fetchWithAuth(SUPPORT_QUERY_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), context, language: state.selectedLang || null })
    }).then(async resp =>
    {
        if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
        const data = await resp.json();
        return typeof data?.answer === "string" ? data.answer : "";
    }).catch(err =>
    {
        console.warn("Support query failed:", err);
        return "";
    });
}


async function handleSupportQuery (question)
{
    if (!panelRef) return;
    const $form = panelRef.host.shadowRoot.getElementById("ss-form");
    const sendButton = $form.querySelector('button[type="submit"]');

    panelRef.addMsg("Thinking...", "bot");
    sendButton.disabled = true;

    try
    {
        const pageContext = document.body.innerText;
        const answer = await sendSupportQuery(question, pageContext); // Call the local function
        if (answer)
        {
            panelRef.addMsg(answer, "bot");
        } else
        {
            panelRef.addMsg("Sorry, I couldn't find an answer for that.", "error");
        }
    } catch (error)
    {
        console.error("[Support Chat] Error during support query fetch:", error);
        panelRef.addMsg(`Error: ${error.message || "Failed to fetch from support backend."}`, "error");
    } finally
    {
        sendButton.disabled = false;
    }
}

/**
 * Toggles the visibility of the support chat panel.
 * @param {boolean} show - Whether to show or hide the panel.
 */
export function toggleSupportChatPanel (show)
{
    if (!panelRef)
    {
        if (show)
        {
            panelRef = createSupportChatPanel(); // Create it if it doesn't exist
        } else
        {
            return; // Nothing to hide
        }
    }

    const panel = panelRef.panel;
    const isVisible = panel.classList.contains("visible");

    if (show === isVisible) return;

    if (show)
    {
        panel.style.display = "flex";
        requestAnimationFrame(() =>
        {
            panel.classList.add("visible");
            const input = panel.shadowRoot.querySelector("#ss-input");
            if (input) input.focus();
        });
        // Close other panels if they are open
        if (helpers.isLanguagePanelOpen())
        {
            helpers.toggleLanguagePanel(false);
        }
    } else
    {
        panel.classList.remove("visible");
        setTimeout(() =>
        {
            panel.style.display = "none";
        }, 250);
    }
}


/**
 * Initializes the support chat module.
 * @param {object} sdkState - The main state object from the SDK.
 * @param {object} sdkHelpers - An object containing helper functions.
 */
export function initSupportChat (sdkState, sdkHelpers)
{
    state = sdkState;
    helpers = sdkHelpers;
}

/**
 * Checks if the support chat panel is currently visible.
 * @returns {boolean} True if the panel is open, false otherwise.
 */
export function isSupportChatOpen ()
{
    if (!panelRef || !panelRef.panel) return false;
    return panelRef.panel.classList.contains("visible");
}

/**
 * Creates the DOM elements and logic for the support chat panel.
 * @returns {object|null} An object with the panel element and control functions, or null if it already exists.
 */
export function createSupportChatPanel ()
{
    if (document.getElementById("simple-support-host") || !document.body) return null;

    const panelHost = document.createElement("div");
    panelHost.id = "simple-support-host";
    document.body.appendChild(panelHost);

    const shadow = panelHost.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <style>
      #${PANEL_ID} {
        position: fixed; bottom: 95px; right: ${BTN_OFFSET}px; width: 330px; max-height: 480px;
        display: none; flex-direction: column; background: #ffffff; color: #212529;
        border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); z-index: 2147483647;
        overflow: hidden; transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        opacity: 0; transform: translateY(15px) scale(0.98); font-family: system-ui, sans-serif;
      }
      #${PANEL_ID}.visible { display: flex; opacity: 1; transform: translateY(0) scale(1); }
      #${PANEL_ID} header { padding: 16px 20px; background-color: #f7f7f7; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
      #${PANEL_ID} header h2 { margin: 0; font-size: 17px; font-weight: 600; color: #212529; }
      #${PANEL_ID} header button { background: transparent; border: none; cursor: pointer; color: #555; padding: 5px; border-radius: 50%; }
      #${PANEL_ID} header button:hover { background-color: rgba(0,0,0,0.05); }
      #ss-chat-messages { flex: 1; overflow-y: auto; padding: 20px; background: #ffffff; display: flex; flex-direction: column; gap: 15px; }
      .ss-msg { padding: 10px 14px; border-radius: 12px; max-width: 80%; font-size: 14px; line-height: 1.5; word-break: break-word; }
      .ss-msg.user { align-self: flex-end; background: #116530; color: #fff; border-bottom-right-radius: 4px; }
      .ss-msg.bot { align-self: flex-start; background: #f0f0f0; color: #212529; border-bottom-left-radius: 4px; }
      .ss-msg.error { align-self: flex-start; background: #fdecea; color: #611a15; }
      #ss-form { display: flex; padding: 16px 20px; border-top: 1px solid #e0e0e0; background-color: #f7f7f7; }
      #ss-input { flex: 1; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 14px; font-size: 14px; margin-right: 10px; background-color: #fff; color: #333; }
      #ss-input:focus { border-color: #116530; box-shadow: 0 0 0 2px rgba(17, 101, 48, 0.25); }
      #ss-form button { background: #D4A017; color: #000; border: none; border-radius: 8px; padding: 10px 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; }
      #ss-form button:hover { filter: brightness(0.9); }
      #ss-form button svg { fill: #000; }
    </style>
    <section id="${PANEL_ID}">
      <header>
        <h2>Support Assistant</h2>
        <button id="ss-close-btn" aria-label="Close support chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </header>
      <div id="ss-chat-messages"></div>
      <form id="ss-form">
        <input id="ss-input" type="text" placeholder="Ask a question…" aria-label="Support question input"/>
        <button type="submit" aria-label="Send support question">${SVG_SEND_ICON}</button>
      </form>
    </section>
    `;

    const $panel = shadow.getElementById(PANEL_ID);
    const $chatMessages = shadow.getElementById("ss-chat-messages");
    const $form = shadow.getElementById("ss-form");
    const $input = shadow.getElementById("ss-input");
    const $closeBtn = shadow.getElementById("ss-close-btn");

    panelRef = {
        panel: $panel,
        host: panelHost,
        toggle: toggleSupportChatPanel, // Use the exported function
        addMsg: (text, cls) =>
        {
            const div = document.createElement("div");
            div.className = `ss-msg ${cls}`;
            div.textContent = text;
            $chatMessages.appendChild(div);
            $chatMessages.scrollTop = $chatMessages.scrollHeight;
        }
    };

    $closeBtn.onclick = () => toggleSupportChatPanel(false);

    $form.onsubmit = (e) =>
    {
        e.preventDefault();
        const question = $input.value.trim();
        if (!question) return;
        panelRef.addMsg(question, "user");
        $input.value = "";
        handleSupportQuery(question);
    };

    return panelRef;
}