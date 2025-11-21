// speed-dial.js

// Module-level state and references
let state;
let helpers;
let speedDialRef = null;

// --- SVG ICONS ---
const SVG_LOADER = `<svg width="28" height="28" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style="display: block; margin: auto;"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="3"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>`;
const SVG_SUPPORT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 1A10 10 0 0 0 2 11v3a2 2 0 0 0 2 2h2v-6H4v-1 a8 8 0 0 1 16 0v1h-2v6h2a2 2 0 0 0 2-2v-3 A10 10 0 0 0 12 1z"/><path d="M7 13h2v4H7zm8 0h2v4h-2z"/></svg>`;
const SVG_REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/></svg>`;
const SVG_LANGUAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4.84 19l5.05-5.05.03.03 6.12-6.12 2.83 2.83z"/></svg>`;
const SVG_SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
const SVG_VISIBILITY_ON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13C8.69 17.5 6 15.08 6 12s2.69-5.5 6-5.5 6 2.42 6 6-2.69 5.5-6 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z"/></svg>`;
const SVG_VISIBILITY_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
const SVG_MOVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>`;
const SVG_CORNER_TL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 4h7v7H4z"/></svg>`;
const SVG_CORNER_TR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M13 4h7v7h-7z"/></svg>`;
const SVG_CORNER_BL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 13h7v7H4z"/></svg>`;
const SVG_CORNER_BR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M13 13h7v7h-7z"/></svg>`;
const SVG_BACK_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
const SVG_PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const SVG_PAUSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const SVG_DELETE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
const SVG_CAMERA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8zm-6-1.82c1.43 0 2.59-1.16 2.59-2.58s-1.16-2.59-2.59-2.59-2.59 1.16-2.59 2.59 1.16 2.59 2.59 2.59z"/></svg>`;
const SVG_MIC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`;
const SVG_TRANSLATE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;


/**
 * Initializes the speed dial module with state and helper functions.
 * @param {object} sdkState - The main state object from the SDK.
 * @param {object} sdkHelpers - An object containing all necessary helper functions.
 */
export function initSpeedDial (sdkState, sdkHelpers)
{
    state = sdkState;
    helpers = sdkHelpers;
}

/**
 * Creates the speed dial DOM elements and attaches event listeners.
 * @returns {object} A reference to the created speed dial elements.
 */
export function createSpeedDial ()
{
    if (document.getElementById("tooltipSpeedDial")) return;

    let toggleTooltipsButton, supportChatBtn, languageButton, translatePageButton;
    let playPauseButton, sendButton, eraseButton, timerDisplay, cameraButton, micButton;

    const speedDialContainer = document.createElement("div");
    speedDialContainer.id = "tooltipSpeedDial";
    Object.assign(speedDialContainer.style, { position: "fixed", zIndex: 2147483646, display: "flex", alignItems: "center" });
    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("tooltip-speed-dial-actions");
    Object.assign(actionsContainer.style, { display: "none", flexDirection: "column", alignItems: "center", gap: "12px" });
    const styleMiniFab = (btn) => Object.assign(btn.style, {
        width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer",
        backgroundColor: "#4A5568", color: "#FFFFFF", boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 0.2s ease, transform 0.1s ease-out, filter 0.2s ease"
    });
    const decorateHoverMiniFab = (btn) =>
    {
        btn.onmouseenter = () => { if (!btn.disabled) btn.style.filter = "brightness(1.2)"; };
        btn.onmouseleave = () => { if (!btn.disabled) btn.style.filter = "brightness(1)"; };
        btn.onmousedown = () => { if (!btn.disabled) btn.style.transform = "scale(0.95)"; };
        btn.onmouseup = () => { if (!btn.disabled) btn.style.transform = "scale(1)"; };
    };

    if (state.businessSettings?.showVideoRecording)
    {
        const recordingControlsContainer = document.createElement('div');
        Object.assign(recordingControlsContainer.style, { display: 'flex', gap: '12px', alignItems: 'center' });

        cameraButton = document.createElement('button'); cameraButton.id = 'cameraBtn'; styleMiniFab(cameraButton); decorateHoverMiniFab(cameraButton);
        micButton = document.createElement('button'); micButton.id = 'micBtn'; styleMiniFab(micButton); decorateHoverMiniFab(micButton);
        playPauseButton = document.createElement('button'); playPauseButton.id = 'playPauseBtn'; styleMiniFab(playPauseButton); decorateHoverMiniFab(playPauseButton);
        sendButton = document.createElement('button'); sendButton.id = 'sendBtn'; sendButton.innerHTML = SVG_SEND_ICON; sendButton.title = 'Finish and Send Recording'; styleMiniFab(sendButton); decorateHoverMiniFab(sendButton);
        eraseButton = document.createElement('button'); eraseButton.id = 'eraseBtn'; eraseButton.innerHTML = SVG_DELETE_ICON; eraseButton.title = 'Cancel Recording'; styleMiniFab(eraseButton); decorateHoverMiniFab(eraseButton);
        timerDisplay = document.createElement('div'); timerDisplay.id = 'timerDisplay'; Object.assign(timerDisplay.style, { fontSize: '14px', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' });

        const setupToggleButton = (button, stateKey, iconSVG, title) =>
        {
            button.innerHTML = iconSVG;
            button.title = title;
            const updateAppearance = () => { button.style.backgroundColor = state[stateKey] ? '#38A169' : '#4A5568'; };
            button.addEventListener('click', (event) =>
            {
                event.stopPropagation();
                state[stateKey] = !state[stateKey];
                if (state.isRecording && state.userStream)
                {
                    const trackType = stateKey === 'isCameraEnabled' ? 'video' : 'audio';
                    const track = state.userStream.getTracks().find(t => t.kind === trackType);
                    if (track)
                    {
                        track.enabled = state[stateKey];
                        const cameraPreview = helpers.getCameraPreview();
                        if (cameraPreview && trackType === 'video') cameraPreview.style.display = track.enabled ? 'block' : 'none';
                    }
                }
                updateAppearance();
            });
            return updateAppearance;
        };

        const updateCameraAppearance = setupToggleButton(cameraButton, 'isCameraEnabled', SVG_CAMERA_ICON, 'Toggle Camera');
        const updateMicAppearance = setupToggleButton(micButton, 'isMicEnabled', SVG_MIC_ICON, 'Toggle Microphone');

        playPauseButton.addEventListener('click', async (event) =>
        {
            event.stopPropagation();
            if (!state.isRecording)
            {
                try { await helpers.startRecording(); } catch (e) { helpers.resetRecordingUI(); }
            } else if (!state.isPaused)
            {
                helpers.pauseRecording();
            } else
            {
                helpers.resumeRecording();
            }
        });
        sendButton.addEventListener('click', (e) => { e.stopPropagation(); helpers.stopRecording(); });
        eraseButton.addEventListener('click', (e) => { e.stopPropagation(); helpers.resetRecording(); });

        helpers.initRecording(state, { createVideoSubmissionModal: (blob, name) => helpers.createVideoSubmissionModal(blob, name, { fetchWithAuth: helpers.fetchWithAuth, resetRecording: helpers.resetRecording }) }, {
            playPauseButton, sendButton, eraseButton, timerDisplay, cameraButton, micButton,
            updateCameraAppearance, updateMicAppearance,
            svgs: { play: SVG_PLAY_ICON, pause: SVG_PAUSE_ICON }
        });

        recordingControlsContainer.append(eraseButton, cameraButton, micButton, playPauseButton, timerDisplay, sendButton);
        actionsContainer.appendChild(recordingControlsContainer);

        helpers.resetRecordingUI();
    }

    const moveOptionsContainer = document.createElement("div");
    Object.assign(moveOptionsContainer.style, { display: "none", flexDirection: "column", alignItems: "center", gap: "12px" });
    const moveButton = document.createElement("button"); styleMiniFab(moveButton); decorateHoverMiniFab(moveButton); moveButton.innerHTML = SVG_MOVE_ICON; moveButton.title = "Move Widget";
    moveButton.addEventListener("click", (e) => { e.stopPropagation(); actionsContainer.style.display = "none"; moveOptionsContainer.style.display = "flex"; });
    actionsContainer.appendChild(moveButton);

    const posOpts = [{ p: "top-left", s: SVG_CORNER_TL }, { p: "top-right", s: SVG_CORNER_TR }, { p: "bottom-left", s: SVG_CORNER_BL }, { p: "bottom-right", s: SVG_CORNER_BR }];
    posOpts.forEach(({ p, s }) =>
    {
        const btn = document.createElement("button"); styleMiniFab(btn); decorateHoverMiniFab(btn); btn.innerHTML = s; btn.title = `Move to ${p.replace('-', ' ')}`;
        btn.addEventListener("click", (e) => { e.stopPropagation(); state.speedDialPosition = p; localStorage.setItem(helpers.SPEED_DIAL_POSITION_STORAGE_KEY, p); updateWidgetPositions(); moveOptionsContainer.style.display = "none"; actionsContainer.style.display = "flex"; });
        moveOptionsContainer.appendChild(btn);
    });

    const backButton = document.createElement("button"); styleMiniFab(backButton); decorateHoverMiniFab(backButton); backButton.innerHTML = SVG_BACK_ARROW; backButton.title = "Back";
    backButton.addEventListener("click", (e) => { e.stopPropagation(); moveOptionsContainer.style.display = "none"; actionsContainer.style.display = "flex"; });
    moveOptionsContainer.appendChild(backButton);

    if (state.businessSettings?.showTooltips)
    {
        toggleTooltipsButton = document.createElement("button"); styleMiniFab(toggleTooltipsButton); decorateHoverMiniFab(toggleTooltipsButton);
        toggleTooltipsButton.addEventListener("click", (e) => { e.stopPropagation(); helpers.toggleTooltips(!state.tooltipsEnabled); actionsContainer.style.display = "none"; });
        actionsContainer.appendChild(toggleTooltipsButton);
    }

    if (state.businessSettings?.showSupportChat)
    {
        supportChatBtn = document.createElement("button"); styleMiniFab(supportChatBtn); decorateHoverMiniFab(supportChatBtn); supportChatBtn.innerHTML = SVG_SUPPORT_ICON; supportChatBtn.title = "Open Support Chat";
        supportChatBtn.addEventListener("click", (e) => { e.stopPropagation(); helpers.toggleSupportChatPanel(true); actionsContainer.style.display = "none"; });
        actionsContainer.appendChild(supportChatBtn);
    }

    if (state.businessSettings?.showLanguageSelector)
    {
        languageButton = document.createElement("button"); styleMiniFab(languageButton); decorateHoverMiniFab(languageButton); languageButton.innerHTML = SVG_LANGUAGE_ICON; languageButton.title = "Select Language";
        languageButton.addEventListener("click", (e) => { e.stopPropagation(); helpers.toggleLanguagePanel(true); actionsContainer.style.display = "none"; });
        actionsContainer.appendChild(languageButton);
    }

    if (state.businessSettings?.showPageTranslation)
    {
        translatePageButton = document.createElement("button");
        translatePageButton.setAttribute("aria-label", "Translate Page");
        translatePageButton.setAttribute("title", "Translate Page");
        styleMiniFab(translatePageButton);
        decorateHoverMiniFab(translatePageButton);
        translatePageButton.innerHTML = SVG_TRANSLATE_ICON;

        translatePageButton.addEventListener("click", async (event) =>
        {
            event.stopPropagation();
            await helpers.translatePageElements(translatePageButton, { showLoaderOnSpeedDial, hideLoaderOnSpeedDial });
            actionsContainer.style.display = "none";
        });
        actionsContainer.appendChild(translatePageButton);
    }

    const refreshButton = document.createElement("button"); styleMiniFab(refreshButton); decorateHoverMiniFab(refreshButton); refreshButton.innerHTML = SVG_REFRESH_ICON; refreshButton.title = "Refresh all tooltips";
    refreshButton.addEventListener("click", (e) =>
    {
        e.stopPropagation(); if (!state.tooltipsEnabled) return;
        refreshButton.disabled = true; refreshButton.style.opacity = "0.6";
        const keys = helpers.gatherKeysFromAllFields();
        helpers.fetchTooltipsForKeys(keys).then(data => { helpers.updateQuestionMatrix(data); helpers.resetRefreshTracking(); helpers.removeAllTooltipIcons(); helpers.processAllFormFields(); })
            .finally(() => { refreshButton.disabled = false; refreshButton.style.opacity = "1"; actionsContainer.style.display = "none"; });
    });
    actionsContainer.appendChild(refreshButton);

    const mainButton = document.createElement("button"); mainButton.id = "tooltipSpeedDial_mainButton"; mainButton.title = "Options";
    Object.assign(mainButton.style, { width: "56px", height: "56px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "#1A202C", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease, background-color 0.2s ease", padding: "0" });
    mainButton.onmouseenter = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = "#2D3748"; };
    mainButton.onmouseleave = () => { if (!mainButton.dataset.isLoading) mainButton.style.backgroundColor = "#1A202C"; };
    const mainImg = document.createElement("img"); mainImg.alt = "SDK Icon"; Object.assign(mainImg.style, { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" });
    mainImg.src = "icon128.png";
    mainButton.appendChild(mainImg);
    mainButton.addEventListener("click", () =>
    {
        if (mainButton.dataset.isLoading === "true") return;
        const isAnyPanelOpen = helpers.isSupportChatOpen() || helpers.isLanguagePanelOpen();
        const isActionsOpen = actionsContainer.style.display === "flex" || moveOptionsContainer.style.display === "flex";
        if (isAnyPanelOpen)
        {
            helpers.toggleSupportChatPanel(false);
            helpers.toggleLanguagePanel(false);
        }
        if (isActionsOpen)
        {
            actionsContainer.style.display = "none"; moveOptionsContainer.style.display = "none";
        } else if (!isAnyPanelOpen)
        {
            actionsContainer.style.display = "flex";
        }
    });

    speedDialContainer.append(actionsContainer, moveOptionsContainer, mainButton);
    document.body.appendChild(speedDialContainer);

    speedDialRef = { speedDial: speedDialContainer, mainButton, actionsContainer, moveOptionsContainer, toggleTooltipsButton, refreshButton, mainImg };
    updateWidgetPositions();
    window.addEventListener("resize", updateWidgetPositions);
    return speedDialRef;
}

/**
 * Repositions the speed dial and related panels based on the current state.
 */
export function updateWidgetPositions ()
{
    if (!speedDialRef?.speedDial) return;
    const dial = speedDialRef.speedDial;
    const pos = state.speedDialPosition, offset = "25px", margin = "12px";
    Object.assign(dial.style, { top: "auto", bottom: "auto", left: "auto", right: "auto" });
    if (pos.includes("bottom"))
    {
        dial.style.bottom = offset; dial.style.flexDirection = "column-reverse";
        speedDialRef.actionsContainer.style.marginBottom = margin;
        speedDialRef.moveOptionsContainer.style.marginBottom = margin;
    } else
    {
        dial.style.top = offset; dial.style.flexDirection = "column";
        speedDialRef.actionsContainer.style.marginTop = margin;
        speedDialRef.moveOptionsContainer.style.marginTop = margin;
    }
    if (pos.includes("left")) dial.style.left = offset;
    else dial.style.right = offset;

    requestAnimationFrame(() =>
    {
        const dialRect = dial.getBoundingClientRect(), panelMargin = 15;
        const supportPanel = document.querySelector("#simple-support-host")?.shadowRoot.querySelector("#ss-panel");
        const langPanel = document.querySelector("#simpleform-lang-host")?.shadowRoot.querySelector("#sf-lang-panel");
        [supportPanel, langPanel].forEach(panel =>
        {
            if (!panel) return;
            Object.assign(panel.style, { top: "auto", bottom: "auto", left: "auto", right: "auto" });
            if (pos.includes("bottom")) panel.style.bottom = `${window.innerHeight - dialRect.top + panelMargin}px`;
            else panel.style.top = `${dialRect.bottom + panelMargin}px`;
            if (pos.includes("left")) panel.style.left = `${dialRect.left}px`;
            else panel.style.right = `${window.innerWidth - dialRect.right}px`;
        });
    });
}

/**
 * Updates the appearance of buttons within the speed dial.
 * @param {object} ref - The speed dial reference object.
 * @param {boolean} enabled - The current enabled state of the tooltips.
 */
export function updateSpeedDialAppearance (ref, enabled)
{
    if (!ref) ref = speedDialRef; // Allow passing ref or use module-level
    if (!ref?.mainButton) return;
    if (ref.toggleTooltipsButton)
    {
        ref.toggleTooltipsButton.innerHTML = enabled ? SVG_VISIBILITY_ON_ICON : SVG_VISIBILITY_OFF_ICON;
        ref.toggleTooltipsButton.title = enabled ? "Disable Tooltips" : "Enable Tooltips";
    }
    if (ref.refreshButton)
    {
        ref.refreshButton.disabled = !enabled;
        ref.refreshButton.style.opacity = enabled ? "1" : "0.6";
        ref.refreshButton.style.cursor = enabled ? "pointer" : "not-allowed";
    }
}

/**
 * Displays a loading spinner on the main speed dial button.
 * @param {object} ref - The speed dial reference object.
 */
export function showLoaderOnSpeedDial (ref)
{
    if (!ref) ref = speedDialRef;
    if (ref?.mainButton && !ref.mainButton.dataset.isLoading)
    {
        ref.mainButton.dataset.originalContent = ref.mainButton.innerHTML;
        ref.mainButton.innerHTML = SVG_LOADER;
        ref.mainButton.dataset.isLoading = "true";
    }
}

/**
 * Hides the loading spinner on the main speed dial button.
 * @param {object} ref - The speed dial reference object.
 */
export function hideLoaderOnSpeedDial (ref)
{
    if (!ref) ref = speedDialRef;
    if (ref?.mainButton?.dataset.isLoading === "true")
    {
        ref.mainButton.innerHTML = ref.mainButton.dataset.originalContent || "";
        if (!ref.mainButton.dataset.originalContent && ref.mainImg)
        {
            ref.mainButton.appendChild(ref.mainImg);
        }
        delete ref.mainButton.dataset.isLoading;
        delete ref.mainButton.dataset.originalContent;
    }
}