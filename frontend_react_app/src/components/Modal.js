import React, { useEffect, useRef } from "react";

/**
 * @param {{
 *  open: boolean,
 *  title: string,
 *  onClose: () => void,
 *  children: React.ReactNode
 * }} props
 */
// PUBLIC_INTERFACE
export function Modal({ open, title, onClose, children }) {
  /** Accessible modal with focus trap-ish behavior (focus first element). */
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    const prevActive = document.activeElement;

    // Focus the panel (or first focusable) for keyboard accessibility.
    setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
      else panel.focus();
    }, 0);

    return () => {
      document.body.classList.remove("modal-open");
      if (prevActive && prevActive.focus) prevActive.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-xl rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/5 dark:bg-slate-900 dark:text-white"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
