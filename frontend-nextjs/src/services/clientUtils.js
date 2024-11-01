export const client = {
  serverApi: "https://backend-expressjs-swart.vercel.app/api/v1",
  setUrl: function (url) {
    this.serverApi = url;
  },
  send: async function (url, method = "GET", body = null, access_token = null) {
    url = `${this.serverApi}${url}`;

    const headers = {
      "Content-Type": "application/json",
    };

    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);

    const data = await response.json();
    return { response, data };
  },
  get: function (url, access_token = null) {
    return this.send(url, "GET", null, access_token);
  },
  post: function (url, body = {}, access_token = null) {
    return this.send(url, "POST", body, access_token);
  },
  put: function (url, body = {}, access_token = null) {
    return this.send(url, "PUT", body, access_token);
  },
  patch: function (url, body = {}, access_token = null) {
    return this.send(url, "PATCH", body, access_token);
  },
  delete: function (url, access_token = null) {
    return this.send(url, "DELETE", null, access_token);
  },
};
