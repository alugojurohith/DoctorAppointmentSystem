// routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, getProfile ,updateProfile} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js"; // Import auth middleware
import upload from "../utils/multer.js";


const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected route to get user profile
userRouter.get("/profile", authUser, getProfile);
userRouter.post("/update-profile",upload.single('image'),authUser,updateProfile); // Protected route to update profile

export default userRouter;
