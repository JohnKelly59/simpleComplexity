import
{
    SVG_LOADER, SVG_REFRESH_ICON, SVG_CHAT_ICON, SVG_SEND_ICON, SVG_CLOSE_ICON
} from './config.js'; // Color variables removed from here
import { isBackgroundLight } from './utils.js';
import { gatherKeysFromAllFields, removeAllTooltipIcons as removeIcons, processAllFormFields } from './fieldProcessor.js';
import { fetchTooltipsForKeys } from './api.js';
import { state, updateQuestionMatrix, resetRefreshTracking } from './mainState.js';

/**
 * @file Manages the Speed Dial floating action button and the associated Chat Modal.
 */

let localSpeedDialRef = null; // Internal reference to Speed Dial DOM elements
let chatModalRef = null; // Internal reference to Chat Modal DOM elements

// --- Speed Dial Main Button Logic (show/hide loader) ---
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

// --- Create Speed Dial UI ---
export function createSpeedDial ()
{
    if (document.getElementById("tooltipSpeedDial") || !document.body) return null;

    const speedDialContainer = document.createElement("div");
    speedDialContainer.id = "tooltipSpeedDial";
    Object.assign(speedDialContainer.style, {
        position: "fixed", bottom: "25px", right: "25px",
        zIndex: 2147483646, display: "flex",
        flexDirection: "column-reverse", alignItems: "center"
    });

    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("tooltip-speed-dial-actions");
    Object.assign(actionsContainer.style, {
        display: "none", flexDirection: "column", alignItems: "center",
        marginBottom: "12px", gap: "12px"
    });

    // --- Chat Button ---
    const chatButton = document.createElement("button");
    chatButton.setAttribute("aria-label", "Open Chat");
    chatButton.setAttribute("title", "Open Chat");
    Object.assign(chatButton.style, {
        width: "44px", height: "44px", borderRadius: "50%",
        border: "none", cursor: "pointer", backgroundColor: "#4A5568",
        color: "#FFFFFF", boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: 'background-color 0.2s ease, transform 0.1s ease-out'
    });
    chatButton.onmouseenter = () => { if (!chatButton.disabled) chatButton.style.backgroundColor = '#2D3748'; };
    chatButton.onmouseleave = () => { if (!chatButton.disabled) chatButton.style.backgroundColor = '#4A5568'; };
    chatButton.onmousedown = () => chatButton.style.transform = 'scale(0.95)';
    chatButton.onmouseup = () => chatButton.style.transform = 'scale(1)';
    chatButton.innerHTML = SVG_CHAT_ICON;
    chatButton.addEventListener("click", (event) =>
    {
        event.preventDefault(); event.stopPropagation();
        if (!state.tooltipsEnabled)
        {
            console.log("Tooltips are disabled, cannot open chat.");
            return;
        }
        toggleChatModal(true);
        actionsContainer.style.display = "none";
        if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
    });
    actionsContainer.appendChild(chatButton);

    // --- Refresh All Button ---
    const refreshButton = document.createElement("button");
    refreshButton.setAttribute("aria-label", "Refresh all tooltips");
    refreshButton.setAttribute("title", "Refresh all tooltips");
    Object.assign(refreshButton.style, {
        width: "44px", height: "44px", borderRadius: "50%",
        border: "none", cursor: "pointer", backgroundColor: "#4A5568",
        color: "#FFFFFF", boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: 'background-color 0.2s ease, transform 0.1s ease-out'
    });
    refreshButton.onmouseenter = () => { if (!refreshButton.disabled) refreshButton.style.backgroundColor = '#2D3748'; };
    refreshButton.onmouseleave = () => { if (!refreshButton.disabled) refreshButton.style.backgroundColor = '#4A5568'; };
    refreshButton.onmousedown = () => refreshButton.style.transform = 'scale(0.95)';
    refreshButton.onmouseup = () => refreshButton.style.transform = 'scale(1)';
    refreshButton.innerHTML = SVG_REFRESH_ICON;
    refreshButton.addEventListener("click", (event) =>
    {
        event.preventDefault(); event.stopPropagation();
        if (!state.tooltipsEnabled)
        {
            console.log("Tooltips are disabled, cannot refresh.");
            actionsContainer.style.display = "none";
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
            Object.assign(refreshButton.style, { disabled: false, opacity: '1', cursor: 'pointer' });
            actionsContainer.style.display = "none";
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
                actionsContainer.style.display = "none";
                if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
            });
    });
    actionsContainer.appendChild(refreshButton);

    // --- Main FAB (Floating Action Button) ---
    const mainButton = document.createElement("button");
    mainButton.id = "tooltipSpeedDial_mainButton";
    mainButton.setAttribute("aria-label", "Open tooltip options");
    mainButton.setAttribute("title", state.tooltipsEnabled ? "Tooltip Options" : "Tooltips Disabled");
    Object.assign(mainButton.style, {
        width: "56px", height: "56px", borderRadius: "50%",
        border: "none", cursor: "pointer", backgroundColor: "#1A202C",
        color: "#FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, opacity 0.2s ease",
        opacity: state.tooltipsEnabled ? '1' : '0.7'
    });
    mainButton.onmouseenter = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#2D3748'; };
    mainButton.onmouseleave = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = '#1A202C'; };

    const mainImg = document.createElement("img");
    mainImg.alt = "";
    Object.assign(mainImg.style, { width: "28px", height: "28px" });
    try
    {
        const iconPath = isBackgroundLight() ? "icon128.png" : "SC_COLOR.png";
        mainImg.src = chrome.runtime.getURL(iconPath);
    } catch (e)
    {
        console.warn("Could not determine or load specific icon, using default.", e);
        try { mainImg.src = chrome.runtime.getURL("icon128.png"); }
        catch (e2) { console.log("Default icon failed to load too:", e2); }
    }
    mainButton.appendChild(mainImg);

    mainButton.addEventListener("click", () =>
    {
        if (mainButton.dataset.isLoading === 'true') return;
        if (!state.tooltipsEnabled)
        {
            console.log("Tooltips disabled, options unavailable.");
            return;
        }
        if (chatModalRef && chatModalRef.modal.style.display === 'flex')
        {
            toggleChatModal(false);
            return;
        }
        const isOpen = actionsContainer.style.display === "flex";
        actionsContainer.style.display = isOpen ? "none" : "flex";
        mainButton.style.transform = isOpen ? "rotate(0deg)" : "rotate(135deg)";
    });

    speedDialContainer.appendChild(actionsContainer);
    speedDialContainer.appendChild(mainButton);
    document.body.appendChild(speedDialContainer);

    createChatModal(); // Initialize chat modal structure

    localSpeedDialRef = {
        speedDial: speedDialContainer, mainButton, actionsContainer, refreshButton, chatButton, mainImg
    };
    return localSpeedDialRef;
}

