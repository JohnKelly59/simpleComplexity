// contentScripts/speedDial.js
import
{
    SVG_LOADER, SVG_REFRESH_ICON, SVG_CHAT_ICON, SVG_SEND_ICON, SVG_CLOSE_ICON, SVG_SUPPORT_ICON,
    SUPPORT_QUERY_ENDPOINT
} from './config.js';
import { isBackgroundLight } from './utils.js';
import { gatherKeysFromAllFields, removeAllTooltipIcons as removeIcons, processAllFormFields } from './fieldProcessor.js';
import { fetchTooltipsForKeys, fetchWithAuth } from './api.js';
import { state, updateQuestionMatrix, resetRefreshTracking } from './mainState.js';

let localSpeedDialRef = null;
let existingChatModalRef = null; // For the original chat modal (definitions)
let supportChatPanelRef = null; // For the new SimpleSupport panel

const BTN_OFFSET = 20;
const PANEL_ID = 'ss-panel';


async function handleSupportQuery (question, panelRef)
{
    if (!panelRef) return;

    const $form = panelRef.host.shadowRoot.getElementById('ss-form');
    const sendButton = $form.querySelector('button[type="submit"]');

    panelRef.addMsg("Thinking...", 'bot');
    sendButton.disabled = true;

    try
    {
        const response = await fetchWithAuth(SUPPORT_QUERY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        });
        const data = await response.json();

        if (data && data.answer)
        {
            panelRef.addMsg(data.answer, 'bot');
        } else
        {
            panelRef.addMsg(data.error || "Sorry, I couldn't find an answer for that.", 'error');
        }
    } catch (error)
    {
        console.log('[Support Chat] Error during support query fetch:', error);
        panelRef.addMsg(`Error: ${error.message || 'Failed to fetch from support backend.'}`, 'error');
    } finally
    {
        sendButton.disabled = false;
    }
}


