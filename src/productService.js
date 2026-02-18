// File: src/productService.js
(function () {
  window.App = window.App || {};

  const { fetchJson } = App.apiClient;
  const { defaultListLimit } = App.config;

  // Camada de serviço: uma “API de produtos” para o resto do app.
  // Se trocar DummyJSON por Node/Mongo depois, você mexe aqui (e no config.baseURL).
  async function listProducts({ limit = defaultListLimit } = {}) {
    const data = await fetchJson(`/products?limit=${encodeURIComponent(limit)}`);
    return {
      items: data?.products || [],
      total: data?.total ?? (data?.products?.length ?? 0),
    };
  }

  async function createProduct(input) {
    // DummyJSON: POST /products/add
    return fetchJson(`/products/add`, { method: "POST", body: input });
  }

  async function updateProduct(id, patch) {
    return fetchJson(`/products/${encodeURIComponent(id)}`, { method: "PUT", body: patch });
  }

  async function deleteProduct(id) {
    return fetchJson(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  App.productService = { listProducts, createProduct, updateProduct, deleteProduct };
})();
