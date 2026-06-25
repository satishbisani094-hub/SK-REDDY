const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database Connected successfully via Prisma.');
    global.isDbConnected = true;
    return true;
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    global.isDbConnected = false;
    return false;
  }
};

module.exports = { connectDB, prisma };
