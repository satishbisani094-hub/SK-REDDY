const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, deleteEnquiry } = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createEnquiry)
  .get(protectAdmin, getEnquiries);

router.route('/:id')
  .delete(protectAdmin, deleteEnquiry);

module.exports = router;
