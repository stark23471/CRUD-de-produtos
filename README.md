# CRUD de Produtos (Vanilla JS) — Projeto para Alunos

Projeto didático para ensinar **CRUD completo no Frontend** usando apenas:

- **HTML**
- **CSS**
- **JavaScript puro (sem frameworks e sem bibliotecas)**

O objetivo é construir uma interface **realista (“quase produção”)** com boas práticas, organização em camadas e experiência de usuário consistente.

---

## 🎯 O que o aluno vai aprender

Este projeto foi feito para treinar fundamentos essenciais que aparecem em qualquer app real:

- Consumo de API com **fetch + async/await**
- CRUD completo: **Create / Read / Update / Delete**
- Atualização do **DOM** após cada ação
- **Estado mínimo em memória** (`state.products`)
- **Validação de formulário** no frontend
- Tratamento de erros:
  - HTTP (4xx/5xx)
  - Rede / offline
  - Timeout
- Feedback visual de:
  - Loading
  - Sucesso
  - Erro
- Modal de edição com acessibilidade:
  - foco inicial
  - fechar com ESC
  - trap de tab

---

## 🌐 API pública usada (CRUD simulado)

Este projeto usa a API pública **DummyJSON**:

- `GET /products`
- `POST /products/add`
- `PUT /products/:id`
- `DELETE /products/:id`

⚠️ **Importante:**  
As operações de **Create / Update / Delete são simuladas** — ou seja, a API retorna respostas realistas, mas **não persiste os dados no servidor**.

✅ Mesmo assim, o frontend se comporta como um sistema real, usando **UI otimista** (atualiza a tela imediatamente e reverte se falhar).

---

## 📁 Estrutura do projeto

```txt
crud-de-produtos/
├─ index.html
├─ styles/
│  └─ main.css
└─ src/
   ├─ config.js
   ├─ state.js
   ├─ apiClient.js
   ├─ productService.js
   ├─ utils/
   │  └─ dom.js
   ├─ ui/
   │  ├─ notifications.js
   │  ├─ modal.js
   │  ├─ productsView.js
   │  └─ productForm.js
   └─ app.js
```

### Por que assim?
- `apiClient.js` → centraliza `fetch`, timeout e erros
- `productService.js` → CRUD de produtos (troca fácil da API no futuro)
- `ui/` → tudo que é DOM, modal, form, renderização
- `state.js` → estado mínimo em memória
- `config.js` → onde fica a `baseURL` (pensando no backend futuro em Node + MongoDB)

---

## ▶️ Como rodar

### Opção 1 (mais simples)
1. Baixe/clon​e o projeto
2. Abra o arquivo `index.html` no navegador

### Opção 2 (recomendado)
Usar um servidor local (evita problemas de `file://`):

- VSCode → extensão **Live Server**
- ou qualquer servidor simples

---

## ✨ Funcionalidades

- [x] Listagem de produtos (tabela ou cards)
- [x] Busca por título/marca/categoria
- [x] Criação via formulário
- [x] Edição via modal (formulário reutilizado)
- [x] Exclusão com confirmação
- [x] Feedback visual (loading, sucesso, erro)
- [x] Tratamento de erros HTTP/rede/timeout
- [x] Atualização imediata do DOM após cada ação
- [x] UI acessível (labels, foco no modal, ESC, trap de tab)
- [x] Código limpo e modular (sem frameworks)

---

## 🧠 Conceitos importantes do projeto

- `fetch` + `async/await`
- `res.ok` e tratamento de status HTTP
- separação de responsabilidades:
  - API Layer (`apiClient`)
  - Service Layer (`productService`)
  - UI Layer (`ui/*`)
  - State (`state.js`)
- renderização derivada do estado (`state.products`)
- UI otimista + rollback

---

## 🧪 Exercícios para alunos (iniciante)

1. Adicionar campo obrigatório **SKU** (mínimo 4 caracteres)
2. Criar botão **Limpar busca**
3. Mostrar contador:
   - total carregado
   - total filtrado
4. Melhorar validação:
   - título não pode ter só números
5. Adicionar loading por item:
   - ao excluir, desabilitar botões daquela linha/card

---

## 🚀 Desafios extras (intermediário)

1. Paginação real (`limit` + `skip`) com Próxima/Anterior
2. Trocar `confirm()` por um modal acessível de confirmação
3. Persistência opcional:
   - salvar `state.products` no `localStorage`
   - restaurar no load

---

## 🔁 Futuro (continuação do curso)

Este projeto foi planejado para futuramente trocar a API por um backend real:

- Node.js
- MongoDB Atlas

Quando isso acontecer, o aluno só precisará alterar:

- `src/config.js` (`baseURL`)
- `src/productService.js` (endpoints)

Sem refatorar o restante da UI.

---

## 👨‍🏫 Autor

Marcelo - Professor de Desenvolvimento Frontend.

Este repositório foi criado como um projeto didático para introduzir alunos aos fundamentos reais de CRUD no frontend, com uma arquitetura simples, código limpo e foco em boas práticas.

O projeto foi desenhado a partir de um prompt cuidadosamente elaborado para simular um cenário “quase produção”, garantindo uma experiência realista de UI, tratamento de erros e organização por responsabilidades, sem o uso de frameworks.

