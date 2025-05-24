import express from "express";
import upload from "../utils/multer.js";  // Correct path here
import { addDoctor } from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-doctor", upload.single("image"), addDoctor);

export default router;