function createSupportChatPanel ()
{
    if (document.getElementById(PANEL_ID) || !document.body) return null;

    const panelHost = document.createElement('div');
    panelHost.id = "simple-support-host";
    document.body.appendChild(panelHost);
    const shadow = panelHost.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
    <style>
      :host {
        --primary-main: ${state.theme?.primaryMain || '#116530'};
        --secondary-main: ${state.theme?.secondaryMain || '#D4A017'};
        --bg-default: ${state.theme?.bgDefault || '#1f2937'};
        --card-bg: ${state.theme?.cardBg || '#1f2937'};
        --text-color: ${state.theme?.textColor || '#f5f7fa'};
        --border-color: ${state.theme?.borderColor || '#e0e0e0'};
      }
      #${PANEL_ID} {
        position: fixed;
        bottom: 95px;
        right: ${BTN_OFFSET}px;
        width: 330px;
        max-height: 480px;
        display: none;
        flex-direction: column;
        background: var(--card-bg);
        color: var(--text-color);
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.12), 0 6px 15px rgba(0,0,0,0.08);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        z-index: 2147483647;
        overflow: hidden;
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        opacity: 0;
        transform: translateY(15px) scale(0.98);
      }
      #${PANEL_ID}.visible {
        display: flex;
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      #${PANEL_ID} header {
        padding: 16px 20px;
        background-color: #f7f7f7;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #${PANEL_ID} header h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        color: #212529;
      }
      #${PANEL_ID} header button {
        background: transparent; border: none; cursor: pointer;
        color: #555; padding: 5px; border-radius: 50%;
      }
       #${PANEL_ID} header button:hover { background-color: rgba(0,0,0,0.05); }
      #ss-chat-messages {
        flex: 1; overflow-y: auto; padding: 20px;
        background: var(--bg-default); display: flex; flex-direction: column; gap: 15px;
      }
      .ss-msg {
        padding: 10px 14px; border-radius: 12px; max-width: 80%;
        font-size: 14px; line-height: 1.5; word-break: break-word;
      }
      .ss-msg.user {
        align-self: flex-end; background: var(--primary-main); color: #fff;
        border-bottom-right-radius: 4px;
      }
      .ss-msg.bot {
        align-self: flex-start; background: #f0f0f0; color: #212529;
        border-bottom-left-radius: 4px;
      }
      .ss-msg.error {
        align-self: flex-start; background: #fdecea; color: #611a15;
      }
      #ss-form {
        display: flex; padding: 16px 20px; border-top: 1px solid var(--border-color);
        background-color: #f7f7f7;
      }
      #ss-input {
        flex: 1; border: 1px solid #d1d5db; border-radius: 8px;
        padding: 10px 14px; font-size: 14px; margin-right: 10px;
        background-color: #fff; color: #333;
      }
       #ss-input:focus {
        border-color: var(--primary-main);
        box-shadow: 0 0 0 2px var(--primary-main_alpha, rgba(17, 101, 48, 0.25));
       }
      #ss-form button {
        background: var(--secondary-main); color: #000; border: none;
        border-radius: 8px; padding: 10px 14px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background-color 0.2s ease;
      }
       #ss-form button:hover { filter: brightness(0.9); }
       #ss-form button svg { fill: #000; }
    </style>
    <section id="${PANEL_ID}">
      <header>
        <h2>Support Assistant</h2>
        <button id="ss-close-btn" aria-label="Close support chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
    const $chatMessages = shadow.getElementById('ss-chat-messages');
    const $form = shadow.getElementById('ss-form');
    const $input = shadow.getElementById('ss-input');
    const $closeBtn = shadow.getElementById('ss-close-btn');

    const setPanelPosition = () =>
    {
        const mainSpeedDial = document.getElementById("tooltipSpeedDial");
        if (mainSpeedDial)
        {
            const mainDialRect = mainSpeedDial.getBoundingClientRect();
            $panel.style.right = `${window.innerWidth - mainDialRect.right + (mainDialRect.width / 2) - ($panel.offsetWidth / 2)}px`;
            $panel.style.bottom = `${window.innerHeight - mainDialRect.top + 15}px`;
        } else
        {
            $panel.style.right = rightPos();
        }
    };

    const toggleSupportPanel = (show) =>
    {
        if (show)
        {
            $panel.classList.add('visible');
            $panel.style.display = 'flex';
            requestAnimationFrame(() =>
            {
                $panel.style.opacity = "1";
                $panel.style.transform = "translateY(0) scale(1)";
            });
            $input.focus();
            if (existingChatModalRef?.modal.style.display === 'flex')
            {
                toggleChatModal(false);
            }
        } else
        {
            $panel.style.opacity = "0";
            $panel.style.transform = "translateY(15px) scale(0.98)";
            setTimeout(() =>
            {
                $panel.classList.remove('visible');
                $panel.style.display = 'none';
            }, 250);
        }
        if (localSpeedDialRef?.actionsContainer.style.display === 'flex')
        {
            localSpeedDialRef.actionsContainer.style.display = 'none';
            if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = 'rotate(0deg)';
        }
    };

    $closeBtn.onclick = () => toggleSupportPanel(false);

    const addSupportMessage = (text, cls) =>
    {
        const div = document.createElement('div');
        div.className = `ss-msg ${cls}`;
        div.textContent = text;
        $chatMessages.appendChild(div);
        $chatMessages.scrollTop = $chatMessages.scrollHeight;
    };

    $form.onsubmit = (e) =>
    {
        e.preventDefault();
        const question = $input.value.trim();
        if (!question) return;
        addSupportMessage(question, 'user');
        $input.value = '';
        handleSupportQuery(question, supportChatPanelRef);
    };

    setTimeout(() =>
    {
        setPanelPosition();
        window.addEventListener('resize', setPanelPosition);
    }, 100);

    return { panel: $panel, toggle: toggleSupportPanel, addMsg: addSupportMessage, host: panelHost };
}

export function showLoaderOnSpeedDial ()
{
    if (localSpeedDialRef && localSpeedDialRef.mainButton && localSpeedDialRef.mainImg)
    {
        if (!localSpeedDialRef.mainButton.dataset.isLoading)
        {
            localSpeedDialRef.mainButton.dataset.originalContent = localSpeedDialRef.mainButton.innerHTML;
            localSpeedDialRef.mainButton.innerHTML = SVG_LOADER;
            localSpeedDialRef.mainButton.dataset.isLoading = "true";
        }
    }
}
export function hideLoaderOnSpeedDial ()
{
    if (localSpeedDialRef && localSpeedDialRef.mainButton && localSpeedDialRef.mainButton.dataset.isLoading === "true")
    {
        if (localSpeedDialRef.mainButton.dataset.originalContent)
        {
            localSpeedDialRef.mainButton.innerHTML = localSpeedDialRef.mainButton.dataset.originalContent;
        } else
        {
            localSpeedDialRef.mainButton.innerHTML = '';
            if (localSpeedDialRef.mainImg) localSpeedDialRef.mainButton.appendChild(localSpeedDialRef.mainImg);
        }
        delete localSpeedDialRef.mainButton.dataset.isLoading;
        delete localSpeedDialRef.mainButton.dataset.originalContent;
    }
}

