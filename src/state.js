// File: src/state.js
(function () {
  window.App = window.App || {};

  const state = {
    products: [],
    viewMode: "table",
    searchTerm: "",
  };

  App.state = {
    get() {
      return state;
    },
    set(partial) {
      Object.assign(state, partial);
    },
    replaceProducts(next) {
      state.products = Array.isArray(next) ? next : [];
    },
  };
})();