// --- Update Speed Dial Appearance (based on tooltip enabled state) ---
export function updateSpeedDialAppearance (enabled)
{
    if (localSpeedDialRef && localSpeedDialRef.mainButton)
    {
        localSpeedDialRef.mainButton.style.opacity = enabled ? '1' : '0.7';
        localSpeedDialRef.mainButton.title = enabled ? "Tooltip Options" : "Tooltips Disabled";
        if (!enabled)
        {
            if (localSpeedDialRef.actionsContainer.style.display === 'flex')
            {
                localSpeedDialRef.actionsContainer.style.display = 'none';
                localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
            }
            toggleChatModal(false); // Close chat if tooltips are disabled
        }
    }
}

// --- Chat Modal Logic ---
function createChatModal ()
{
    if (document.getElementById("simpleform-chat-modal") || !document.body) return;

    const modalContainer = document.createElement("div");
    modalContainer.id = "simpleform-chat-modal";
    Object.assign(modalContainer.style, {
        display: "none", position: "fixed", bottom: "95px", right: "25px",
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
        textInput.style.borderColor = "#116530"; // Direct color
        textInput.style.boxShadow = `0 0 0 2px #11653040`; // Direct color with alpha
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
        background: "#D4A017", // Direct secondary color
        color: "#000000", // Black icon for contrast
        border: "none", borderRadius: "8px", padding: "10px 14px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 0.2s ease"
    });
    sendButton.querySelector("svg").style.fill = "#000000"; // Ensure icon is black

    sendButton.onmouseenter = () => sendButton.style.backgroundColor = "#b8860b"; // Direct darker secondary
    sendButton.onmouseleave = () => sendButton.style.backgroundColor = "#D4A017"; // Direct secondary

    const sendMessage = async () =>
    {
        const messageText = textInput.value.trim();
        if (!messageText) return;
        addMessageToChat(messageText, 'user');
        textInput.value = '';
        sendButton.disabled = true;
        Object.assign(sendButton.style, { opacity: "0.7", cursor: "wait" });
        addMessageToChat("Thinking...", 'bot', true);
        try
        {
            const responseData = await fetchTooltipsForKeys([messageText]);
            const botResponse = responseData ? responseData[messageText] : "Sorry, I couldn't find an answer for that.";
            updateLastBotMessage(botResponse || "No definition found.");
        } catch (error)
        {
            console.log("Error fetching chat response:", error);
            updateLastBotMessage("An error occurred while fetching the answer.");
        } finally
        {
            sendButton.disabled = false;
            Object.assign(sendButton.style, { opacity: "1", cursor: "pointer" });
        }
    };
    sendButton.onclick = sendMessage;
    textInput.onkeypress = (e) =>
    {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            sendMessage();
        }
    };
    inputArea.appendChild(textInput);
    inputArea.appendChild(sendButton);

    modalContainer.appendChild(header);
    modalContainer.appendChild(chatHistory);
    modalContainer.appendChild(inputArea);

    document.body.appendChild(modalContainer);
    chatModalRef = { modal: modalContainer, history: chatHistory, input: textInput, sendBtn: sendButton };
}

