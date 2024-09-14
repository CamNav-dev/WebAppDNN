import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import fileRoutes from './routes/upload.route.js'; // Import the file routes
import { errorHandler } from './utils/error.js';

dotenv.config();


const mongoURI = process.env.MONGO;
mongoose.connect(mongoURI, {
  dbName: 'DNNWebAppDB', 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Adjust the origin to match your frontend's URL
  credentials: true,
}));

app.use(express.json());

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes); // Add the route for file uploads

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  return res.status(statusCode).json({ 
    success: false,
    message,
    statusCode,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(errorHandler);
