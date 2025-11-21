// src/api/api.js
const API_BASE_URL = "http://localhost:8000/api";
const QUESTION_LOOKUP_ENDPOINT = `${API_BASE_URL}/question-lookup`;
const BUSINESS_DETAILS_ENDPOINT = `${API_BASE_URL}/business`;
const SUPPORT_QUERY_ENDPOINT = `${API_BASE_URL}/support-query`;
const LANGUAGES_ENDPOINT = `${API_BASE_URL}/languages`;
const VIDEO_UPLOAD_ENDPOINT = `${API_BASE_URL}/video-upload`;
const TRANSLATE_PAGE_ENDPOINT = `${API_BASE_URL}/translate-page`;
const FORM_TRACKING_ENDPOINT = `${API_BASE_URL}/forms/submissions`; // Endpoint for form tracking
const TICKET_ENDPOINT = `${API_BASE_URL}/tickets`;

/**
 * A wrapper around the fetch API to add the Authorization header.
 */
const fetchWithAuth = async (apiKey, url, options = {}) =>
{
    const headers = {
        ...options.headers,
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok)
    {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
    }
    return response.json();
};

export const fetchBusinessDetails = (apiKey) =>
{
    return fetchWithAuth(apiKey, BUSINESS_DETAILS_ENDPOINT);
};

export const fetchTooltipsForKeys = (apiKey, keys = [], language = 'en') =>
{
    if (!Array.isArray(keys) || keys.length === 0) return Promise.resolve({});
    const uniqueKeys = [...new Set(keys)].filter(k => typeof k === "string" && k.trim() !== "");
    if (uniqueKeys.length === 0) return Promise.resolve({});

    return fetchWithAuth(apiKey, QUESTION_LOOKUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: uniqueKeys, language: language || null }),
    });
};

export const sendSupportQuery = (apiKey, question, context = "", language = 'en') =>
{
    if (typeof question !== "string" || !question.trim()) return Promise.resolve({ answer: "" });

    return fetchWithAuth(apiKey, SUPPORT_QUERY_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), context, language: language || null })
    });
};

export const fetchLanguages = (apiKey, language = 'en') =>
{
    let url = LANGUAGES_ENDPOINT;
    if (language)
    {
        url += `?${new URLSearchParams({ language })}`;
    }
    return fetchWithAuth(apiKey, url);
};

export const sendVideoRecording = (apiKey, videoBlob, filename, name, email, description) =>
{
    const formData = new FormData();
    formData.append('video', videoBlob, filename);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('description', description);

    return fetchWithAuth(apiKey, VIDEO_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
    });
};

export const createTicket = (apiKey, { name, email, description, video_id }) =>
{
    const payload = { name, email, description, video_id };

    return fetchWithAuth(apiKey, TICKET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
};

export const translatePage = (apiKey, texts, targetLanguage) =>
{
    return fetchWithAuth(apiKey, TRANSLATE_PAGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ texts, target_language: targetLanguage })
    });
};

/**
 * Tracks when a user first views a form. This corresponds to the 'viewed' status.
 * @param {string} apiKey - The API key for authentication.
 * @param {object} data - The data for the form view event.
 * @param {string} data.submissionId - A unique UUID for the form session.
 * @param {string} data.formIdentifier - A unique identifier for the form itself.
 * @param {string} data.openedAt - The ISO 8601 timestamp when the form was viewed.
 * @param {string} data.pageUrl - The URL of the page where the form is located.
 * @returns {Promise<any>} The response from the API.
 */
export const trackFormView = (apiKey, { submissionId, formIdentifier, openedAt, pageUrl }) =>
{
    const payload = {
        submissionId,
        status: 'viewed',
        formIdentifier,
        openedAt,
        pageUrl,
    };

    return fetchWithAuth(apiKey, FORM_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true // Ensures the request is sent even if the page is being closed.
    });
};

/**
 * Tracks when a user completes and submits a form. This corresponds to the 'completed' status.
 * @param {string} apiKey - The API key for authentication.
 * @param {object} data - The data for the form completion event.
 * @param {string} data.submissionId - The same UUID used when the form was viewed.
 * @param {string} data.submittedAt - The ISO 8601 timestamp when the form was submitted.
 * @param {number} data.durationMs - The time in milliseconds from view to submission.
 * @returns {Promise<any>} The response from the API.
 */
export const trackFormCompletion = (apiKey, { submissionId, submittedAt, durationMs }) =>
{
    const payload = {
        submissionId,
        status: 'completed',
        submittedAt,
        durationMs,
    };

    return fetchWithAuth(apiKey, FORM_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true // Important for submissions that trigger a page navigation.
    });
};