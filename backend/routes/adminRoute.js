import express from "express";
import upload from "../utils/multer.js";
import {
  addDoctor,
  allDoctors,
  loginAdmin
} from "../controllers/adminController.js";
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Add a new doctor with image upload (protected route)
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

// ✅ FIXED: Changed from POST to GET for correct route matching
adminRouter.get("/all-doctors", authAdmin, allDoctors);

// Change doctor availability (protected route)
adminRouter.post("/change-availability", authAdmin, changeAvailability);

export default adminRouter;
