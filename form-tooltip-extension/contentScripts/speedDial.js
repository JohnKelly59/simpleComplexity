/**
 * speedDial.js
 * ────────────────────────────────────────────────────────────────────────────
 * Renders the floating Speed-Dial FAB and its modal chat window.
 * Keeps *independent* chat histories for:
 * • Question Assistant  → POST /question-lookup
 * • Support Assistant   → POST /support/query   (now sends page-context)
 *
 * All other functionality (refresh, loader, enable/disable) is preserved.
 */

import
{
    SVG_LOADER,
    SVG_REFRESH_ICON,
    SVG_CHAT_ICON,
    SVG_SUPPORT_ICON,     // uses question-mark icon via config.js
    SVG_SEND_ICON,
    SVG_CLOSE_ICON
} from './config.js';

import { isBackgroundLight } from './utils.js';

import
{
    gatherKeysFromAllFields,
    removeAllTooltipIcons as removeIcons,
    processAllFormFields
} from './fieldProcessor.js';

import { fetchTooltipsForKeys, sendSupportQuery } from './api.js';
import { state, updateQuestionMatrix, resetRefreshTracking } from './mainState.js';

/* ════════════════════════════════════════════════════════════════════ */
/* Module-level refs & per-assistant chat logs                          */
/* ════════════════════════════════════════════════════════════════════ */

let localSpeedDialRef = null;        // { speedDial, mainButton, actionsContainer, … }
let chatModalRef = null;        // { modal, history, input, sendBtn, title, mode }

/** Separate message arrays (lost when the page reloads) */
const chatHistories = {
    question: [],   // [{ text, sender, pending? }]
    support: []    // [{ text, sender, pending? }]
};

/* ════════════════════════════════════════════════════════════════════ */
/* Loader helpers exposed to other modules                             */
/* ════════════════════════════════════════════════════════════════════ */
export function showLoaderOnSpeedDial ()
{
    const btn = localSpeedDialRef?.mainButton;
    if (!btn || btn.dataset.isLoading) return;

    btn.dataset.originalContent = btn.innerHTML;
    btn.innerHTML = SVG_LOADER;
    btn.dataset.isLoading = 'true';
}
export function hideLoaderOnSpeedDial ()
{
    const btn = localSpeedDialRef?.mainButton;
    if (!btn?.dataset.isLoading) return;

    btn.innerHTML = btn.dataset.originalContent || '';
    if (!btn.dataset.originalContent && localSpeedDialRef.mainImg)
    {
        btn.appendChild(localSpeedDialRef.mainImg);
    }
    delete btn.dataset.isLoading;
    delete btn.dataset.originalContent;
}

