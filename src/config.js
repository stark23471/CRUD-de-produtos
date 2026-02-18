// File: src/config.js
(function () {
  window.App = window.App || {};

  App.config = {
    // Trocar isso no futuro (Node + MongoDB) deve ser só editar aqui.
    baseURL: "https://dummyjson.com",
    requestTimeoutMs: 9000,
    defaultListLimit: 30,
  };
})();
