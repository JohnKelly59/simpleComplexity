// scripts/tts.js

/**
 * @file Manages Text-to-Speech (TTS) functionality using the Web Speech API.
 * It loads available voices and provides methods to speak text and cancel speech.
 */

const ttsState = {
    synth: window.speechSynthesis,
    voices: [],
    voicesLoaded: false,
};

/**
 * Loads available speech synthesis voices.
 * Sets `voicesLoaded` to true if voices are successfully retrieved.
 */
function loadVoices ()
{
    if (!ttsState.synth) return;

    try
    {
        ttsState.voices = ttsState.synth.getVoices();
        if (ttsState.voices.length > 0)
        {
            ttsState.voicesLoaded = true;
        } else
        {
            // Voices might not be immediately available, onvoiceschanged will handle it.
        }
    } catch (error)
    {
        console.warn("Error getting TTS voices:", error);
        ttsState.voices = [];
        ttsState.voicesLoaded = false;
    }
}

/**
 * Speaks the given text using the Web Speech API.
 * @param {string} text The text to speak.
 * @param {string|null} langHint A hint for the language of the text (e.g., 'en-US').
 * If null, it attempts to use document/browser language.
 */
export function speak (text, langHint = null)
{
    if (!ttsState.synth || !text) return;

    if (ttsState.synth.speaking)
    {
        ttsState.synth.cancel(); // Stop any ongoing speech
    }

    // Determine target language
    const targetLang = langHint || document.documentElement.lang || navigator.language || 'en-US';
    const normalizedTargetLang = targetLang.includes('-')
        ? `${targetLang.split('-')[0].toLowerCase()}-${targetLang.split('-')[1].toUpperCase()}`
        : targetLang.toLowerCase();
    const targetLangBase = normalizedTargetLang.split('-')[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = normalizedTargetLang;

    let bestVoice = null;

    if (ttsState.voicesLoaded && ttsState.voices.length > 0)
    {
        bestVoice = ttsState.voices.find(v => v.lang === normalizedTargetLang);
        if (!bestVoice)
        {
            bestVoice = ttsState.voices.find(v => v.lang.startsWith(targetLangBase + '-'));
        }
        if (!bestVoice)
        {
            bestVoice = ttsState.voices.find(v => v.lang === targetLangBase);
        }
    } else if (!ttsState.voicesLoaded)
    {
        // Attempt to load voices if they weren't loaded, then try to find a voice.
        loadVoices();
        if (ttsState.voicesLoaded && ttsState.voices.length > 0)
        {
            bestVoice = ttsState.voices.find(v => v.lang === normalizedTargetLang) ||
                ttsState.voices.find(v => v.lang.startsWith(targetLangBase + '-')) ||
                ttsState.voices.find(v => v.lang === targetLangBase);
        }
    }

    if (bestVoice)
    {
        utterance.voice = bestVoice;
    } else if (ttsState.voices.length > 0)
    {
        // console.warn(`No specific voice found for lang ${normalizedTargetLang}. Using default.`);
    } else
    {
        // console.warn("No TTS voices loaded. Speech will use browser default if available.");
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
 * Cancels any ongoing speech synthesis.
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

/**
 * Initializes the TTS module.
 * Loads voices and sets up an event listener for voice changes.
 */
export function initTTS ()
{
    if (ttsState.synth)
    {
        loadVoices(); // Initial attempt to load voices

        // Browsers load voices asynchronously.
        // The 'voiceschanged' event fires when the list of SpeechSynthesisVoice objects has changed.
        if (ttsState.synth.onvoiceschanged !== undefined)
        {
            ttsState.synth.onvoiceschanged = loadVoices;
        } else
        {
            // Fallback for browsers not supporting onvoiceschanged (less common now)
            // Voices might be loaded with a delay or only after first getVoices() call.
            console.warn("speechSynthesis.onvoiceschanged not supported, voices might load late or require manual re-check.");
        }
    } else
    {
        console.warn("Web Speech API (speechSynthesis) not supported by this browser.");
    }
}

export function isSpeechSupported ()
{
    return !!ttsState.synth;
}