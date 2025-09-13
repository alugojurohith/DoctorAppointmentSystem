// routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, getProfile ,updateProfile,bookAppointment, ListAppointments ,cancelAppointment,paymentRazorpay , verifyRazorpay} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js"; // Import auth middleware
import upload from "../utils/multer.js";


const userRouter = express.Router();

// Public routes
userRouter.post("/register", upload.single('image'), registerUser);
userRouter.post("/login", loginUser);

// Protected route to get user profile
userRouter.get("/profile", authUser, getProfile);
userRouter.post("/update-profile",upload.single('image'),authUser,updateProfile); // Protected route to update profile
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,ListAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)


export default userRouter;