/* ════════════════════════════════════════════════════════════════════ */
/* Speed-Dial creation                                                 */
/* ════════════════════════════════════════════════════════════════════ */
export function createSpeedDial ()
{
    if (document.getElementById('tooltipSpeedDial') || !document.body) return null;

    /* Container */
    const speedDial = Object.assign(document.createElement('div'), { id: 'tooltipSpeedDial' });
    Object.assign(speedDial.style, {
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        zIndex: 2147483646,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center'
    });

    /* Actions holder */
    const actions = Object.assign(document.createElement('div'), { className: 'tooltip-speed-dial-actions' });
    Object.assign(actions.style, {
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '12px',
        gap: '12px'
    });

    /* Helper to copy button styles */
    const styleMiniFab = btn => Object.assign(btn.style, {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: '#4A5568',
        color: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color .2s, transform .1s'
    });

    /* — Chat (Question Assistant) — */
    const chatBtn = document.createElement('button');
    chatBtn.setAttribute('aria-label', 'Open Question Assistant');
    chatBtn.title = 'Open Question Assistant';
    chatBtn.innerHTML = SVG_CHAT_ICON;
    styleMiniFab(chatBtn); decorateHover(chatBtn);
    chatBtn.addEventListener('click', e =>
    {
        e.preventDefault(); e.stopPropagation();
        if (state.tooltipsEnabled) openChatModal('question');
    });
    actions.appendChild(chatBtn);

    /* — Support (Support Assistant) — */
    const supportBtn = document.createElement('button');
    supportBtn.setAttribute('aria-label', 'Open Support');
    supportBtn.title = 'Open Support Assistant';
    supportBtn.innerHTML = SVG_SUPPORT_ICON;
    styleMiniFab(supportBtn); decorateHover(supportBtn);
    supportBtn.addEventListener('click', e =>
    {
        e.preventDefault(); e.stopPropagation();
        if (state.tooltipsEnabled) openChatModal('support');
    });
    actions.appendChild(supportBtn);

    /* — Refresh all tooltips — */
    const refreshBtn = document.createElement('button');
    refreshBtn.setAttribute('aria-label', 'Refresh tooltips');
    refreshBtn.title = 'Refresh all tooltips';
    refreshBtn.innerHTML = SVG_REFRESH_ICON;
    styleMiniFab(refreshBtn); decorateHover(refreshBtn);
    refreshBtn.addEventListener('click', onRefreshClick);
    actions.appendChild(refreshBtn);

    /* Main FAB */
    const mainBtn = Object.assign(document.createElement('button'), { id: 'tooltipSpeedDial_mainButton' });
    mainBtn.setAttribute('aria-label', 'Open tooltip options');
    mainBtn.title = state.tooltipsEnabled ? 'Tooltip Options' : 'Tooltips Disabled';
    Object.assign(mainBtn.style, {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: '#1A202C',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: state.tooltipsEnabled ? 1 : .7,
        transition: 'transform .2s cubic-bezier(.34,1.56,.64,1), background-color .2s, opacity .2s'
    });
    mainBtn.onmouseenter = () => !mainBtn.dataset.isLoading && (mainBtn.style.background = '#2D3748');
    mainBtn.onmouseleave = () => !mainBtn.dataset.isLoading && (mainBtn.style.background = '#1A202C');

    const mainImg = Object.assign(document.createElement('img'), { alt: '' });
    Object.assign(mainImg.style, { width: '28px', height: '28px' });
    try
    {
        mainImg.src = chrome.runtime.getURL(isBackgroundLight() ? 'icon128.png' : 'SC_COLOR.png');
    } catch
    {
        try { mainImg.src = chrome.runtime.getURL('icon128.png'); } catch { }
    }
    mainBtn.appendChild(mainImg);
    mainBtn.addEventListener('click', () =>
    {
        if (!state.tooltipsEnabled || mainBtn.dataset.isLoading === 'true') return;

        if (chatModalRef?.modal.style.display === 'flex') { closeChatModal(); return; }
        const open = actions.style.display === 'flex';
        actions.style.display = open ? 'none' : 'flex';
        mainBtn.style.transform = open ? 'rotate(0deg)' : 'rotate(135deg)';
    });

    /* Mount */
    speedDial.append(actions, mainBtn);
    document.body.appendChild(speedDial);
    createChatModal();   // build hidden modal once

    localSpeedDialRef = {
        speedDial,
        mainButton: mainBtn,
        actionsContainer: actions,
        refreshButton: refreshBtn,
        chatButton: chatBtn,
        supportButton: supportBtn,
        mainImg
    };
    return localSpeedDialRef;
}

/* ════════════════════════════════════════════════════════════════════ */
/* Appearance toggle                                                   */
/* ════════════════════════════════════════════════════════════════════ */
export function updateSpeedDialAppearance (enabled)
{
    if (!localSpeedDialRef) return;
    const { mainButton, actionsContainer } = localSpeedDialRef;
    mainButton.style.opacity = enabled ? 1 : .7;
    mainButton.title = enabled ? 'Tooltip Options' : 'Tooltips Disabled';

    if (!enabled)
    {
        actionsContainer.style.display = 'none';
        mainButton.style.transform = 'rotate(0deg)';
        closeChatModal();
    }
}