export function createSpeedDial ()
{
    if (document.getElementById("tooltipSpeedDial") || !document.body)
    {
        if (!localSpeedDialRef && document.getElementById('tooltipSpeedDial'))
        {
            const existingSpeedDial = document.getElementById('tooltipSpeedDial');
            localSpeedDialRef = {
                speedDial: existingSpeedDial,
                mainButton: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton'),
                actionsContainer: existingSpeedDial.querySelector('.tooltip-speed-dial-actions'),
                refreshButton: existingSpeedDial.querySelector('.tooltip-speed-dial-actions button[aria-label="Refresh tooltips"]'),
                definitionChatButton: existingSpeedDial.querySelector('.tooltip-speed-dial-actions button[aria-label="Open Question Assistant"]'), // Corrected ref name
                supportChatButton: existingSpeedDial.querySelector('.tooltip-speed-dial-actions button[aria-label="Open Support Chat"]'), // Corrected ref name
                mainImg: existingSpeedDial.querySelector('#tooltipSpeedDial_mainButton img')
            };
        }
        return localSpeedDialRef;
    }

    const speedDialContainer = document.createElement("div");
    speedDialContainer.id = "tooltipSpeedDial";
    Object.assign(speedDialContainer.style, {
        position: "fixed", bottom: "25px", right: "25px",
        zIndex: 2147483646, display: "flex", flexDirection: "column-reverse", alignItems: "center"
    });

    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("tooltip-speed-dial-actions");
    Object.assign(actionsContainer.style, {
        display: "none", flexDirection: "column", alignItems: "center",
        marginBottom: "12px", gap: "12px"
    });

    const styleMiniFab = btn => Object.assign(btn.style, {
        width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer",
        backgroundColor: "#4A5568", color: "#FFFFFF", boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: 'background-color 0.2s ease, transform 0.1s ease-out'
    });

    const decorateHoverMiniFab = (btn) =>
    {
        btn.onmouseenter = () => { if (!btn.disabled) btn.style.backgroundColor = '#2D3748'; };
        btn.onmouseleave = () => { if (!btn.disabled) btn.style.backgroundColor = '#4A5568'; };
        btn.onmousedown = () => { if (!btn.disabled) btn.style.transform = 'scale(0.95)'; };
        btn.onmouseup = () => { if (!btn.disabled) btn.style.transform = 'scale(1)'; };
    };

    const definitionChatButton = document.createElement("button");
    definitionChatButton.setAttribute("aria-label", "Open Question Assistant");
    definitionChatButton.setAttribute("title", "Open Question Assistant (for definitions)");
    styleMiniFab(definitionChatButton);
    decorateHoverMiniFab(definitionChatButton);
    definitionChatButton.innerHTML = SVG_CHAT_ICON;
    definitionChatButton.addEventListener("click", (event) =>
    {
        event.preventDefault(); event.stopPropagation();

        toggleChatModal(true);

        if (supportChatPanelRef?.panel.classList.contains('visible'))
        {
            supportChatPanelRef.toggle(false);
        }

        if (actionsContainer) actionsContainer.style.display = "none";
        if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
    });
    actionsContainer.appendChild(definitionChatButton);

    const supportChatBtn = document.createElement("button");
    supportChatBtn.id = "ss-chat-btn-speeddial";
    supportChatBtn.setAttribute("aria-label", "Open Support Chat");
    supportChatBtn.setAttribute("title", "Open Support Chat");
    styleMiniFab(supportChatBtn);
    decorateHoverMiniFab(supportChatBtn);
    supportChatBtn.innerHTML = SVG_SUPPORT_ICON; // Using SVG_SUPPORT_ICON now
    supportChatBtn.addEventListener("click", (event) =>
    {
        event.preventDefault(); event.stopPropagation();
        if (!supportChatPanelRef)
        {
            supportChatPanelRef = createSupportChatPanel();
        }
        if (supportChatPanelRef)
        {
            supportChatPanelRef.toggle(true);
            if (existingChatModalRef?.modal.style.display === 'flex')
            {
                toggleChatModal(false);
            }
        }
        if (actionsContainer) actionsContainer.style.display = "none";
        if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
    });
    actionsContainer.appendChild(supportChatBtn);

    const refreshButton = document.createElement("button");
    refreshButton.setAttribute("aria-label", "Refresh all tooltips");
    refreshButton.setAttribute("title", "Refresh all tooltips");
    styleMiniFab(refreshButton);
    decorateHoverMiniFab(refreshButton);
    refreshButton.innerHTML = SVG_REFRESH_ICON;
    refreshButton.addEventListener("click", (event) =>
    {
        event.preventDefault(); event.stopPropagation();
        if (!state.tooltipsEnabled)
        {
            console.log("Tooltips are disabled, cannot refresh.");
            if (actionsContainer) actionsContainer.style.display = "none";
            if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
            return;
        }
        console.log("Refreshing all form field tooltips via speed dial...");
        refreshButton.disabled = true;
        Object.assign(refreshButton.style, { opacity: '0.6', cursor: 'not-allowed', backgroundColor: '#4A5568' });
        const keys = gatherKeysFromAllFields();
        if (keys.length === 0)
        {
            console.log("No fields found to refresh tooltips for.");
            Object.assign(refreshButton.style, { opacity: '1', cursor: 'pointer' });
            refreshButton.disabled = false;
            if (actionsContainer) actionsContainer.style.display = "none";
            if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
            return;
        }
        fetchTooltipsForKeys(keys)
            .then((data) =>
            {
                updateQuestionMatrix(data);
                resetRefreshTracking();
                removeIcons();
                processAllFormFields();
                console.log("All form field tooltips refreshed.");
            })
            .catch((err) => console.log("Error refreshing all tooltips:", err))
            .finally(() =>
            {
                refreshButton.disabled = false;
                Object.assign(refreshButton.style, { opacity: '1', cursor: 'pointer' });
                if (actionsContainer) actionsContainer.style.display = "none";
                if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
            });
    });
    actionsContainer.appendChild(refreshButton);

    const mainButton = document.createElement("button");
    mainButton.id = "tooltipSpeedDial_mainButton";
    mainButton.setAttribute("aria-label", "Open options");
    mainButton.setAttribute("title", "Options");
    Object.assign(mainButton.style, {
        width: "56px", height: "56px", borderRadius: "50%", border: "none", cursor: "pointer",
        backgroundColor: "#1A202C", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, opacity 0.2s ease",
        opacity: '1'
    });
    mainButton.onmouseenter = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#2D3748'; };
    mainButton.onmouseleave = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#1A202C'; };

    const mainImg = document.createElement("img");
    mainImg.alt = "Tooltip Icon";
    Object.assign(mainImg.style, { width: "28px", height: "28px" });
    try
    {
        mainImg.src = chrome.runtime.getURL(isBackgroundLight() ? "icon128.png" : "SC_COLOR.png");
    } catch (e)
    {
        console.warn("Could not load main FAB icon.", e);
        try { mainImg.src = chrome.runtime.getURL("icon128.png"); }
        catch (e2) { console.log("Default FAB icon failed to load:", e2); }
    }
    mainButton.appendChild(mainImg);

    mainButton.addEventListener("click", () =>
    {
        if (mainButton.dataset.isLoading === 'true') return;

        if (existingChatModalRef?.modal.style.display === 'flex')
        {
            toggleChatModal(false);
            if (actionsContainer) actionsContainer.style.display = "none";
            mainButton.style.transform = "rotate(0deg)";
            return;
        }
        if (supportChatPanelRef?.panel.classList.contains('visible'))
        {
            supportChatPanelRef.toggle(false);
            if (actionsContainer) actionsContainer.style.display = "none";
            mainButton.style.transform = "rotate(0deg)";
            return;
        }

        const isOpen = actionsContainer.style.display === "flex";
        actionsContainer.style.display = isOpen ? "none" : "flex";
        mainButton.style.transform = isOpen ? "rotate(0deg)" : "rotate(135deg)";

        if (!isOpen)
        {
            updateSpeedDialAppearance(state.tooltipsEnabled);
        }
    });

    speedDialContainer.appendChild(actionsContainer);
    speedDialContainer.appendChild(mainButton);
    document.body.appendChild(speedDialContainer);

    createExistingChatModal();
    if (!supportChatPanelRef) supportChatPanelRef = createSupportChatPanel();

    localSpeedDialRef = {
        speedDial: speedDialContainer, mainButton, actionsContainer, refreshButton,
        definitionChatButton,
        supportChatButton: supportChatBtn,
        mainImg
    };
    setSpeedDialPosition();
    new MutationObserver(setSpeedDialPosition).observe(document.body, { childList: true, subtree: true });

    return localSpeedDialRef;
}

