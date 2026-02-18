// File: src/ui/productsView.js
(function () {
  window.App = window.App || {};

  const { qs, escapeHtml, formatMoneyBR, clampText } = App.dom;

  function render({ products, viewMode, searchTerm, onEdit, onDelete }) {
    const root = qs("#productsRoot");

    const filtered = filterProducts(products, searchTerm);

    qs("#resultsMeta").textContent = `${filtered.length} item(ns) exibidos`;

    if (!products || products.length === 0) {
      root.innerHTML = `<div class="skeleton" style="height:120px"></div>`;
      return;
    }

    if (filtered.length === 0) {
      root.innerHTML = `<p class="muted">Nenhum produto encontrado para essa busca.</p>`;
      return;
    }

    if (viewMode === "cards") {
      root.innerHTML = renderCards(filtered);
      bindCardActions(root, filtered, onEdit, onDelete);
      return;
    }

    root.innerHTML = renderTable(filtered);
    bindTableActions(root, filtered, onEdit, onDelete);
  }

  function filterProducts(products, term) {
    const q = String(term || "").trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const hay = `${p.title || ""} ${p.brand || ""} ${p.category || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderTable(items) {
    const rows = items
      .map((p) => {
        return `
          <tr>
            <td>
              <div style="font-weight:800">${escapeHtml(p.title || "—")}</div>
              <div class="muted">${escapeHtml(p.brand || "—")}</div>
            </td>
            <td><span class="pill">${escapeHtml(p.category || "—")}</span></td>
            <td>${escapeHtml(formatMoneyBR(p.price))}</td>
            <td>${escapeHtml(p.stock ?? "—")}</td>
            <td class="row-actions">
              <button class="btn btn--secondary" type="button" data-edit="${escapeHtml(p.id)}">Editar</button>
              <button class="btn btn--danger" type="button" data-del="${escapeHtml(p.id)}">Excluir</button>
            </td>
          </tr>
        `;
      })
      .join("");

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderCards(items) {
    const cards = items
      .map((p) => {
        return `
          <article class="card">
            <div class="card__title">${escapeHtml(p.title || "—")}</div>
            <div class="muted">${escapeHtml(p.brand || "—")}</div>

            <div class="card__meta">
              <span class="pill">${escapeHtml(p.category || "—")}</span>
              <span class="pill">${escapeHtml(formatMoneyBR(p.price))}</span>
              <span class="pill">Estoque: ${escapeHtml(p.stock ?? "—")}</span>
            </div>

            <div class="card__desc">${escapeHtml(clampText(p.description || "Sem descrição.", 140))}</div>

            <div class="form-actions" style="margin-top:12px">
              <button class="btn btn--secondary" type="button" data-edit="${escapeHtml(p.id)}">Editar</button>
              <button class="btn btn--danger" type="button" data-del="${escapeHtml(p.id)}">Excluir</button>
            </div>
          </article>
        `;
      })
      .join("");

    return `<div class="cards">${cards}</div>`;
  }

  function bindTableActions(root, items, onEdit, onDelete) {
    root.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit");
        const product = items.find((p) => String(p.id) === String(id));
        if (product) onEdit(product);
      });
    });

    root.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del");
        const product = items.find((p) => String(p.id) === String(id));
        if (product) onDelete(product);
      });
    });
  }

  function bindCardActions(root, items, onEdit, onDelete) {
    bindTableActions(root, items, onEdit, onDelete);
  }

  App.productsView = { render };
})();
