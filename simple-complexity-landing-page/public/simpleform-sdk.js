// simpleform-sdk.js

// Import feature modules
import
{
    initTooltips, createTooltipContainer, addTooltipToField, removeAllTooltipIcons,
    fetchAndShowSelectedTextTooltip, toggleTooltipsGlobal
} from './tooltip.js';
import
{
    initTTS, isSpeechSupported, speak, cancelSpeech, translatePageElements
} from './tts.js';
import
{
    initRecording, startRecording, stopRecording, pauseRecording,
    resumeRecording, resetRecording, getCameraPreview, resetRecordingUI
} from './recording.js';
import
{
    initSupportChat, toggleSupportChatPanel, isSupportChatOpen
} from './support-chat.js';
import
{
    initLanguagePanel, toggleLanguagePanel, isLanguagePanelOpen
} from './language-panel.js';
import { createVideoSubmissionModal } from './video-modal.js';
import
{
    initSpeedDial, createSpeedDial, updateWidgetPositions, updateSpeedDialAppearance,
    showLoaderOnSpeedDial, hideLoaderOnSpeedDial
} from './speed-dial.js';


(() =>
{
    var state = {
        apiKey: null,
        questionMatrix: {},
        refreshCounts: {},
        lastRefreshTimes: {},
        tooltipsEnabled: true,
        tooltipRefGlobal: null,
        speedDialRef: null,
        temporaryTooltipRef: null,
        activeFetches: 0,
        speedDialEnabledGlobal: true,
        selectedLang: 'en',
        speedDialPosition: "bottom-right",
        isRecording: false,
        isPaused: false,
        recordingStartTime: null,
        mediaRecorder: null,
        recordedChunks: [],
        isCameraEnabled: false,
        isMicEnabled: false,
        userStream: null,
        screenStream: null,
        businessSettings: null,
        originalTextNodes: new Map()
    };

    // --- STATE MANAGEMENT ---
    function updateQuestionMatrix (newData) { state.questionMatrix = { ...state.questionMatrix, ...newData }; }
    function getQuestion (key) { return state.questionMatrix[key]; }
    function incrementRefreshCount (key) { state.refreshCounts[key] = (state.refreshCounts[key] || 0) + 1; }
    function getRefreshCount (key) { return state.refreshCounts[key] || 0; }
    function setLastRefreshTime (key, time) { state.lastRefreshTimes[key] = time; }
    function getLastRefreshTime (key) { return state.lastRefreshTimes[key] || 0; }
    function resetRefreshTracking () { state.refreshCounts = {}; state.lastRefreshTimes = {}; }
    function setTooltipRef (ref) { state.tooltipRefGlobal = ref; }
    function setSpeedDialRef (ref) { state.speedDialRef = ref; }
    function setTemporaryTooltipRef (ref) { state.temporaryTooltipRef = ref; }
    function incrementActiveFetches () { state.activeFetches++; }
    function decrementActiveFetches () { state.activeFetches--; }

    // --- API & GLOBAL CONSTANTS ---
    var API_BASE_URL = "http://localhost:8000/api";
    var QUESTION_LOOKUP_ENDPOINT = `${API_BASE_URL}/question-lookup`;
    var BUSINESS_DETAILS_ENDPOINT = `${API_BASE_URL}/business`;
    var FORM_FIELD_SELECTOR = 'form input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not(:disabled), form textarea:not(:disabled), form select:not(:disabled)';
    var DYNAMIC_FIELD_MATCH_SELECTOR = 'form input:not([type="hidden"]), form textarea, form select';
    var MUTATION_OBSERVER_DEBOUNCE_MS = 500;
    var LANGUAGE_STORAGE_KEY = "simpleform_sdk_persistent_lang";
    var TOOLTIPS_ENABLED_STORAGE_KEY = "simpleform_sdk_tooltips_enabled";
    var SPEED_DIAL_POSITION_STORAGE_KEY = "simpleform_sdk_speed_dial_position";

    // --- UTILITY FUNCTIONS ---
    function isSafari () { return /^((?!chrome|android).)*safari/i.test(navigator.userAgent); }
    function determineBestKey (field)
    {
        if (field.labels?.[0]?.textContent.trim()) return field.labels[0].textContent.trim();
        if (field.id)
        {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label?.textContent.trim()) return label.textContent.trim();
        }
        if (field.dataset.tooltipKey?.trim()) return field.dataset.tooltipKey.trim();
        const baseKey = field.name || field.id;
        if (baseKey) return baseKey;
        if (field.placeholder?.trim()) return field.placeholder.trim();
        const ariaLabel = field.getAttribute("aria-label");
        if (ariaLabel?.trim()) return ariaLabel.trim();
        return null;
    }
    function processAllFormFields ()
    {
        if (!state.tooltipsEnabled || !state.tooltipRefGlobal) return;
        document.querySelectorAll(FORM_FIELD_SELECTOR).forEach(field =>
        {
            if (field.offsetParent !== null) addTooltipToField(field);
        });
    }
    function gatherKeysFromAllFields ()
    {
        const keys = new Set();
        document.querySelectorAll(FORM_FIELD_SELECTOR).forEach(field =>
        {
            if (field.offsetParent !== null && !field.disabled)
            {
                const key = determineBestKey(field);
                if (key) keys.add(key);
            }
        });
        return Array.from(keys);
    }

    // --- API CALLS ---
    function fetchWithAuth (url, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            if (!isSafari() && state.activeFetches === 0) showLoaderOnSpeedDial(state.speedDialRef);
            incrementActiveFetches();
            const headers = { ...options.headers, ...(state.apiKey && { Authorization: `Bearer ${state.apiKey}` }) };
            fetch(url, { ...options, headers })
                .then(resolve)
                .catch(reject)
                .finally(() =>
                {
                    decrementActiveFetches();
                    if (!isSafari() && state.activeFetches === 0) hideLoaderOnSpeedDial(state.speedDialRef);
                });
        });
    }

    function fetchTooltipsForKeys (keys = [])
    {
        if (!Array.isArray(keys) || keys.length === 0) return Promise.resolve({});
        const uniqueKeys = [...new Set(keys)].filter(k => typeof k === "string" && k.trim() !== "");
        if (uniqueKeys.length === 0) return Promise.resolve({});
        return fetchWithAuth(QUESTION_LOOKUP_ENDPOINT, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys: uniqueKeys, language: state.selectedLang || null })
        }).then(async resp =>
        {
            if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
            return resp.json();
        }).catch(err => { console.warn("Tooltip lookup failed:", err); return {}; });
    }

    function fetchBusinessDetails ()
    {
        return fetchWithAuth(BUSINESS_DETAILS_ENDPOINT).then(async resp =>
        {
            if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
            return resp.json();
        }).catch(err => { console.warn("Failed to fetch business details:", err); return null; });
    }

    // --- DYNAMIC OBSERVERS ---
    var observer = null;
    var debounceTimer = null;
    function processPotentiallyNewFields (fieldsToProcess)
    {
        if (fieldsToProcess.length === 0) return;
        const fields = [...new Set(fieldsToProcess)].filter(f => f.offsetParent !== null && !f.disabled && f.dataset.tooltipInjected !== "true");
        if (fields.length === 0) return;

        const newKeys = [...new Set(fields.map(f =>
        {
            const key = determineBestKey(f);
            if (key) f.dataset.potentialKey = key;
            return key;
        }).filter(key => key && !getQuestion(key)))];

        const applyTooltips = () => fields.forEach(f =>
        {
            if (f.offsetParent !== null && !f.disabled && f.dataset.tooltipInjected !== "true")
            {
                const key = f.dataset.potentialKey || determineBestKey(f);
                if (key && getQuestion(key)) addTooltipToField(f);
                delete f.dataset.potentialKey;
            }
        });

        if (newKeys.length > 0)
        {
            fetchTooltipsForKeys(newKeys).then(newData =>
            {
                updateQuestionMatrix(newData);
                applyTooltips();
            }).catch(() => applyTooltips());
        } else
        {
            applyTooltips();
        }
    }

    function observeDynamicFields ()
    {
        if (observer) observer.disconnect();
        observer = new MutationObserver(mutations =>
        {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() =>
            {
                if (!state.tooltipsEnabled) return;
                const fields = [];
                mutations.forEach(m =>
                {
                    m.addedNodes.forEach(n =>
                    {
                        if (n.nodeType === Node.ELEMENT_NODE)
                        {
                            if (n.matches?.(DYNAMIC_FIELD_MATCH_SELECTOR)) fields.push(n);
                            fields.push(...n.querySelectorAll?.(DYNAMIC_FIELD_MATCH_SELECTOR));
                        }
                    });
                    if (m.type === "attributes" && m.target.matches?.(DYNAMIC_FIELD_MATCH_SELECTOR))
                    {
                        fields.push(m.target);
                    }
                });
                if (fields.length > 0) processPotentiallyNewFields(fields);
            }, MUTATION_OBSERVER_DEBOUNCE_MS);
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "id", "name", "placeholder", "data-tooltip-key"] });
    }

    function disconnectObserver ()
    {
        if (observer)
        {
            observer.disconnect();
            observer = null;
            clearTimeout(debounceTimer);
        }
    }

    // --- INITIALIZATION ---
    function initialize (config = {})
    {
        if (!document.body)
        {
            setTimeout(() => initialize(config), 100);
            return;
        }
        console.log("Initializing SimpleForm SDK...");
        if (!config.apiKey)
        {
            console.error("SimpleForm SDK: API key is required.");
            return;
        }
        state.apiKey = config.apiKey;

        fetchBusinessDetails().then(businessDetails =>
        {
            if (!businessDetails?.showSpeedDial)
            {
                console.log("SimpleForm SDK is disabled by business settings.");
                return;
            }

            state.businessSettings = businessDetails;
            state.speedDialEnabledGlobal = true;

            // Initialize all feature modules, passing state and helpers
            initTTS(state, { fetchWithAuth });

            initTooltips(state, {
                // Core tooltip helpers
                getQuestion, isSpeechSupported, cancelSpeech, determineBestKey,
                fetchTooltipsForKeys, getRefreshCount, setLastRefreshTime,
                getLastRefreshTime, incrementRefreshCount, updateQuestionMatrix, setTemporaryTooltipRef,
                speak: (text) => speak(text, state.selectedLang),
                // Helpers for the global toggle function
                TOOLTIPS_ENABLED_STORAGE_KEY,
                disconnectObserver,
                resetRefreshTracking,
                setTooltipRef,
                gatherKeysFromAllFields,
                processAllFormFields,
                observeDynamicFields,
                updateSpeedDialAppearance
            });
            initSupportChat(state, {
                fetchWithAuth,
                toggleLanguagePanel,
                isLanguagePanelOpen
            });
            initLanguagePanel(state, {
                fetchWithAuth,
                toggleSupportChatPanel,
                isSupportChatOpen,
                LANGUAGE_STORAGE_KEY
            });
            initSpeedDial(state, {
                initRecording,
                isSupportChatOpen, isLanguagePanelOpen, toggleSupportChatPanel, toggleLanguagePanel,
                startRecording, pauseRecording, resumeRecording, stopRecording, resetRecording,
                getCameraPreview, resetRecordingUI, createVideoSubmissionModal, fetchWithAuth,
                gatherKeysFromAllFields, fetchTooltipsForKeys, updateQuestionMatrix,
                resetRefreshTracking, removeAllTooltipIcons, processAllFormFields,
                translatePageElements, SPEED_DIAL_POSITION_STORAGE_KEY,
                toggleTooltips: toggleTooltipsGlobal
            });


            // Restore saved settings from localStorage
            const savedTooltips = localStorage.getItem(TOOLTIPS_ENABLED_STORAGE_KEY);
            state.tooltipsEnabled = businessDetails.showTooltips && savedTooltips !== 'false';
            state.selectedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
            state.speedDialPosition = localStorage.getItem(SPEED_DIAL_POSITION_STORAGE_KEY) || "bottom-right";

            if (state.tooltipsEnabled) setTooltipRef(createTooltipContainer());

            // Create the Speed Dial UI and store its DOM reference in the state
            setSpeedDialRef(createSpeedDial());

            // Update UI based on fetched settings
            if (businessDetails.logo_url && state.speedDialRef?.mainImg)
            {
                state.speedDialRef.mainImg.src = businessDetails.logo_url;
            }

            // Initial fetch of tooltips
            if (state.tooltipsEnabled)
            {
                const keys = gatherKeysFromAllFields();
                if (keys.length > 0)
                {
                    fetchTooltipsForKeys(keys).then(data =>
                    {
                        updateQuestionMatrix(data);
                        processAllFormFields();
                    }).finally(observeDynamicFields);
                } else
                {
                    observeDynamicFields();
                }
            }

            updateSpeedDialAppearance(state.speedDialRef, state.tooltipsEnabled);
            console.log("SimpleForm SDK initialization complete.");

        }).catch(err =>
        {
            console.error("Failed to fetch business details; SDK will not be activated.", err);
        });
    }

    // --- GLOBAL API ---
    window.addEventListener("beforeunload", () =>
    {
        cancelSpeech();
        disconnectObserver();
    });
    window.SimpleFormSDK = {
        init: initialize,
        toggleTooltips: toggleTooltipsGlobal,
        fetchAndShowSelectedTextTooltip
    };
})();