/* ════════════════════════════════════════════════════════════════════ */
/* Chat modal                                                          */
/* ════════════════════════════════════════════════════════════════════ */
function createChatModal ()
{
    if (document.getElementById('simpleform-chat-modal')) return;

    /* Wrapper */
    const modal = Object.assign(document.createElement('div'), { id: 'simpleform-chat-modal' });
    Object.assign(modal.style, {
        display: 'none',
        position: 'fixed',
        bottom: '95px',
        right: '25px',
        width: '330px',
        height: '480px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0,0,0,.12), 0 6px 15px rgba(0,0,0,.08)',
        zIndex: 2147483647,
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
        transition: 'opacity .25s, transform .25s',
        opacity: 0,
        transform: 'translateY(15px) scale(.98)'
    });

    /* Header */
    const header = document.createElement('div');
    Object.assign(header.style, {
        padding: '16px 20px',
        background: '#f7f7f7',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    });

    const title = Object.assign(document.createElement('h2'), { textContent: 'Question Assistant' });
    Object.assign(title.style, { margin: 0, fontSize: '17px', fontWeight: 600, color: '#212529' });

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = SVG_CLOSE_ICON;
    Object.assign(closeBtn.style, {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#555',
        padding: '5px',
        borderRadius: '50%'
    });
    closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(0,0,0,.05)';
    closeBtn.onmouseleave = () => closeBtn.style.background = 'transparent';
    closeBtn.onclick = closeChatModal;

    header.append(title, closeBtn);

    /* History viewport */
    const historyWrap = Object.assign(document.createElement('div'), { id: 'simpleform-chat-history' });
    Object.assign(historyWrap.style, {
        flexGrow: 1,
        padding: '20px',
        overflowY: 'auto',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    });

    /* Input area */
    const inputBar = document.createElement('div');
    Object.assign(inputBar.style, {
        display: 'flex',
        padding: '16px 20px',
        borderTop: '1px solid #e0e0e0',
        background: '#f7f7f7'
    });

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Type your question…';
    textInput.setAttribute('aria-label', 'Chat input');
    Object.assign(textInput.style, {
        flexGrow: 1,
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        marginRight: '10px',
        outline: 'none',
        transition: 'border-color .2s, box-shadow .2s'
    });
    textInput.onfocus = () =>
    {
        textInput.style.borderColor = '#116530';
        textInput.style.boxShadow = '0 0 0 2px #11653040';
    };
    textInput.onblur = () =>
    {
        textInput.style.borderColor = '#d1d5db';
        textInput.style.boxShadow = 'none';
    };

    const sendBtn = document.createElement('button');
    sendBtn.innerHTML = SVG_SEND_ICON;
    sendBtn.setAttribute('aria-label', 'Send');
    Object.assign(sendBtn.style, {
        background: '#D4A017',
        color: '#000',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color .2s'
    });
    sendBtn.querySelector('svg').style.fill = '#000';
    sendBtn.onmouseenter = () => sendBtn.style.background = '#b8860b';
    sendBtn.onmouseleave = () => sendBtn.style.background = '#D4A017';

    /* Send handler */
    const sendMsg = async () =>
    {
        const text = textInput.value.trim();
        if (!text) return;

        addMsg(text, 'user');
        textInput.value = '';
        sendBtn.disabled = true;
        Object.assign(sendBtn.style, { opacity: .7, cursor: 'wait' });
        addMsg('Thinking…', 'bot', true);

        try
        {
            let answer = '';
            if (chatModalRef.mode === 'support')
            {
                const pageContext = document.body.innerText.substring(0, 4000);
                answer = await sendSupportQuery(text, pageContext);
            } else
            {
                const d = await fetchTooltipsForKeys([text]);
                answer = d?.[text] || '';
            }
            if (!answer) answer = 'Sorry — no answer found.';
            resolvePendingBot(answer);
        } catch (err)
        {
            console.error(err);
            resolvePendingBot('Something went wrong.');
        } finally
        {
            sendBtn.disabled = false;
            Object.assign(sendBtn.style, { opacity: 1, cursor: 'pointer' });
        }
    };
    sendBtn.onclick = sendMsg;
    textInput.onkeypress = e =>
    {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    };

    inputBar.append(textInput, sendBtn);
    modal.append(header, historyWrap, inputBar);
    document.body.appendChild(modal);

    chatModalRef = {
        modal,
        history: historyWrap,
        input: textInput,
        sendBtn,
        title,
        mode: 'question'
    };
}

/* ════════════════════════════════════════════════════════════════════ */
/* Speed-Dial helper functions                                         */
/* ════════════════════════════════════════════════════════════════════ */

