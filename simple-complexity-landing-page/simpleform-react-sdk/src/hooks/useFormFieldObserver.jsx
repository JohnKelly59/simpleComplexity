// src/hooks/useFormFieldObserver.jsx
import { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import TooltipIcon from '../components/Tooltip/TooltipIcon';
import { SdkContext, useSdk } from '../context/SdkContext';

// Utility: find a stable label to show in aria-labels, fieldKey, etc.
const deriveFieldKey = (el) => {
  if (!el) return '';
  const id = el.getAttribute('id') || '';
  const name = el.getAttribute('name') || '';
  const placeholder = el.getAttribute('placeholder') || '';
  // Prefer associated <label for="...">
  if (id) {
    const label = el.ownerDocument?.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label?.textContent?.trim()) return label.textContent.trim();
  }
  // Fallbacks
  return (placeholder || name || id || '').trim();
};

// Injection marker to avoid duplicates
const INJECTED_ATTR = 'data-sf-tooltip-injected';

const useFormFieldObserver = (getContent, { root = document.body, selector } = {}) => {
  const observerRef = useRef(null);
  const portalMapRef = useRef(new Map()); // element -> {root, cleanup}
  const sdkContextValue = useSdk();
  const { tooltipsEnabled } = sdkContextValue;

  const injectForElement = useCallback((el) => {
      if (!(el instanceof HTMLElement) || el.hasAttribute(INJECTED_ATTR)) return;

      const host = document.createElement('span');
      host.style.display = 'inline-flex';
      host.style.alignItems = 'center';
      host.style.marginLeft = '4px';
      // Ensure the icon's container has a z-index to avoid being overlapped by sibling elements.
      host.style.zIndex = '1';

      // FIX: The placement target is now always the form field element itself (`el`).
      // This change prevents the icon from being misplaced when pages use "floating labels"
      // or other complex layouts, ensuring it doesn't disrupt the field's appearance.
      el.insertAdjacentElement('afterend', host);

      const reactRoot = ReactDOM.createRoot(host);
      const fieldKey = deriveFieldKey(el);

      reactRoot.render(
          <SdkContext.Provider value={sdkContextValue}>
              <TooltipIcon fieldKey={fieldKey} getContent={getContent} />
          </SdkContext.Provider>
      );

      el.setAttribute(INJECTED_ATTR, 'true');

      portalMapRef.current.set(el, {
          root: reactRoot,
          host,
          cleanup: () => {
              try {
                  setTimeout(() => reactRoot.unmount(), 0);
              } catch {}
              host.remove();
              el.removeAttribute(INJECTED_ATTR);
              portalMapRef.current.delete(el);
          },
      });
  }, [getContent, sdkContextValue]);

  const scanAndInject = useCallback(() => {
      const targetSelector = selector || 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';
      const nodes = Array.from(root.querySelectorAll(targetSelector));
      nodes.forEach(injectForElement);
      const keys = nodes.map(deriveFieldKey).filter(Boolean);
      return [...new Set(keys)];
  }, [root, selector, injectForElement]);

  useEffect(() => {
    if (tooltipsEnabled) {
      const targetSelector =
        selector || 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';

      scanAndInject();

      const obs = new MutationObserver((muts) => {
        for (const m of muts) {
          m.addedNodes?.forEach((n) => {
            if (n instanceof HTMLElement) {
              if (n.matches?.(targetSelector)) injectForElement(n);
              n.querySelectorAll?.(targetSelector).forEach(injectForElement);
            }
          });

          m.removedNodes?.forEach((n) => {
            if (!(n instanceof HTMLElement)) return;
            const tracked = Array.from(portalMapRef.current.keys()).filter((el) =>
              n.contains(el)
            );
            tracked.forEach((el) => portalMapRef.current.get(el)?.cleanup());
          });
        }
      });

      obs.observe(root, { subtree: true, childList: true, attributes: false });
      observerRef.current = obs;
    }

    return () => {
      observerRef.current?.disconnect?.();
      for (const { cleanup } of portalMapRef.current.values()) {
        cleanup();
      }
      portalMapRef.current.clear();
    };
  }, [root, selector, scanAndInject, injectForElement, tooltipsEnabled]);

  return { scanAndInject };
};

export default useFormFieldObserver;