// controllers/doctorController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
    } = req.body;

    const imageFile = req.file;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Validate image presence
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor image is required." });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email address." });
    }

    // Password length check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check for existing doctor
    const existingDoctor = await doctorModel.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "doctors",
    });

    // Create new doctor object
    const newDoctor = new doctorModel({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      image: uploadResult.secure_url,
      speciality: speciality.trim(),
      degree: degree.trim(),
      experience: experience.trim(),
      about: about.trim(),
      fees: fees.trim(),
    });

    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully.",
      doctor: {
        id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        image: newDoctor.image,
        speciality: newDoctor.speciality,
      },
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again later." });
  }
};

export { addDoctor };
