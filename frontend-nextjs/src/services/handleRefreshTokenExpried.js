import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const handleRefreshTokenExpired = () => {
  toast.error("Phiên đăng nhập hết hạn ");
  Cookies.set("isLogin", false);
  window.location.href = "/auth/login";
};