const rightPos = () => (document.getElementById('ft-btn') ? `${BTN_OFFSET + 60}px` : `${BTN_OFFSET}px`);

function setSpeedDialPosition ()
{
    if (localSpeedDialRef?.speedDial)
    {
        localSpeedDialRef.speedDial.style.right = rightPos();
    }
    if (supportChatPanelRef?.panel)
    {
        supportChatPanelRef.panel.style.right = rightPos();
    }
    if (existingChatModalRef?.modal)
    {
        existingChatModalRef.modal.style.right = rightPos();
    }
}

export function updateSpeedDialAppearance (enabled)
{
    if (localSpeedDialRef && localSpeedDialRef.mainButton)
    {
        localSpeedDialRef.mainButton.title = "Options";
        localSpeedDialRef.mainButton.style.opacity = '1';

        if (localSpeedDialRef.refreshButton)
        {
            localSpeedDialRef.refreshButton.disabled = !enabled;
            localSpeedDialRef.refreshButton.style.opacity = enabled ? '1' : '0.6';
            localSpeedDialRef.refreshButton.style.cursor = enabled ? 'pointer' : 'not-allowed';
            localSpeedDialRef.refreshButton.title = enabled ? "Refresh all tooltips" : "Tooltips disabled, cannot refresh";
        }

        if (localSpeedDialRef.definitionChatButton)
        { // Definition chat button
            localSpeedDialRef.definitionChatButton.disabled = false;
            localSpeedDialRef.definitionChatButton.style.opacity = '1';
            localSpeedDialRef.definitionChatButton.style.cursor = 'pointer';
            localSpeedDialRef.definitionChatButton.title = "Open Question Assistant (for definitions)";
        }

        if (localSpeedDialRef.supportChatButton)
        { // Support chat button
            localSpeedDialRef.supportChatButton.disabled = false;
            localSpeedDialRef.supportChatButton.style.opacity = '1';
            localSpeedDialRef.supportChatButton.style.cursor = 'pointer';
            localSpeedDialRef.supportChatButton.title = "Open Support Chat";
        }

        if (!enabled && existingChatModalRef?.modal.style.display === 'flex')
        {
            toggleChatModal(false);
        }
    }
}

