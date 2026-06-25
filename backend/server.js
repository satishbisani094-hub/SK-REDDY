const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables immediately before any other local imports
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/db');
const { seedAdmin } = require('./controllers/authController');

// Connect to Database
connectDB().then(() => {
  // Seed admin account directly on startup
  seedAdmin();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

// Root path test route
app.get('/', (req, res) => {
  res.json({ message: 'SK Reddy Adventures API (Prisma ORM Mode) is running...' });
});

// Custom 404 Error handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Custom error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
