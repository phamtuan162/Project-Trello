const buildMode = process.env.NEXT_PUBLIC_BUILD_MODE;

let apiRoot = "";
if (buildMode === "dev") {
  apiRoot = "https://promanage-api.onrender.com";
} else if (buildMode === "production") {
  apiRoot = "https://promanage-api.onrender.com";
}

export const API_ROOT = apiRoot;
