export const API_BASE_URL = "https://app.simple-complexity.com/api";
export const QUESTION_LOOKUP_ENDPOINT = `${API_BASE_URL}/question-lookup`;
export const SUPPORT_QUERY_ENDPOINT = `${API_BASE_URL}/support-query`;


// SVG Icons remain the same
export const SVG_SPEAKER = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>`;

export const SVG_LOADER = `
    <svg width="28" height="28" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style="display: block; margin: auto;">
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width="3">
                <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                </path>
            </g>
        </g>
    </svg>`;

export const SVG_SUPPORT_ICON = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="22" height="22"
     fill="currentColor">
  <!-- headset shell -->
  <path d="M12 1A10 10 0 0 0 2 11v3a2 2 0 0 0 2 2h2v-6H4v-1
           a8 8 0 0 1 16 0v1h-2v6h2a2 2 0 0 0 2-2v-3
           A10 10 0 0 0 12 1z"/>
  <!-- mic/earcup bars -->
  <path d="M7 13h2v4H7zm8 0h2v4h-2z"/>
</svg>`;

export const SVG_REFRESH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4C8.74 4 6 6.03 4.69 9h2.02a6.011 6.011 0 0 1 10.09-1.24l-1.81 1.81H20V4l-2.35 2.35zM6.35 17.65A7.95 7.95 0 0 0 12 20c3.26 0 6-2.03 7.31-5h-2.02a6.011 6.011 0 0 1-10.09 1.24l1.81-1.81H4v4l2.35-2.35z"/></svg>`;

export const SVG_HELP_ICON_PATH = `<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v2h-2zm0 4h2v4h-2z"/><path fill="none" d="M0 0h24v24H0z"/>`;

export const SVG_CHAT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
export const SVG_SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
export const SVG_CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

// Other constants remain the same
export const MAX_REFRESH_COUNT = 3;
export const REFRESH_COOLDOWN_MS = 5000; // 5 seconds
export const TEMP_TOOLTIP_MAX_SELECTION_LENGTH = 250;
export const TEMP_TOOLTIP_AUTOCLOSE_SUCCESS_MS = 15000; // 15 seconds
export const TEMP_TOOLTIP_AUTOCLOSE_ERROR_MS = 8000;    // 8 seconds
export const MUTATION_OBSERVER_DEBOUNCE_MS = 500;

// --- RE-ADD HOVER-BASED TIMER CONSTANTS ---
export const STANDARD_TOOLTIP_HIDE_DELAY_MS = 300;
export const EXTENDED_TOOLTIP_HIDE_DELAY_MS = 700;

export const FORM_FIELD_SELECTOR = 'form input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not(:disabled), form textarea:not(:disabled), form select:not(:disabled)';
export const DYNAMIC_FIELD_MATCH_SELECTOR = 'form input:not([type="hidden"]), form textarea, form select';