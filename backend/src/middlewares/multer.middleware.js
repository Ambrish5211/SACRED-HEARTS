import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use absolute path so req.files[0].path is always absolute,
// regardless of what CWD the server or worker is started from
const TEMP_DIR = resolve(__dirname, "../../public/temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });