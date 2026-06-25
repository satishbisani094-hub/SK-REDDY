const { prisma } = require('../config/db');

// Helper to format enquiry to frontend format
const mapEnquiry = (enq) => {
  if (!enq) return null;
  return {
    ...enq,
    _id: enq.id
  };
};

const createEnquiry = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newEnquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email,
        message
      }
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will get back to you soon.',
      data: mapEnquiry(newEnquiry)
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
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(enquiries.map(mapEnquiry));
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: req.params.id }
    });

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await prisma.enquiry.delete({
      where: { id: req.params.id }
    });

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
