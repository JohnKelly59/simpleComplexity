// language-panel.js

let state;
let helpers;
let panelRef = null;

const PANEL_ID = "sf-lang-panel";
const LANGUAGES_ENDPOINT = "http://localhost:8000/api/languages";

/**
 * Fetches the list of available languages from the API.
 * This function is now internal to this module.
 */
function fetchLanguages ()
{
    let url = LANGUAGES_ENDPOINT;
    if (state.selectedLang)
    {
        url += `?${new URLSearchParams({ language: state.selectedLang })}`;
    }
    return helpers.fetchWithAuth(url).then(async resp =>
    {
        if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
        const data = await resp.json();
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.languages)) return data.languages;
        throw new Error("Invalid format for languages response");
    }).catch(err =>
    {
        console.warn("Failed to fetch languages:", err);
        return [];
    });
}


/**
 * Toggles the visibility of the language selection panel.
 * @param {boolean} show - Whether to show or hide the panel.
 */
export function toggleLanguagePanel (show)
{
    if (!panelRef)
    {
        if (show)
        {
            panelRef = createLanguageSelectionPanel(); // Create on first show
        } else
        {
            return; // Nothing to hide
        }
    }

    const panel = panelRef.panel;
    const isVisible = panel.classList.contains("visible");

    if (show === isVisible) return;

    if (show)
    {
        panelRef.updateList();
        panel.style.display = "flex";
        requestAnimationFrame(() =>
        {
            panel.classList.add("visible");
        });
        // Close other panels
        if (helpers.isSupportChatOpen())
        {
            helpers.toggleSupportChatPanel(false);
        }
    } else
    {
        panel.classList.remove("visible");
        setTimeout(() =>
        {
            panel.style.display = "none";
        }, 250);
    }
}

/**
 * Checks if the language panel is currently visible.
 * @returns {boolean}
 */
export function isLanguagePanelOpen ()
{
    return panelRef?.panel.classList.contains("visible") || false;
}

/**
 * Initializes the language panel module.
 * @param {object} sdkState - The main state object from the SDK.
 * @param {object} sdkHelpers - An object containing helper functions.
 */
export function initLanguagePanel (sdkState, sdkHelpers)
{
    state = sdkState;
    helpers = sdkHelpers;
}

/**
 * (Internal) Creates the DOM elements and logic for the language panel.
 * @returns {object|null}
 */
function createLanguageSelectionPanel ()
{
    if (document.getElementById("simpleform-lang-host")) return null;

    const panelHost = document.createElement("div");
    panelHost.id = "simpleform-lang-host";
    document.body.appendChild(panelHost);

    const shadow = panelHost.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <style>
        #${PANEL_ID} {
            position: fixed; bottom: 95px; right: 25px; width: 330px; max-height: 480px; display: none;
            flex-direction: column; background: #ffffff; color: #212529; border-radius: 16px;
            box-shadow: 0 12px 30px rgba(0,0,0,0.12); font-family: system-ui, sans-serif;
            z-index: 2147483647; overflow: hidden; transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
            opacity: 0; transform: translateY(15px) scale(0.98);
        }
        #${PANEL_ID}.visible { display: flex; opacity: 1; transform: translateY(0) scale(1); }
        #${PANEL_ID} header { padding: 16px 20px; background-color: #f7f7f7; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
        #${PANEL_ID} h2 { margin: 0; font-size: 17px; font-weight: 600; }
        #${PANEL_ID} header button { background: transparent; border: none; cursor: pointer; color: #555; padding: 5px; border-radius: 50%; }
        #${PANEL_ID} header button:hover { background-color: rgba(0,0,0,0.05); }
        #sf-lang-list { flex: 1; overflow-y: auto; padding: 8px 0; margin: 0; list-style: none; }
        .sf-lang-item { padding: 12px 20px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
        .sf-lang-item:hover { background-color: #f9f9f9; }
        .sf-lang-item:last-child { border-bottom: none; }
        .sf-lang-item.selected { font-weight: 600; color: #116530; background-color: #f0f5f0; }
    </style>
    <section id="${PANEL_ID}">
        <header>
            <h2>Select Language</h2>
            <button id="sf-lang-close-btn" aria-label="Close language selection">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </header>
        <ul id="sf-lang-list"></ul>
    </section>`;

    const $panel = shadow.getElementById(PANEL_ID);
    const $list = shadow.getElementById("sf-lang-list");
    const $closeBtn = shadow.getElementById("sf-lang-close-btn");

    const updateList = () =>
    {
        $list.innerHTML = `<li class="sf-lang-item" style="cursor:default;color:#777;">Loading languages...</li>`;
        fetchLanguages().then((languages) =>
        {
            $list.innerHTML = "";
            if (!languages || languages.length === 0)
            {
                $list.innerHTML = `<li class="sf-lang-item" style="cursor:default;color:#777;">Could not load languages.</li>`;
                return;
            }
            const allOptions = [{ code: null, name: "Auto-detect Language" }, ...languages];
            allOptions.forEach(lang =>
            {
                const item = document.createElement("li");
                item.className = "sf-lang-item";
                item.textContent = lang.name;
                item.dataset.langCode = lang.code || "";
                if ((!state.selectedLang && !lang.code) || state.selectedLang === lang.code)
                {
                    item.classList.add("selected");
                }
                item.addEventListener("click", () =>
                {
                    const langCode = item.dataset.langCode;
                    state.selectedLang = langCode || null;
                    if (langCode) localStorage.setItem(helpers.LANGUAGE_STORAGE_KEY, langCode);
                    else localStorage.removeItem(helpers.LANGUAGE_STORAGE_KEY);
                    updateList();
                    setTimeout(() => toggleLanguagePanel(false), 200);
                });
                $list.appendChild(item);
            });
        });
    };

    $closeBtn.onclick = () => toggleLanguagePanel(false);

    return { panel: $panel, host: panelHost, updateList };
}