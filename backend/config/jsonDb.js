const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Get full filepath for a collection
const getFilePath = (collectionName) => {
  return path.join(DATA_DIR, `${collectionName}.json`);
};

// Read data from a collection file
const readData = (collectionName) => {
  const filePath = getFilePath(collectionName);
  try {
    if (!fs.existsSync(filePath)) {
      // Create empty file if not exists
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent || '[]');
  } catch (error) {
    console.error(`Error reading collection ${collectionName}:`, error);
    return [];
  }
};

// Write data to a collection file
const writeData = (collectionName, data) => {
  const filePath = getFilePath(collectionName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing collection ${collectionName}:`, error);
    return false;
  }
};

// Helper to generate a unique random ID (simulates MongoDB ObjectId)
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomHex = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + randomHex;
};

module.exports = {
  readData,
  writeData,
  generateId
};