// MODIFICATION: Added export for toggleSpeedDialVisibility
export function toggleSpeedDialVisibility (visible)
{
    if (!localSpeedDialRef || !localSpeedDialRef.speedDial)
    {
        if (visible && !document.getElementById("tooltipSpeedDial"))
        {
            createSpeedDial();
            if (!localSpeedDialRef || !localSpeedDialRef.speedDial) return;
        } else if (!visible && document.getElementById("tooltipSpeedDial"))
        {
            const existingDial = document.getElementById("tooltipSpeedDial");
            if (existingDial) existingDial.style.display = "none";
            if (!localSpeedDialRef && existingDial)
            {
                localSpeedDialRef = {
                    speedDial: existingDial,
                    mainButton: existingDial.querySelector("#tooltipSpeedDial_mainButton"),
                    actionsContainer: existingDial.querySelector(".tooltip-speed-dial-actions"),
                    // Assuming definitionChatButton and supportChatButton would also be querySelected if needed here
                    refreshButton: existingDial.querySelector('.tooltip-speed-dial-actions button[aria-label="Refresh tooltips"]'),
                    mainImg: existingDial.querySelector('#tooltipSpeedDial_mainButton img')
                };
            }
        }
        if (!localSpeedDialRef || !localSpeedDialRef.speedDial) return;
    }

    localSpeedDialRef.speedDial.style.display = visible ? "flex" : "none";
    if (!visible)
    {
        if (localSpeedDialRef.actionsContainer)
        {
            localSpeedDialRef.actionsContainer.style.display = "none";
        }
        if (localSpeedDialRef.mainButton)
        {
            localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
        }
        toggleChatModal(false); // Close definition chat
        if (supportChatPanelRef?.panel.classList.contains('visible'))
        { // Close support chat
            supportChatPanelRef.toggle(false);
        }
    }
    // console.log("Speed Dial DOM visibility set to:", visible ? "flex" : "none"); 
}


