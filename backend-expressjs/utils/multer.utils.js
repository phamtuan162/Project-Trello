const multer = require("multer");
const { uploadFile: uploadConfig } = require("../config/uploadFile.config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.destination);
  },
  filename: function (req, file, cb) {
    cb(null, uploadConfig.name(file.mimetype));
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = uploadConfig.allowedTypes;
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Định dạng file không hợp lệ");
    error.status = 400;
    cb(error, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: uploadConfig.fileSize,
  },
});

module.exports = {
  multerMiddleware: (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "Lỗi từ Multer", message: err.message });
      } else if (err) {
        return res
          .status(400)
          .json({ error: "Lỗi xử lý file", message: err.message });
      }

      next();
    });
  },
};
