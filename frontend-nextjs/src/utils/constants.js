let apiRoot = "";

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://trello-api-0gbu.onrender.com";
}
export const API_ROOT = apiRoot;
