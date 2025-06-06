import multer from "multer";
import fs from "fs";
import path from "path";

// Define uploads folder path relative to current working directory
const uploadDir = path.join(process.cwd(), "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // save files in uploads folder
  },
  filename: function (req, file, cb) {
    // Add timestamp prefix to avoid file name conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer upload instance with storage config
const upload = multer({ storage });

export default upload;
