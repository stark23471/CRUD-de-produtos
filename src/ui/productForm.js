// File: src/ui/productForm.js
(function () {
  window.App = window.App || {};

  const { escapeHtml } = App.dom;

  function buildProductForm({ initialValues, submitLabel, onSubmit, onCancel, busyLabel = "Salvando…" }) {
    const values = {
      title: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      description: "",
      ...initialValues,
    };

    const root = document.createElement("form");
    root.noValidate = true;

    root.innerHTML = `
      <div class="form-grid">
        <div class="field">
          <label for="title">Título *</label>
          <input id="title" name="title" type="text" required minlength="3"
            value="${escapeHtml(values.title)}" />
          <div class="helper">Mínimo 3 caracteres.</div>
        </div>

        <div class="field">
          <label for="price">Preço (BRL) *</label>
          <input id="price" name="price" type="number" required min="0.01" step="0.01"
            value="${escapeHtml(values.price)}" />
        </div>

        <div class="field">
          <label for="category">Categoria *</label>
          <input id="category" name="category" type="text" required
            value="${escapeHtml(values.category)}" placeholder="ex: smartphones" />
        </div>

        <div class="field">
          <label for="brand">Marca</label>
          <input id="brand" name="brand" type="text"
            value="${escapeHtml(values.brand)}" placeholder="ex: Apple" />
        </div>

        <div class="field">
          <label for="stock">Estoque</label>
          <input id="stock" name="stock" type="number" min="0" step="1"
            value="${escapeHtml(values.stock)}" />
        </div>

        <div class="field span-2">
          <label for="description">Descrição</label>
          <textarea id="description" name="description" maxlength="500"
          >${escapeHtml(values.description)}</textarea>
          <div class="helper">Até 500 caracteres.</div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn--primary" type="submit">${escapeHtml(submitLabel || "Salvar")}</button>
        ${
          onCancel
            ? `<button class="btn btn--secondary" type="button" data-cancel>Cancelar</button>`
            : ""
        }
        <span class="helper" data-status></span>
      </div>
    `;

    const submitBtn = root.querySelector('button[type="submit"]');
    const statusEl = root.querySelector("[data-status]");
    const cancelBtn = root.querySelector("[data-cancel]");

    if (cancelBtn) cancelBtn.addEventListener("click", () => onCancel?.());

    root.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(root);
      const parsed = parseAndValidate(formData);

      clearInlineErrors(root);

      if (!parsed.ok) {
        showInlineErrors(root, parsed.errors);
        return;
      }

      setBusy(true);
      try {
        await onSubmit(parsed.value);
      } finally {
        setBusy(false);
      }
    });

    function setBusy(isBusy) {
      submitBtn.disabled = isBusy;
      if (cancelBtn) cancelBtn.disabled = isBusy;
      statusEl.textContent = isBusy ? busyLabel : "";
    }

    return root;
  }

  function parseAndValidate(formData) {
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const description = String(formData.get("description") || "").trim();

    const price = Number(formData.get("price"));
    const stockRaw = String(formData.get("stock") || "").trim();
    const stock = stockRaw === "" ? null : Number(stockRaw);

    const errors = {};

    if (title.length < 3) errors.title = "Título precisa ter pelo menos 3 caracteres.";
    if (!Number.isFinite(price) || price <= 0) errors.price = "Preço deve ser um número maior que 0.";
    if (!category) errors.category = "Categoria é obrigatória.";
    if (stock !== null && (!Number.isInteger(stock) || stock < 0)) {
      errors.stock = "Estoque deve ser um inteiro >= 0.";
    }

    const ok = Object.keys(errors).length === 0;

    return ok
      ? {
          ok: true,
          value: {
            title,
            price,
            category,
            brand: brand || undefined,
            stock: stock ?? undefined,
            description: description || undefined,
          },
        }
      : { ok: false, errors };
  }

  function clearInlineErrors(formEl) {
    formEl.querySelectorAll("[data-error]").forEach((el) => el.remove());
    formEl.querySelectorAll("[aria-invalid='true']").forEach((el) => el.removeAttribute("aria-invalid"));
  }

  function showInlineErrors(formEl, errors) {
    const firstKey = Object.keys(errors)[0];

    Object.entries(errors).forEach(([name, msg]) => {
      const input = formEl.querySelector(`[name="${name}"]`);
      if (!input) return;

      input.setAttribute("aria-invalid", "true");

      const p = document.createElement("p");
      p.className = "helper";
      p.style.color = "var(--danger)";
      p.dataset.error = "1";
      p.textContent = msg;

      input.insertAdjacentElement("afterend", p);
    });

    const first = firstKey ? formEl.querySelector(`[name="${firstKey}"]`) : null;
    if (first) first.focus();
  }

  App.productForm = { buildProductForm };
})();
