const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItems, deleteGalleryItem } = require('../controllers/galleryController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getGalleryItems)
  .post(protectAdmin, createGalleryItems);

router.route('/:id')
  .delete(protectAdmin, deleteGalleryItem);

module.exports = router;