/** mini-FAB hover/press effects */
function decorateHover (btn)
{
    btn.onmouseenter = () => !btn.disabled && (btn.style.background = '#2D3748');
    btn.onmouseleave = () => !btn.disabled && (btn.style.background = '#4A5568');
    btn.onmousedown = () => (btn.style.transform = 'scale(.95)');
    btn.onmouseup = () => (btn.style.transform = 'scale(1)');
}

/** Refresh-all handler */
async function onRefreshClick (e)
{
    e.preventDefault(); e.stopPropagation();
    if (!state.tooltipsEnabled) return;

    const { refreshButton: btn, actionsContainer, mainButton } = localSpeedDialRef;
    btn.disabled = true;
    Object.assign(btn.style, { opacity: .6, cursor: 'not-allowed' });

    try
    {
        const keys = gatherKeysFromAllFields();
        if (keys.length)
        {
            const data = await fetchTooltipsForKeys(keys);
            updateQuestionMatrix(data);
            resetRefreshTracking();
            removeIcons(); processAllFormFields();
        }
    } catch (err) { console.error('Refresh failed:', err); }

    btn.disabled = false;
    Object.assign(btn.style, { opacity: 1, cursor: 'pointer' });
    actionsContainer.style.display = 'none';
    mainButton.style.transform = 'rotate(0deg)';
}

/* ════════════════════════════════════════════════════════════════════ */
/* Chat message helpers                                                */
/* ════════════════════════════════════════════════════════════════════ */
function addMsg (text, sender, pending = false)
{
    const bubble = document.createElement('div');
    Object.assign(bubble.style, {
        padding: '10px 14px',
        borderRadius: '12px',
        maxWidth: '80%',
        fontSize: '14px',
        lineHeight: 1.5,
        wordBreak: 'break-word'
    });

    if (sender === 'user')
    {
        Object.assign(bubble.style, {
            background: '#116530',
            color: '#fff',
            alignSelf: 'flex-end',
            borderBottomRightRadius: '4px'
        });
    } else
    {
        Object.assign(bubble.style, {
            background: '#f0f0f0',
            color: '#212529',
            alignSelf: 'flex-start',
            borderBottomLeftRadius: '4px'
        });
        if (pending)
        {
            bubble.classList.add('pending');
            bubble.style.fontStyle = 'italic';
            bubble.style.opacity = .8;
        }
    }
    bubble.textContent = text;
    chatModalRef.history.appendChild(bubble);
    chatModalRef.history.scrollTop = chatModalRef.history.scrollHeight;

    /* persist */
    chatHistories[chatModalRef.mode].push({ text, sender, pending });
}
function resolvePendingBot (text)
{
    const pending = chatModalRef.history.querySelector('.pending');
    if (pending)
    {
        pending.textContent = text;
        pending.style.fontStyle = 'normal';
        pending.style.opacity = 1;
        pending.classList.remove('pending');
    } else addMsg(text, 'bot');

    /* update log */
    const log = chatHistories[chatModalRef.mode];
    const last = log[log.length - 1];
    if (last?.pending) { last.text = text; last.pending = false; }
}

/* ════════════════════════════════════════════════════════════════════ */
/* Modal open/close & history swap                                     */
/* ════════════════════════════════════════════════════════════════════ */
function openChatModal (mode = 'question')
{
    if (!chatModalRef) createChatModal();

    chatModalRef.mode = mode;
    chatModalRef.title.textContent = mode === 'support' ? 'Support Assistant' : 'Question Assistant';

    /* rebuild viewport */
    chatModalRef.history.innerHTML = '';
    chatHistories[mode].forEach(({ text, sender, pending }) => addMsg(text, sender, pending));

    chatModalRef.modal.style.display = 'flex';
    requestAnimationFrame(() =>
    {
        chatModalRef.modal.style.opacity = 1;
        chatModalRef.modal.style.transform = 'translateY(0) scale(1)';
    });
    localSpeedDialRef.actionsContainer.style.display = 'none';
    localSpeedDialRef.mainButton.style.transform = 'rotate(0deg)';
}
function closeChatModal ()
{
    if (!chatModalRef) return;
    chatModalRef.modal.style.opacity = 0;
    chatModalRef.modal.style.transform = 'translateY(15px) scale(.98)';
    setTimeout(() =>
    {
        if (chatModalRef) chatModalRef.modal.style.display = 'none';
    }, 250);
}