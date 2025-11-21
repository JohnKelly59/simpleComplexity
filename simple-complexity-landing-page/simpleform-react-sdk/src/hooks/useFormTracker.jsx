// src/hooks/useFormTracker.jsx
import { useEffect, useCallback } from 'react';
import { useSdk } from '../context/SdkContext';
// UPDATED: Import the correct, specific functions from the API file.
import { trackFormView, trackFormCompletion } from '../api/api';

const useFormTracker = () => {
  const { apiKey } = useSdk();

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const getFormIdentifier = (form) => {
    if (form.id) return form.id;
    if (form.name) return form.name;
    const action = form.getAttribute('action');
    return action ? `form-action-${action}` : `form-on-${window.location.pathname}`;
  };

  // Runs in CAPTURE phase so it fires before the page's own submit/navigation.
  const handleFormSubmit = useCallback((event) => {
    const form = event.target;
    const trackingInfo = window.formTrackingData.get(form);
    if (!trackingInfo) return;

    const durationMs = Date.now() - trackingInfo.startTime;
    const payload = {
      submissionId: trackingInfo.submissionId,
      submittedAt: new Date().toISOString().split('.')[0] + 'Z',
      durationMs,
      formIdentifier: trackingInfo.formIdentifier,
      pageUrl: window.location.href,
      // UPDATED: Changed status to 'completed' to align with the API function name.
      status: 'completed',
    };

    // UPDATED: Call the specific trackFormCompletion function.
    // The `keepalive: true` option in the API function serves the "fire-and-forget" purpose.
    trackFormCompletion(apiKey, payload);
    // NOTE: we do NOT preventDefault; the user's form continues normally.
  }, [apiKey]);

  const setupFormTracking = useCallback((form) => {
    if (!(form instanceof HTMLFormElement) || window.formTrackingData.has(form)) return;

    window.intersectionObserver.observe(form);
    // capture + passive to avoid interfering with app handlers
    form.addEventListener('submit', handleFormSubmit, { capture: true, passive: true });
  }, [handleFormSubmit]);

  useEffect(() => {
    window.formTrackingData = new WeakMap();

    window.intersectionObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const form = entry.target;
        const submissionId = generateUUID();
        const startTime = Date.now();
        const formIdentifier = getFormIdentifier(form);

        window.formTrackingData.set(form, { submissionId, startTime, formIdentifier });

        const initialPayload = {
          submissionId,
          formIdentifier,
          status: 'viewed',
          openedAt: new Date(startTime).toISOString().split('.')[0] + 'Z',
          pageUrl: window.location.href,
        };
        // UPDATED: Call the specific trackFormView function.
        trackFormView(apiKey, initialPayload);
        obs.unobserve(form);
      });
    }, { threshold: 0.1 });

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.tagName === 'FORM') setupFormTracking(node);
          node.querySelectorAll?.('form')?.forEach(setupFormTracking);
        });
      }
    });

    document.querySelectorAll('form').forEach(setupFormTracking);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.intersectionObserver.disconnect();
      mutationObserver.disconnect();
      document.querySelectorAll('form').forEach(form => {
        form.removeEventListener('submit', handleFormSubmit, { capture: true });
      });
    };
  }, [apiKey, setupFormTracking, handleFormSubmit]);
};

export default useFormTracker;