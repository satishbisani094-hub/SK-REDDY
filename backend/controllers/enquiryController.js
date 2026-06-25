const Enquiry = require('../models/Enquiry');

const createEnquiry = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let newEnquiry;
    if (global.isMongoConnected) {
      newEnquiry = await Enquiry.create({
        name,
        phone,
        email,
        message
      });
    } else {
      const { readData, writeData, generateId } = require('../config/jsonDb');
      const enquiries = readData('enquiries');
      newEnquiry = {
        _id: generateId(),
        name,
        phone,
        email,
        message,
        createdAt: new Date().toISOString()
      };
      enquiries.push(newEnquiry);
      writeData('enquiries', enquiries);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will get back to you soon.',
      data: newEnquiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res) => {
  try {
    let enquiries;
    if (global.isMongoConnected) {
      enquiries = await Enquiry.find().sort({ createdAt: -1 });
    } else {
      const { readData } = require('../config/jsonDb');
      enquiries = readData('enquiries');
      enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const enquiry = await Enquiry.findById(req.params.id);

      if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
      }

      await enquiry.deleteOne();
    } else {
      const { readData, writeData } = require('../config/jsonDb');
      const enquiries = readData('enquiries');
      const enquiry = enquiries.find(e => e._id === req.params.id);

      if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
      }

      const updatedEnquiries = enquiries.filter(e => e._id !== req.params.id);
      writeData('enquiries', updatedEnquiries);
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  deleteEnquiry
};
