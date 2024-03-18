// Import thư viện mime-types để xác định loại MIME của tệp
var mime = require("mime-types");

// Hàm tạo tên file duy nhất cho avatar
const generateAvatarName = (mimetype) => {
  // Tạo một phần tử đuôi file ngẫu nhiên để tránh trùng lặp
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  // Sử dụng thư viện mime-types để lấy phần mở rộng của loại MIME
  return `${uniqueSuffix}.${mime.extension(mimetype)}`;
};

// Xuất cấu hình cho quá trình tải lên avatar
module.exports = {
  uploadAvatar: {
    // Đường dẫn đích cho avatar tải lên
    destination: "public/images/avatars/uploads/",
    // Hàm tạo tên file cho avatar
    name: generateAvatarName,
    // Các loại tệp cho phép
    allowedTypes: ["image/jpeg", "image/png"],
    // Kích thước tệp tối đa (2MB)
    fileSize: 1024 * 1024 * 2,
  },
};
