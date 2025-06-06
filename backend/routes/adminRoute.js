import express from "express";
import upload from "../utils/multer.js";  // Correct path here
import { addDoctor,loginAdmin} from "../controllers/adminController.js";
import authAdmin from '../middleware/authAdmin.js';
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin,upload.single("image"), addDoctor);
adminRouter.post("/login",loginAdmin);
export default adminRouter;
