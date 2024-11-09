export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must at least 1 letter, a number, and at least 8 characters";

export const LIMIT_COMMON_FILE_SIZE = 10485760; //10MB
export const ALLOW_COMMON_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return "File cannot be blank";
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return "Maximum file size exceeded. (10MB)";
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return "File type is invalid. Only accept jpg, jpeg and png";
  }

  return null;
};
