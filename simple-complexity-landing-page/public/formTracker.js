const formTrackerModule = (() =>
{
    // The endpoint is set to the correct URL.
    const FORM_TRACKING_ENDPOINT = `${API_BASE_URL}/forms/submissions`;

    const formTrackingData = new Map();

    const getFormIdentifier = (form) =>
    {
        if (form.id) return form.id;
        if (form.name) return form.name;
        const action = form.getAttribute('action');
        return action ? `form-action-${action}` : `form-on-${window.location.pathname}`;
    };

    const sendTrackingData = (payload) =>
    {
        if (!FORM_TRACKING_ENDPOINT)
        {
            console.warn('Form Tracker: Endpoint is not configured.');
            return;
        }
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(FORM_TRACKING_ENDPOINT, blob);
    };

    const handleFormSubmit = (event) =>
    {
        const form = event.target;
        const identifier = getFormIdentifier(form);
        const trackingInfo = formTrackingData.get(form);
        const startTime = trackingInfo ? trackingInfo.startTime : Date.now();
        const durationMs = Date.now() - startTime;

        const payload = {
            formIdentifier: identifier,
            openedAt: new Date(startTime).toISOString(),
            submittedAt: new Date().toISOString(),
            durationMs: durationMs,
            completed: true,
            pageUrl: window.location.href
        };

        sendTrackingData(payload);
    };

    const setupFormTracking = (form) =>
    {
        if (formTrackingData.has(form)) return;
        const observer = new IntersectionObserver((entries, obs) =>
        {
            entries.forEach(entry =>
            {
                if (entry.isIntersecting)
                {
                    formTrackingData.set(form, { startTime: Date.now() });
                    obs.unobserve(form);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(form);
        form.addEventListener('submit', handleFormSubmit);
    };

    const initializeTrackerInternal = () =>
    {
        document.querySelectorAll('form').forEach(setupFormTracking);
        const mutationObserver = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                mutation.addedNodes.forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE)
                    {
                        if (node.tagName === 'FORM') setupFormTracking(node);
                        node.querySelectorAll('form').forEach(setupFormTracking);
                    }
                });
            });
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
    };

    const init = () =>
    {
        console.log(`SimpleForm SDK: Form tracking enabled. Sending data to ${FORM_TRACKING_ENDPOINT}`);
        initializeTrackerInternal();
    };

    return {
        init
    };
})();