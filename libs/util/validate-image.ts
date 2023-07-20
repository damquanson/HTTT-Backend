export const validateFiles = (files: Express.Multer.File[]) => {
  for (const file of files) {
    // Kiểm tra kích thước file
    if (file.size > 10 * 1024 * 1024) {
      return false; // Kích thước vượt quá 10MB
    }

    // Kiểm tra định dạng file
    if (file.mimetype !== 'image/png') {
      return false; // Định dạng không phải là PNG
    }
  }

  return true; // Tất cả các file đều hợp lệ
};
