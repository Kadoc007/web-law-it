(function () {
  const defaultConfig = {
    baseUrl: "http://localhost:3000",
    timeoutMs: 4000
  };

  const config = {
    ...defaultConfig,
    ...(window.API_CONFIG || {})
  };

  function buildUrl(path, query) {
    const baseUrl = config.baseUrl.replace(/\/$/, "");
    const url = new URL(`${baseUrl}${path}`);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      });
    }

    return url.toString();
  }

  async function request(path, options = {}) {
    const {
      method = "GET",
      body,
      token,
      query
    } = options;

    const headers = {
      Accept: "application/json"
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), config.timeoutMs);

    let response;
    try {
      response = await fetch(buildUrl(path, query), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal
      });
    } catch (err) {
      const message = err.name === "AbortError"
        ? "Backend request timed out"
        : "Backend is unavailable";
      throw new Error(message);
    } finally {
      window.clearTimeout(timeoutId);
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = payload && payload.message ? payload.message : "API request failed";
      throw new Error(message);
    }

    return payload;
  }

  window.apiClient = {
    request,
    laws: {
      list(category) {
        return request(`/api/laws/${encodeURIComponent(category)}`);
      },
      get(category, id) {
        return request(`/api/laws/${encodeURIComponent(category)}/${encodeURIComponent(id)}`);
      },
      create(category, data, token) {
        return request(`/api/laws/${encodeURIComponent(category)}`, {
          method: "POST",
          body: data,
          token
        });
      },
      update(category, id, data, token) {
        return request(`/api/laws/${encodeURIComponent(category)}/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: data,
          token
        });
      },
      delete(category, id, token) {
        return request(`/api/laws/${encodeURIComponent(category)}/${encodeURIComponent(id)}`, {
          method: "DELETE",
          token
        });
      }
    },
    cards: {
      list(query) {
        return request("/api/cards", { query });
      },
      get(id) {
        return request(`/api/cards/${encodeURIComponent(id)}`);
      },
      getBySlug(slug) {
        return request(`/api/cards/slug/${encodeURIComponent(slug)}`);
      },
      create(data, token) {
        return request("/api/cards", {
          method: "POST",
          body: data,
          token
        });
      },
      update(id, data, token) {
        return request(`/api/cards/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: data,
          token
        });
      },
      delete(id, token) {
        return request(`/api/cards/${encodeURIComponent(id)}`, {
          method: "DELETE",
          token
        });
      }
    }
  };
})();
