const buildMode = process.env.NEXT_PUBLIC_BUILD_MODE;

let apiRoot = "";
if (buildMode === "dev") {
  apiRoot = "http://localhost:3001";
} else if (buildMode === "production") {
  apiRoot = "https://backend-expressjs-swart.vercel.app";
}

export const API_ROOT = apiRoot;
