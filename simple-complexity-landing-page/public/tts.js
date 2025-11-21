// tts.js

const ttsState = {
    synth: window.speechSynthesis,
    voices: [],
    voicesLoaded: false
};

let state;
let helpers;

const TRANSLATE_PAGE_ENDPOINT = `http://localhost:8000/api/translate-page`;

function loadVoices ()
{
    if (!ttsState.synth) return;
    try
    {
        ttsState.voices = ttsState.synth.getVoices();
        if (ttsState.voices.length > 0)
        {
            ttsState.voicesLoaded = true;
        }
    } catch (error)
    {
        console.warn("Error getting TTS voices:", error);
        ttsState.voices = [];
        ttsState.voicesLoaded = false;
    }
}

/**
 * Internal function to fetch page translations from the API.
 */
function fetchPageTranslation (texts, targetLanguage)
{
    return helpers.fetchWithAuth(TRANSLATE_PAGE_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ texts, target_language: targetLanguage })
    }).then(async resp =>
    {
        if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
        return resp.json();
    });
}

/**
 * Initializes the Text-to-Speech module.
 */
export function initTTS (sdkState, sdkHelpers)
{
    state = sdkState;
    helpers = sdkHelpers;

    if (ttsState.synth)
    {
        loadVoices();
        if (ttsState.synth.onvoiceschanged !== undefined)
        {
            ttsState.synth.onvoiceschanged = loadVoices;
        } else
        {
            console.warn("speechSynthesis.onvoiceschanged not supported, voices might load late.");
        }
    } else
    {
        console.warn("Web Speech API (speechSynthesis) not supported by this browser.");
    }
}


/**
 * Finds all translatable text nodes, fetches their translations, and updates the page.
 * @param {HTMLElement} translateButton - The button that triggered the translation.
 * @param {object} uiHelpers - Functions to control the UI loader { showLoaderOnSpeedDial, hideLoaderOnSpeedDial }.
 */
export async function translatePageElements (translateButton, uiHelpers)
{
    if (!state.selectedLang || state.selectedLang === 'en')
    {
        alert("Please select a target language other than English first.");
        return;
    }
    translateButton.disabled = true;
    uiHelpers.showLoaderOnSpeedDial();

    try
    {
        const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) =>
            {
                const parent = node.parentElement;
                if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.closest('[aria-hidden="true"]') || parent.offsetWidth === 0)
                {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const nodesToTranslate = [];
        while (treeWalker.nextNode()) nodesToTranslate.push(treeWalker.currentNode);

        if (state.originalTextNodes.size === 0)
        {
            nodesToTranslate.forEach(node => state.originalTextNodes.set(node, node.nodeValue));
        }

        const uniqueTexts = [...new Set(nodesToTranslate.map(n => n.nodeValue))];
        const batches = [];
        for (let i = 0; i < uniqueTexts.length; i += 50) batches.push(uniqueTexts.slice(i, i + 50));

        const results = await Promise.all(batches.map(batch => fetchPageTranslation(batch, state.selectedLang)));
        const allTranslations = results.reduce((acc, result) => ({ ...acc, ...result.translations }), {});
        nodesToTranslate.forEach(node =>
        {
            if (allTranslations[node.nodeValue]) node.nodeValue = allTranslations[node.nodeValue];
        });
    } catch (err)
    {
        console.error("Page translation failed:", err);
        alert("Sorry, the page could not be translated.");
    } finally
    {
        uiHelpers.hideLoaderOnSpeedDial();
        translateButton.disabled = false;
    }
}


/**
 * Checks if the browser supports the Web Speech API.
 * @returns {boolean}
 */
export function isSpeechSupported ()
{
    return !!ttsState.synth;
}

/**
 * Speaks the given text using the appropriate voice.
 * @param {string} text - The text to be spoken.
 * @param {string} currentSdkLang - The currently selected language from the SDK state.
 */
export function speak (text, currentSdkLang)
{
    if (!ttsState.synth || !text) return;
    if (ttsState.synth.speaking)
    {
        ttsState.synth.cancel();
    }

    const targetLang = currentSdkLang || document.documentElement.lang || navigator.language || "en-US";
    const normalizedTargetLang = targetLang.includes("-") ? `${targetLang.split("-")[0].toLowerCase()}-${targetLang.split("-")[1].toUpperCase()}` : targetLang.toLowerCase();
    const targetLangBase = normalizedTargetLang.split("-")[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = normalizedTargetLang;

    let bestVoice = null;
    if (ttsState.voicesLoaded && ttsState.voices.length > 0)
    {
        // Find the best matching voice
        bestVoice = ttsState.voices.find((v) => v.lang === normalizedTargetLang) ||
            ttsState.voices.find((v) => v.lang.startsWith(targetLangBase + "-")) ||
            ttsState.voices.find((v) => v.lang === targetLangBase);
    }

    if (bestVoice)
    {
        utterance.voice = bestVoice;
    }

    utterance.onerror = (event) =>
    {
        console.warn(`SpeechSynthesisUtterance Error for lang ${utterance.lang}:`, event.error);
    };

    try
    {
        ttsState.synth.speak(utterance);
    } catch (e)
    {
        console.warn("Failed to speak:", e);
    }
}

/**
 * Cancels any speech that is currently in progress.
 */
export function cancelSpeech ()
{
    if (ttsState.synth && ttsState.synth.speaking)
    {
        try
        {
            ttsState.synth.cancel();
        } catch (e)
        {
            console.warn("Error cancelling speech:", e);
        }
    }
}