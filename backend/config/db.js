const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not provided. Falling back to Local JSON DB Mode.');
      global.isMongoConnected = false;
      return false;
    }
    // Set a short serverSelectionTimeoutMS so local runs don't hang for 30s
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}. Falling back to Local JSON DB Mode.`);
    global.isMongoConnected = false;
    return false;
  }
};

module.exports = connectDB;
