import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const handleRefreshTokenExpired = () => {
  toast.error("Phiên đăng nhập hết hạn ", {
    onClose: () => {
      Cookies.remove("refresh_token");
      Cookies.remove("access_token");
      window.location.href = "/auth/login";
    },
  });
};
