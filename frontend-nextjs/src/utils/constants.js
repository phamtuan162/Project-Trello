let apiRoot = "https://backend-expressjs-swart.vercel.app/api/v1";

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "https://backend-expressjs-swart.vercel.app/api/v1";
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://backend-expressjs-swart.vercel.app/api/v1";
}
export const API_ROOT = apiRoot;