function createExistingChatModal ()
{
    if (document.getElementById("simpleform-chat-modal") || !document.body) return;
    const modalContainer = document.createElement("div");
    modalContainer.id = "simpleform-chat-modal";
    Object.assign(modalContainer.style, {
        display: "none", position: "fixed", bottom: "95px",
        width: "330px", height: "480px", backgroundColor: "#ffffff",
        borderRadius: "16px", boxShadow: "0 12px 30px rgba(0,0,0,0.12), 0 6px 15px rgba(0,0,0,0.08)",
        zIndex: 2147483647, flexDirection: "column", overflow: "hidden",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        transition: "opacity 0.25s ease-in-out, transform 0.25s ease-in-out",
        opacity: "0", transform: "translateY(15px) scale(0.98)"
    });

    const header = document.createElement("div");
    Object.assign(header.style, {
        padding: "16px 20px", backgroundColor: "#f7f7f7", borderBottom: "1px solid #e0e0e0",
        display: "flex", justifyContent: "space-between", alignItems: "center"
    });
    const title = document.createElement("h2");
    title.textContent = "Question Assistant";
    Object.assign(title.style, { margin: "0", fontSize: "17px", fontWeight: "600", color: "#212529" });
    const closeButton = document.createElement("button");
    closeButton.innerHTML = SVG_CLOSE_ICON;
    Object.assign(closeButton.style, {
        background: "transparent", border: "none", cursor: "pointer",
        color: "#555", padding: "5px", borderRadius: "50%"
    });
    closeButton.onmouseenter = () => closeButton.style.backgroundColor = "rgba(0,0,0,0.05)";
    closeButton.onmouseleave = () => closeButton.style.backgroundColor = "transparent";
    closeButton.onclick = () => toggleChatModal(false);
    header.appendChild(title);
    header.appendChild(closeButton);

    const chatHistory = document.createElement("div");
    chatHistory.id = "simpleform-chat-history";
    Object.assign(chatHistory.style, {
        flexGrow: "1", padding: "20px", overflowY: "auto", backgroundColor: "#fff",
        display: "flex", flexDirection: "column", gap: "15px"
    });

    const inputArea = document.createElement("div");
    Object.assign(inputArea.style, {
        display: "flex", padding: "16px 20px", borderTop: "1px solid #e0e0e0",
        backgroundColor: "#f7f7f7"
    });
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "Type your question...";
    textInput.setAttribute("aria-label", "Chat message input");
    Object.assign(textInput.style, {
        flexGrow: "1", border: "1px solid #d1d5db", borderRadius: "8px",
        padding: "10px 14px", fontSize: "14px", marginRight: "10px", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease"
    });
    textInput.onfocus = () =>
    {
        textInput.style.borderColor = "#116530";
        textInput.style.boxShadow = `0 0 0 2px rgba(17, 101, 48, 0.25)`;
    };
    textInput.onblur = () =>
    {
        textInput.style.borderColor = "#d1d5db";
        textInput.style.boxShadow = "none";
    };

    const sendButton = document.createElement("button");
    sendButton.innerHTML = SVG_SEND_ICON;
    sendButton.setAttribute("aria-label", "Send message");
    Object.assign(sendButton.style, {
        background: "#D4A017", color: "#000000", border: "none",
        borderRadius: "8px", padding: "10px 14px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 0.2s ease"
    });
    if (sendButton.querySelector("svg")) sendButton.querySelector("svg").style.fill = "#000000";
    sendButton.onmouseenter = () => sendButton.style.backgroundColor = "#b8860b";
    sendButton.onmouseleave = () => sendButton.style.backgroundColor = "#D4A017";

    const sendMessage = async () =>
    {
        const messageText = textInput.value.trim();
        if (!messageText) return;
        addExistingMessageToChat(messageText, "user");
        textInput.value = "";
        sendButton.disabled = true;
        Object.assign(sendButton.style, { opacity: "0.7", cursor: "wait" });
        addExistingMessageToChat("Thinking...", "bot", true);
        try
        {
            const responseData = await fetchTooltipsForKeys([messageText]);
            const botResponse = responseData ? responseData[messageText] : "Sorry, I couldn't find an answer for that.";
            updateLastExistingBotMessage(botResponse || "No definition found.");
        } catch (error)
        {
            console.log("Error fetching definition chat response:", error);
            updateLastExistingBotMessage("An error occurred while fetching the answer.");
        } finally
        {
            sendButton.disabled = false;
            Object.assign(sendButton.style, { opacity: "1", cursor: "pointer" });
        }
    };
    sendButton.onclick = sendMessage;
    textInput.onkeypress = (e) =>
    {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };
    inputArea.appendChild(textInput);
    inputArea.appendChild(sendButton);
    modalContainer.appendChild(header);
    modalContainer.appendChild(chatHistory);
    modalContainer.appendChild(inputArea);

    document.body.appendChild(modalContainer);
    existingChatModalRef = { modal: modalContainer, history: chatHistory, input: textInput, sendBtn: sendButton };
    setSpeedDialPosition();
}

