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
      fees
    } = req.body;
    const imageFile = req.file;

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
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Doctor image is required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingDoctor = await doctorModel.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: "Doctor with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl;
    try {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    } catch (uploadError) {
      return res.status(500).json({ success: false, message: "Image upload failed." });
    }

    const doctorData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      image: imageUrl,
      password: hashedPassword,
      speciality: speciality.trim(),
      degree: degree.trim(),
      experience: experience.trim(),
      about: about.trim(),
      fees: fees.trim(),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
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
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export { addDoctor };
