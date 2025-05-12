// scripts/api.js
import { QUESTION_LOOKUP_ENDPOINT } from './config.js';
import { state, incrementActiveFetches, decrementActiveFetches } from './mainState.js';
import { showLoaderOnSpeedDial, hideLoaderOnSpeedDial } from './speedDial.js';

/**
 * @file Handles API interactions for fetching tooltip data.
 * Includes authentication and loading indicators.
 */

/**
 * Fetches data from the specified URL with an Authorization header.
 * Manages a global loading indicator via the speedDial module.
 * @param {string} url The URL to fetch.
 * @param {object} options Fetch options (method, headers, body, etc.).
 * @returns {Promise<Response>} A promise that resolves with the Fetch API Response object.
 */
function fetchWithAuth (url, options = {})
{
    return new Promise((resolve, reject) =>
    {
        if (state.activeFetches === 0)
        {
            showLoaderOnSpeedDial();
        }
        incrementActiveFetches();

        chrome.storage.sync.get(["authToken"], (storageResult) =>
        {
            if (chrome.runtime.lastError)
            {
                decrementActiveFetches();
                if (state.activeFetches === 0) hideLoaderOnSpeedDial();
                reject(new Error(`Storage error: ${chrome.runtime.lastError.message}`));
                return;
            }

            const bearerToken =
                typeof storageResult.authToken === "string"
                    ? storageResult.authToken
                    : storageResult.authToken?.token || ""; // Handle potential object structure

            const headers = {
                ...options.headers,
                Authorization: `Bearer ${bearerToken}`,
            };

            fetch(url, { ...options, headers })
                .then(resolve)
                .catch(reject)
                .finally(() =>
                {
                    decrementActiveFetches();
                    if (state.activeFetches === 0)
                    {
                        hideLoaderOnSpeedDial();
                    }
                });
        });
    });
}

/**
 * Fetches tooltip definitions for a given array of keys.
 * @param {string[]} keys An array of keys (field labels/names) to look up.
 * @returns {Promise<object>} A promise that resolves to an object mapping keys to tooltip strings.
 * Returns an empty object on failure or if no keys are provided.
 */
export function fetchTooltipsForKeys (keys = [])
{
    if (!Array.isArray(keys) || keys.length === 0)
    {
        return Promise.resolve({});
    }

    // Filter out empty or non-string keys and ensure uniqueness
    const uniqueKeys = [...new Set(keys)].filter(k => typeof k === 'string' && k.trim() !== '');
    if (uniqueKeys.length === 0)
    {
        return Promise.resolve({});
    }

    return fetchWithAuth(QUESTION_LOOKUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: uniqueKeys }),
    })
        .then((resp) =>
        {
            if (!resp.ok)
            {
                // Attempt to read error text for better debugging
                return resp.text().then(text =>
                {
                    console.warn("Tooltip fetch failed:", resp.status, text);
                    throw new Error(`API error ${resp.status}: ${text}`); // Propagate error
                }).catch(() =>
                {
                    console.warn("Tooltip fetch failed with status:", resp.status, "and no text body.");
                    throw new Error(`API error ${resp.status}`); // Propagate error
                });
            }
            return resp.json();
        })
        .catch((err) =>
        {
            console.log("Network error or API error fetching tooltips:", err);
            return {}; // Return empty object on error as per original logic
        });
}