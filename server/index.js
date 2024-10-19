// packages import
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middlewares/ErrorHandler');
const usersRoutes = require('./routes/users');
const accidentRoutes = require('./routes/accidentRoutes');
const pollRoutes = require('./routes/pollRoutes');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');
const donationRoutes = require('./routes/donationRoutes');
const servicePaymentRoutes = require('./routes/servicePaymentRoutes');
const charityProjectRoutes = require('./routes/charityProjectRoutes');
const issueReportingRoutes = require('./routes/issueReportingRoutes');
const path = require('path');

const dotenv = require('dotenv')
dotenv.config(); // Load environment variables from .env file

// From environment variables
const PORT = process.env.PORT || 45200;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fyp_database';
const ipAddress = '0.0.0.0';
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS JSON and URL encoded middlewares enabled
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api/users', usersRoutes);
app.use('/api/accidents', accidentRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/polls',pollRoutes);
app.use('/api/votes',voteRoutes);
app.use('/api/donations',donationRoutes);
app.use('/api/payments',servicePaymentRoutes);
app.use('/api/charityProjects', charityProjectRoutes);
app.use('/api/issueReporting', issueReportingRoutes);

// Error middlewares
app.use(notFound);
app.use(errorHandler);

// Database connection
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("connected");
}

// Server
app.listen(PORT, ipAddress, () => {
  console.log("ipAddress", ipAddress);
  console.log(`APP IS LISTENING ON PORT ${PORT}`);
})