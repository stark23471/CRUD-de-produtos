// File: src/ui/notifications.js
(function () {
  window.App = window.App || {};

  const { qs, escapeHtml } = App.dom;

  function showToast({ type = "info", title, message, timeoutMs = 4000 }) {
    const area = qs("#toastArea");

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;

    toast.innerHTML = `
      <div>
        <div class="toast__title">${escapeHtml(title || "Aviso")}</div>
        <p class="toast__msg">${escapeHtml(message || "")}</p>
      </div>
      <button class="btn btn--ghost toast__close" type="button" aria-label="Fechar mensagem">✕</button>
    `;

    const closeBtn = toast.querySelector("button");
    closeBtn.addEventListener("click", () => toast.remove());

    area.prepend(toast);

    if (timeoutMs > 0) {
      window.setTimeout(() => {
        if (toast.isConnected) toast.remove();
      }, timeoutMs);
    }
  }

  App.notify = {
    info(title, message) {
      showToast({ type: "info", title, message });
    },
    success(title, message) {
      showToast({ type: "ok", title, message });
    },
    error(title, message) {
      showToast({ type: "err", title, message, timeoutMs: 6500 });
    },
  };
})();
