// File: src/app.js
(function () {
  window.App = window.App || {};

  const { qs } = App.dom;
  const { buildProductForm } = App.productForm;
  const { render } = App.productsView;
  const { listProducts, createProduct, updateProduct, deleteProduct } = App.productService;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    wireTopControls();
    mountCreateForm();
    await loadAndRender();
  }

  function wireTopControls() {
    qs("#btnReload").addEventListener("click", () => loadAndRender());
//change= mudanca target= alvo
    qs("#viewSelect").addEventListener("change", (e) => {console.log("evento completo:",e)
      App.state.set({ viewMode: e.target.value });
      rerender();
    });
//id="searchInput" linha 
    qs("#searchInput").addEventListener("input", (e) => {console.log("evento completo:",e)
      App.state.set({ searchTerm: e.target.value });
      rerender();
    });
  }

  function mountCreateForm() {
    const root = qs("#createFormRoot");

    const form = buildProductForm({
      initialValues: {},
      submitLabel: "Criar produto",
      busyLabel: "Criando…",
      onSubmit: handleCreate,
    });

    root.innerHTML = "";
    root.appendChild(form);
  }

  async function loadAndRender() {
    App.notify.info("Carregando", "Buscando produtos…");

    // Pequeno esqueleto visual
    App.state.replaceProducts([]);
    qs("#productsRoot").innerHTML = `<div class="skeleton" style="height:180px"></div>`;

    try {
      const { items } = await listProducts();
      App.state.replaceProducts(items);
      rerender();
      App.notify.success("Tudo certo", "Produtos carregados.");
    } catch (err) {
      App.notify.error("Erro ao carregar", err.message || "Falha inesperada.");
      qs("#productsRoot").innerHTML = `<p class="muted">Não foi possível carregar. Tente recarregar.</p>`;
    }
  }

  function rerender() {
    const { products, viewMode, searchTerm } = App.state.get();

    render({
      products,
      viewMode,
      searchTerm,
      onEdit: openEditModal,
      onDelete: handleDelete,
    });
  }

  // --------- CREATE (otimista) ----------
  async function handleCreate(input) {
    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      ...input,
    };

    // UI imediata
    const s = App.state.get();
    App.state.replaceProducts([optimistic, ...s.products]);
    rerender();

    try {
      const created = await createProduct(input);

      // Substitui temp pelo id real
      const next = App.state.get().products.map((p) => (p.id === tempId ? created : p));
      App.state.replaceProducts(next);
      rerender();

      App.notify.success("Criado", `Produto “${created.title}” criado (simulado).`);
    } catch (err) {
      // Reverte
      const next = App.state.get().products.filter((p) => p.id !== tempId);
      App.state.replaceProducts(next);
      rerender();

      App.notify.error("Falha ao criar", err.message || "Não foi possível criar.");
    }
  }

  // --------- UPDATE (modal + otimista) ----------
  function openEditModal(product) {
    const wrapper = document.createElement("div");

    const form = buildProductForm({
      initialValues: {
        title: product.title,
        price: product.price,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        description: product.description,
      },
      submitLabel: "Salvar alterações",
      busyLabel: "Salvando…",
      onCancel: () => App.modal.close(),
      onSubmit: async (patch) => {
        await handleUpdate(product, patch);
      },
    });

    wrapper.appendChild(form);

    App.modal.open({
      modalTitle: `Editar: ${product.title}`,
      contentEl: wrapper,
      initialFocusSelector: 'input[name="title"]',
    });
  }

  async function handleUpdate(original, patch) {
    // Snapshot para reverter
    const prev = App.state.get().products.slice();

    // Otimista: aplica no estado antes do HTTP
    const next = prev.map((p) => (String(p.id) === String(original.id) ? { ...p, ...patch } : p));
    App.state.replaceProducts(next);
    rerender();

    try {
      const updated = await updateProduct(original.id, patch);

      // Confirma com retorno do servidor (mesmo simulado)
      const confirmed = App.state.get().products.map((p) =>
        String(p.id) === String(original.id) ? { ...p, ...updated } : p
      );

      App.state.replaceProducts(confirmed);
      rerender();

      App.notify.success("Atualizado", `Produto “${updated.title}” atualizado (simulado).`);
      App.modal.close();
    } catch (err) {
      // Reverte
      App.state.replaceProducts(prev);
      rerender();

      App.notify.error("Falha ao atualizar", err.message || "Não foi possível salvar.");
    }
  }

  // --------- DELETE (confirmação + otimista) ----------
  async function handleDelete(product) {
    const ok = window.confirm(`Excluir “${product.title}”? Essa ação não pode ser desfeita.`);
    if (!ok) return;

    const prev = App.state.get().products.slice();

    // Otimista: remove já
    const next = prev.filter((p) => String(p.id) !== String(product.id));
    App.state.replaceProducts(next);
    rerender();

    try {
      await deleteProduct(product.id);
      App.notify.success("Excluído", `Produto “${product.title}” excluído (simulado).`);
    } catch (err) {
      // Reverte
      App.state.replaceProducts(prev);
      rerender();

      App.notify.error("Falha ao excluir", err.message || "Não foi possível excluir.");
    }
  }
})();
