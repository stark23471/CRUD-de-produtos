// File: src/apiClient.js
(function () {
  window.App = window.App || {};

  const { baseURL, requestTimeoutMs } = App.config;

  class ApiError extends Error {
    constructor({ message, status, code, details }) {
      super(message);
      this.name = "ApiError";
      this.status = status ?? 0;
      this.code = code ?? "UNKNOWN";
      this.details = details ?? null;
    }
  }

  async function fetchJson(path, { method = "GET", body, headers = {} } = {}) {
    const controller = new AbortController();
    const id = window.setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const res = await fetch(baseURL + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      let payload = null;
      if (isJson) {
        payload = await res.json().catch(() => null);
      } else {
        payload = await res.text().catch(() => null);
      }

      if (!res.ok) {
        throw new ApiError({
          status: res.status,
          code: "HTTP_ERROR",
          message: friendlyHttpMessage(res.status, payload),
          details: payload,
        });
      }

      return payload;
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new ApiError({
          status: 0,
          code: "TIMEOUT",
          message: "Tempo esgotado. Verifique sua conexão e tente novamente.",
        });
      }

      if (err instanceof ApiError) throw err;

      // Rede (offline, DNS, CORS, etc.)
      throw new ApiError({
        status: 0,
        code: "NETWORK_ERROR",
        message: "Falha de rede. Confira sua internet e tente novamente.",
        details: String(err?.message || err),
      });
    } finally {
      window.clearTimeout(id);
    }
  }

  function friendlyHttpMessage(status, payload) {
    // Mensagens curtas, sem “stack trace”
    if (status >= 500) return "O servidor falhou ao processar. Tente novamente em instantes.";
    if (status === 404) return "Recurso não encontrado (404).";
    if (status === 401 || status === 403) return "Você não tem permissão para essa ação.";
    if (status === 400) {
      // Se a API mandar alguma msg, tenta aproveitar
      const msg = payload?.message || payload?.error;
      return msg ? `Dados inválidos: ${msg}` : "Dados inválidos (400). Verifique os campos.";
    }
    return `Erro HTTP (${status}).`;
  }

  App.apiClient = { fetchJson, ApiError };
})();
