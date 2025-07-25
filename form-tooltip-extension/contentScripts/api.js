// contentScripts/api.js

import
{
    QUESTION_LOOKUP_ENDPOINT,
    SUPPORT_QUERY_ENDPOINT,
    VIDEO_UPLOAD_ENDPOINT
} from './config.js';

import
{
    state,
    incrementActiveFetches,
    decrementActiveFetches
} from './mainState.js';

import
{
    showLoaderOnSpeedDial,
    hideLoaderOnSpeedDial
} from './speedDial.js';
import { isSafari } from './utils.js';

/**
 *
 * @param {string}  url
 * @param {object=} options – fetch options
 * @returns {Promise<Response>}
 */
export function fetchWithAuth (url, options = {})
{
    return new Promise((resolve, reject) =>
    {
        if (!isSafari() && state.activeFetches === 0) showLoaderOnSpeedDial();
        incrementActiveFetches();

        browser.storage.sync.get(['authToken'], storageResult =>
        {
            if (browser.runtime.lastError)
            {
                decrementActiveFetches();
                if (!isSafari() && state.activeFetches === 0) hideLoaderOnSpeedDial();
                reject(
                    new Error(`Storage error: ${browser.runtime.lastError.message}`)
                );
                return;
            }

            const bearerToken =
                typeof storageResult.authToken === 'string' ?
                    storageResult.authToken :
                    storageResult.authToken?.token || '';

            const headers = {
                ...options.headers,
                ...(bearerToken && {
                    Authorization: `Bearer ${bearerToken}`
                })
            };

            fetch(url, {
                ...options,
                headers
            })
                .then(resolve)
                .catch(reject)
                .finally(() =>
                {
                    decrementActiveFetches();
                    if (!isSafari() && state.activeFetches === 0) hideLoaderOnSpeedDial();
                });
        });
    });
}

// ────────────────────────────────────────────────────────────────────────────
// 1️⃣ Tooltip lookup
// ────────────────────────────────────────────────────────────────────────────

/**
 * Look up tooltip definitions for multiple keys.
 * Returns an object: { "field label": "definition", … }
 *
 * @param {string[]} keys
 * @returns {Promise<object<string,string>>}
 */
export function fetchTooltipsForKeys (keys = [])
{
    if (!Array.isArray(keys) || keys.length === 0) return Promise.resolve({});

    const uniqueKeys = [...new Set(keys)].filter(
        k => typeof k === 'string' && k.trim() !== ''
    );
    if (uniqueKeys.length === 0) return Promise.resolve({});

    return fetchWithAuth(QUESTION_LOOKUP_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            keys: uniqueKeys
        })
    })
        .then(async resp =>
        {
            if (!resp.ok)
            {
                const text = await resp.text().catch(() => '');
                const msg = text ? `API error ${resp.status}: ${text}` :
                    `API error ${resp.status}`;
                throw new Error(msg);
            }
            return resp.json();
        })
        .catch(err =>
        {
            console.warn('Tooltip lookup failed:', err);
            return {};
        });
}

// ────────────────────────────────────────────────────────────────────────────
// 2️⃣ Support assistant query
// ────────────────────────────────────────────────────────────────────────────

/**
 * Send a free-form support question about the current page.
 *
 * @param {string} question - The user's typed question.
 * @param {string} context - The text content of the page.
 * @returns {Promise<string>} – answer text (empty string on failure)
 */
export function sendSupportQuery (question, context = '')
{
    if (typeof question !== 'string' || !question.trim()) return Promise.resolve('');

    const payload = {
        question: question.trim(),
        context: context
    };

    return fetchWithAuth(SUPPORT_QUERY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async resp =>
        {
            if (!resp.ok)
            {
                const text = await resp.text().catch(() => '');
                const msg = text ? `API error ${resp.status}: ${text}` :
                    `API error ${resp.status}`;
                throw new Error(msg);
            }
            const data = await resp.json();
            return typeof data?.answer === 'string' ? data.answer : '';
        })
        .catch(err =>
        {
            console.warn('Support query failed:', err);
            return '';
        });
}


// ────────────────────────────────────────────────────────────────────────────
// 3️⃣ Video Upload
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sends the recorded video to the backend.
 *
 * @param {Blob} videoBlob - The recorded video as a Blob.
 * @returns {Promise<object>}
 */
export function sendVideoRecording (videoBlob)
{
    console.log('[API] sendVideoRecording called.');
    // Safeguard against sending empty data
    if (!videoBlob || videoBlob.size === 0)
    {
        const error = new Error("Cannot send empty video file.");
        console.error('[API] Validation failed:', error);
        return Promise.reject(error);
    }

    console.log('[API] Video blob to be sent:', videoBlob);

    const formData = new FormData();
    formData.append('video', videoBlob, 'recording.webm');

    console.log('[API] FormData created:', formData);
    for (let [key, value] of formData.entries())
    {
        console.log(`[API] FormData entry: ${key}`, value);
    }


    return fetchWithAuth(VIDEO_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData
    })
        .then(async resp =>
        {
            if (!resp.ok)
            {
                const text = await resp.text().catch(() => '');
                const msg = text ? `API error ${resp.status}: ${text}` : `API error ${resp.status}`;
                throw new Error(msg);
            }
            return resp.json();
        })
        .catch(err =>
        {
            console.error('Video upload failed:', err);
            throw err;
        });
}