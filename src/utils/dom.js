// File: src/utils/dom.js
(function () {
  window.App = window.App || {};

  function qs(sel, root = document) {
    const el = root.querySelector(sel);
    if (!el) throw new Error(`Elemento não encontrado: ${sel}`);
    return el;
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatMoneyBR(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function clampText(str, max = 140) {
    const s = String(str ?? "");
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
  }

  App.dom = { qs, qsa, escapeHtml, formatMoneyBR, clampText };
})();