function addExistingMessageToChat (text, sender, isPending = false)
{
    if (!existingChatModalRef || !existingChatModalRef.history) return;
    const messageBubble = document.createElement("div");
    Object.assign(messageBubble.style, {
        padding: "10px 14px", borderRadius: "12px", maxWidth: "80%",
        fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word"
    });
    if (sender === "user")
    {
        messageBubble.textContent = text;
        Object.assign(messageBubble.style, {
            backgroundColor: "#116530", color: "white",
            alignSelf: "flex-end", borderBottomRightRadius: "4px"
        });
    } else
    {
        messageBubble.textContent = text;
        Object.assign(messageBubble.style, {
            backgroundColor: "#f0f0f0", color: "#212529",
            alignSelf: "flex-start", borderBottomLeftRadius: "4px"
        });
        if (isPending)
        {
            messageBubble.classList.add("pending-bot-message");
            Object.assign(messageBubble.style, { fontStyle: "italic", opacity: "0.8" });
        }
    }
    existingChatModalRef.history.appendChild(messageBubble);
    existingChatModalRef.history.scrollTop = existingChatModalRef.history.scrollHeight;
}

function updateLastExistingBotMessage (text)
{
    if (!existingChatModalRef || !existingChatModalRef.history) return;
    const pendingMessage = existingChatModalRef.history.querySelector(".pending-bot-message");
    if (pendingMessage)
    {
        pendingMessage.textContent = text;
        Object.assign(pendingMessage.style, { fontStyle: "normal", opacity: "1" });
        pendingMessage.classList.remove("pending-bot-message");
    } else
    {
        addExistingMessageToChat(text, "bot");
    }
    existingChatModalRef.history.scrollTop = existingChatModalRef.history.scrollHeight;
}

function toggleChatModal (show)
{
    if (!existingChatModalRef)
    {
        console.warn("Existing chat modal (definitions) not initialized.");
        if (show) createExistingChatModal(); else return;
    }
    if (!existingChatModalRef) return;

    setSpeedDialPosition();

    if (show)
    {
        existingChatModalRef.modal.style.display = "flex";
        requestAnimationFrame(() =>
        {
            existingChatModalRef.modal.style.opacity = "1";
            existingChatModalRef.modal.style.transform = "translateY(0) scale(1)";
        });
        if (localSpeedDialRef?.actionsContainer) localSpeedDialRef.actionsContainer.style.display = "none";
        if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
        if (supportChatPanelRef?.panel.classList.contains('visible'))
        {
            supportChatPanelRef.toggle(false);
        }
    } else
    {
        existingChatModalRef.modal.style.opacity = "0";
        existingChatModalRef.modal.style.transform = "translateY(15px) scale(0.98)";
        setTimeout(() =>
        {
            if (existingChatModalRef) existingChatModalRef.modal.style.display = "none";
        }, 250);
    }
}