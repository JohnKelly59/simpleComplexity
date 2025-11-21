// src/services/ttsService.js
import { translatePage } from '../api/api';

const ttsState = {
    synth: window.speechSynthesis,
    voices: [],
    voicesLoaded: false
};

async function fetchPageTranslation (apiKey, texts, targetLanguage)
{
    // Batch requests to the API in chunks of 50 to avoid large payloads
    const batches = [];
    for (let i = 0; i < texts.length; i += 50)
    {
        batches.push(texts.slice(i, i + 50));
    }

    const results = await Promise.all(
        batches.map(batch => translatePage(apiKey, batch, targetLanguage))
    );

    // Combine the results from all batches
    return results.reduce((acc, result) => ({ ...acc, ...result.translations }), {});
}


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
    }
}

export function initTTS ()
{
    if (ttsState.synth)
    {
        loadVoices();
        if (ttsState.synth.onvoiceschanged !== undefined)
        {
            ttsState.synth.onvoiceschanged = loadVoices;
        }
    } else
    {
        console.warn("Web Speech API (speechSynthesis) not supported.");
    }
}

export function isSpeechSupported ()
{
    return !!ttsState.synth;
}

export function speak (text, lang)
{
    if (!ttsState.synth || !text) return;
    if (ttsState.synth.speaking)
    {
        ttsState.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang || 'en-US';
    utterance.lang = targetLang;

    const bestVoice = ttsState.voices.find(v => v.lang === targetLang) || ttsState.voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    if (bestVoice)
    {
        utterance.voice = bestVoice;
    }

    ttsState.synth.speak(utterance);
}

export function cancelSpeech ()
{
    if (ttsState.synth?.speaking)
    {
        ttsState.synth.cancel();
    }
}

export async function translatePageElements (apiKey, targetLang, originalNodesMap, setOriginalNodesMap)
{
    if (!targetLang || targetLang === 'en')
    {
        alert("Please select a language to translate to.");
        return;
    }

    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
        {
            const parent = node.parentElement;
            if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.closest('#simpleform-sdk-root'))
            {
                return NodeFilter.FILTER_REJECT;
            }
            // **IMPROVED FILTERING**
            // Trim the text and check if it's empty or just a symbol.
            const text = node.nodeValue.trim();
            if (text === '' || !/[a-zA-Z0-9]/.test(text))
            {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const nodesToTranslate = [];
    while (treeWalker.nextNode()) nodesToTranslate.push(treeWalker.currentNode);

    if (originalNodesMap.size === 0)
    {
        const newOriginals = new Map();
        nodesToTranslate.forEach(node => newOriginals.set(node, node.nodeValue));
        setOriginalNodesMap(newOriginals);
    }

    // **Final check to ensure all texts are valid strings before sending**
    const uniqueTexts = [...new Set(nodesToTranslate.map(n => n.nodeValue.trim()))].filter(String);
    if (uniqueTexts.length === 0) return; // Nothing to translate

    const translations = await fetchPageTranslation(apiKey, uniqueTexts, targetLang);

    nodesToTranslate.forEach(node =>
    {
        const originalText = (originalNodesMap.get(node) || node.nodeValue).trim();
        if (translations[originalText])
        {
            node.nodeValue = translations[originalText];
        }
    });
}