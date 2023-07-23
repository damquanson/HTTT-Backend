export const validateFiles = (files: Express.Multer.File[]) => {
  for (const file of files) {
    // Kiểm tra kích thước file
    if (file.size > 10 * 1024 * 1024) {
      return false; // Kích thước vượt quá 10MB
    }

    // Kiểm tra định dạng file
    if (
      file.mimetype !== 'image/png' && // Kiểm tra nếu không phải là file PNG
      !file.mimetype.startsWith('video/') // Kiểm tra nếu định dạng bắt đầu với 'video/'
    ) {
      return false; // File không phải là PNG và không phải là video
    }
  }

  return true; // Tất cả các file đều hợp lệ
};
