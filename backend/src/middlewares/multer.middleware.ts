import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/x-tex",
      "text/plain",
    ];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type"));
  },
});