function addMessageToChat (text, sender, isPending = false)
{
    if (!chatModalRef || !chatModalRef.history) return;
    const messageBubble = document.createElement("div");
    Object.assign(messageBubble.style, {
        padding: "10px 14px", borderRadius: "12px", maxWidth: "80%",
        fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word"
    });
    if (sender === 'user')
    {
        messageBubble.textContent = text;
        Object.assign(messageBubble.style, {
            backgroundColor: "#116530", // Direct primary color
            color: "white", alignSelf: "flex-end", borderBottomRightRadius: "4px"
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
    chatModalRef.history.appendChild(messageBubble);
    chatModalRef.history.scrollTop = chatModalRef.history.scrollHeight;
}

function updateLastBotMessage (text)
{
    if (!chatModalRef || !chatModalRef.history) return;
    const pendingMessage = chatModalRef.history.querySelector(".pending-bot-message");
    if (pendingMessage)
    {
        pendingMessage.textContent = text;
        Object.assign(pendingMessage.style, { fontStyle: "normal", opacity: "1" });
        pendingMessage.classList.remove("pending-bot-message");
    } else
    {
        addMessageToChat(text, 'bot');
    }
    chatModalRef.history.scrollTop = chatModalRef.history.scrollHeight;
}

function toggleChatModal (show)
{
    if (!chatModalRef)
    {
        console.warn("Chat modal not initialized.");
        if (show) createChatModal(); else return;
    }
    if (!chatModalRef) return; // If creation failed
    if (show)
    {
        chatModalRef.modal.style.display = "flex";
        requestAnimationFrame(() =>
        {
            chatModalRef.modal.style.opacity = "1";
            chatModalRef.modal.style.transform = "translateY(0) scale(1)";
        });
        if (localSpeedDialRef?.actionsContainer) localSpeedDialRef.actionsContainer.style.display = "none";
        if (localSpeedDialRef?.mainButton) localSpeedDialRef.mainButton.style.transform = "rotate(0deg)";
    } else
    {
        chatModalRef.modal.style.opacity = "0";
        chatModalRef.modal.style.transform = "translateY(15px) scale(0.98)";
        setTimeout(() =>
        {
            if (chatModalRef) chatModalRef.modal.style.display = "none";
        }, 250); // Match transition duration
    }
}
