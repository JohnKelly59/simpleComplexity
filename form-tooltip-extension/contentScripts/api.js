// ────────────────────────────────────────────────────────────────────────────
// scripts/api.js
// Handles all network-calls for the extension (tooltips + support assistant)
// ────────────────────────────────────────────────────────────────────────────

import
    {
        QUESTION_LOOKUP_ENDPOINT,
        SUPPORT_QUERY_ENDPOINT
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

/**
 * Generic fetch helper that:
 *   • adds the stored Bearer token (if any)
 *   • shows a loader while in-flight
 *   • keeps a global active-fetch counter
 *
 * @param {string}  url
 * @param {object=} options – fetch options
 * @returns {Promise<Response>}
 */
function fetchWithAuth (url, options = {})
{
    return new Promise((resolve, reject) =>
    {
        // kick-off loader
        if (state.activeFetches === 0) showLoaderOnSpeedDial();
        incrementActiveFetches();

        // grab token (may not exist for open APIs)
        chrome.storage.sync.get(['authToken'], storageResult =>
        {
            if (chrome.runtime.lastError)
            {
                decrementActiveFetches();
                if (state.activeFetches === 0) hideLoaderOnSpeedDial();
                reject(
                    new Error(`Storage error: ${chrome.runtime.lastError.message}`)
                );
                return;
            }

            const bearerToken =
                typeof storageResult.authToken === 'string'
                    ? storageResult.authToken
                    : storageResult.authToken?.token || '';

            const headers = {
                ...options.headers,
                ...(bearerToken && { Authorization: `Bearer ${bearerToken}` })
            };

            fetch(url, { ...options, headers })
                .then(resolve)
                .catch(reject)
                .finally(() =>
                {
                    decrementActiveFetches();
                    if (state.activeFetches === 0) hideLoaderOnSpeedDial();
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

    // dedupe + sanitise
    const uniqueKeys = [...new Set(keys)].filter(
        k => typeof k === 'string' && k.trim() !== ''
    );
    if (uniqueKeys.length === 0) return Promise.resolve({});

    return fetchWithAuth(QUESTION_LOOKUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: uniqueKeys })
    })
        .then(async resp =>
        {
            if (!resp.ok)
            {
                const text = await resp.text().catch(() => '');
                const msg = text ? `API error ${resp.status}: ${text}`
                    : `API error ${resp.status}`;
                throw new Error(msg);
            }
            return resp.json();
        })
        .catch(err =>
        {
            console.warn('Tooltip lookup failed:', err);
            return {};                 // graceful fallback
        });
}

// ────────────────────────────────────────────────────────────────────────────
// 2️⃣ Support assistant query
// ────────────────────────────────────────────────────────────────────────────

/**
 * Send a free-form support question about the current page.
 *
 * @param {string} question
 * @returns {Promise<string>} – answer text (empty string on failure)
 */
export function sendSupportQuery (question)
{
    if (typeof question !== 'string' || !question.trim()) return Promise.resolve('');

    const payload = {
        question: question.trim(),
        page: window.location.href      // give backend page-context
    };

    return fetchWithAuth(SUPPORT_QUERY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(async resp =>
        {
            if (!resp.ok)
            {
                const text = await resp.text().catch(() => '');
                const msg = text ? `API error ${resp.status}: ${text}`
                    : `API error ${resp.status}`;
                throw new Error(msg);
            }
            // expected shape: { answer: "…" }
            const data = await resp.json();
            return typeof data?.answer === 'string' ? data.answer : '';
        })
        .catch(err =>
        {
            console.warn('Support query failed:', err);
            return '';                  // let UI handle empty answer
        });
}
