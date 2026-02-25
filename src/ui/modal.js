// File: src/ui/modal.js
// esse arquivo  
(function () {
  window.App = window.App || {};

 const { qs, qsa } = App.dom;

  const backdrop = () => qs("#modalBackdrop");
  const modal = () => qs("#modal");
  const body = () => qs("#modalBody");
  const title = () => qs("#modalTitle");
  const closeBtn = () => qs("#modalClose");
// armazena espaco
  let lastFocusedEl = null;

  function getFocusable(container) {
    return qsa(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
  }

  function trapTab(e) {
    if (e.key !== "Tab") return;

    const focusable = getFocusable(modal());
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    trapTab(e);
  }

  function open({ modalTitle, contentEl, initialFocusSelector = "input, select, textarea, button" }) {
    lastFocusedEl = document.activeElement;

    title().textContent = modalTitle || "Modal";
    body().innerHTML = "";
    body().appendChild(contentEl);

    backdrop().hidden = false;
    modal().hidden = false;

    document.addEventListener("keydown", onKeyDown);
    closeBtn().addEventListener("click", close, { once: true });
    backdrop().addEventListener("click", close, { once: true });

    // Foco inicial
    const focusTarget = body().querySelector(initialFocusSelector);
    if (focusTarget) focusTarget.focus();
    else closeBtn().focus();
  }

  function close() {
    modal().hidden = true;
    backdrop().hidden = true;
    body().innerHTML = "";

    document.removeEventListener("keydown", onKeyDown);

    if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
    lastFocusedEl = null;
  }

  App.modal = { open, close };
})();
