import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';


// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let imageURL = "";
    // Check for image file and upload to Cloudinary if present
    if (req.file) {
      const imageupload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image"
      });
      imageURL = imageupload.secure_url;
    }
    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a strong password (min 8 characters)" });
    }
    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create and save new user
    const newUser = new userModel({ name, email, password: hashedPassword, image: imageURL });
    await newUser.save();
    // Generate token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ comes from authUser.js middleware
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//API TO UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const { name, phone, dob, gender } = req.body;
    const imageFile = req.file;
    
    if (!gender || !name || !phone || !dob) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }
    
    // Update user profile
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender
    });
    
    // Handle image upload if provided
    if (imageFile) {
      const imageupload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      const imageURL = imageupload.secure_url;
      await userModel.findByIdAndUpdate(userId, {
        image: imageURL
      });
    }
    
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//api to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;
    
    const docData=await doctorModel.findById(docId).select("-password");
    
    if(!docData){
      return res.status(404).json({success:false,message:"Doctor not found"})
    }
    
    if(!docData.available){
      return res.json({success:false,message:"Doctor is not available"})
    }

    const userData=await userModel.findById(userId).select("-password");
    
    if(!userData){
      return res.status(404).json({success:false,message:"User not found"})
    }

    const appointmentsData={
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date:Date.now()
    }

    const newAppointment =new appointmentModel(appointmentsData)
    await newAppointment.save()

    res.json({success:true,message:"appointment booked"})

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

//api to get user appointment for frontend my-appointments page
const ListAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser, loginUser ,getProfile, updateProfile,bookAppointment, ListAppointments };