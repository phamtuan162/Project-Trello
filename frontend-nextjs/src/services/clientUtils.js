export const client = {
  serverApi: "https://backend-expressjs-swart.vercel.app/api/v1",
  setUrl: function (url) {
    this.serverApi = url;
  },
  send: async function (url, method = "GET", body = null, apiKey = null) {
    url = `${this.serverApi}${url}`;

    const headers = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["X-Api-Key"] = apiKey;
    }
    const options = {
      method,
      headers,
      mode: "no-cors",
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);

    const data = await response.json();
    return { response, data };
  },
  get: function (url, apiKey = null) {
    return this.send(url, "GET", null, apiKey);
  },
  post: function (url, body = {}, apiKey = null) {
    return this.send(url, "POST", body, apiKey);
  },
  put: function (url, body = {}, apiKey = null) {
    return this.send(url, "PUT", body, apiKey);
  },
  patch: function (url, body = {}, apiKey = null) {
    return this.send(url, "PATCH", body, apiKey);
  },
  delete: function (url, apiKey = null) {
    return this.send(url, "DELETE", null, apiKey);
  },
};
