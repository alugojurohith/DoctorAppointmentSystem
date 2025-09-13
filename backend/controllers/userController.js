import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';


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

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" })
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" })
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const appointmentsData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentsData)
    await newAppointment.save()

    // Update doctor's slots_booked to mark this slot as taken
    console.log('Booking slot:', { docId, slotDate, slotTime });
    console.log('Original doctor slots_booked:', docData.slots_booked);

    if (docData.slots_booked) {
      const updatedSlotsBooked = { ...docData.slots_booked };
      if (!updatedSlotsBooked[slotDate]) {
        updatedSlotsBooked[slotDate] = [];
      }
      if (!updatedSlotsBooked[slotDate].includes(slotTime)) {
        updatedSlotsBooked[slotDate].push(slotTime);
      }
      console.log('Updated slots_booked:', updatedSlotsBooked);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: updatedSlotsBooked });
    } else {
      // Initialize slots_booked if it doesn't exist
      const newSlotsBooked = { [slotDate]: [slotTime] };
      console.log('Initializing slots_booked:', newSlotsBooked);
      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: newSlotsBooked
      });
    }

    res.json({ success: true, message: "appointment booked" })

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

//api to cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to cancel this appointment" })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked) {
      // Create a new object to avoid mutation issues
      const updatedSlotsBooked = { ...doctorData.slots_booked };

      if (updatedSlotsBooked[slotDate] && Array.isArray(updatedSlotsBooked[slotDate])) {
        // Remove the specific time slot
        updatedSlotsBooked[slotDate] = updatedSlotsBooked[slotDate].filter((entry) => {
          if (typeof entry === 'string') return entry !== slotTime;
          if (entry && typeof entry === 'object' && 'slotTime' in entry) return entry.slotTime !== slotTime;
          return true;
        });

        // Update the doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: updatedSlotsBooked });
      }
    }

    res.json({ success: true, message: "Appointment cancelled", freedSlot: { slotDate, slotTime } })

  } catch (error) {
    console.error("Error canceling appointment:", error);
  }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

//api to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment not found" })
    }

    //creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY || 'INR',
      receipt: appointmentId,
    }
    //creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}

//api to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try{
    const {razorpay_order_id}=req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

     console.log(orderInfo);
  }
  catch(error){
}
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, ListAppointments, cancelAppointment , paymentRazorpay ,verifyRazorpay };