import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config(); // Load env variables early

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Global middleware
app.use(express.json());
app.use(cors());

// Debug & mount admin routes
app.use(
  '/api/admin',
  // Log every incoming /api/admin request
  (req, res, next) => {
    console.log(`[ADMIN ROUTE] ${req.method} ${req.originalUrl}`);
    next();
  },
  adminRouter
);

// Health check
app.get('/', (req, res) => {
  res.send('API working');
});

// Catch-all for any unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    tried: `${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
