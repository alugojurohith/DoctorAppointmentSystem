
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import authAdmin from './middleware/authAdmin.js';

dotenv.config(); // Load env variables early

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/admin', adminRouter);

// Health check route
app.get('/', (req, res) => {
    res.send('API working');
});

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
