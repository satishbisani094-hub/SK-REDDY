const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  const { category } = req.query;

  try {
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort by creation date descending (newest first)
    const items = await Gallery.find(query).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Upload new image(s) to gallery
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItems = async (req, res) => {
  try {
    const { title, category, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const createdItems = [];

    // Parse image URLs (can be array or comma-separated string)
    let parsedImages = [];
    if (Array.isArray(image)) {
      parsedImages = image;
    } else if (typeof image === 'string') {
      parsedImages = image.split(',').map(url => url.trim()).filter(Boolean);
    }

    // Save each image URL
    for (let i = 0; i < parsedImages.length; i++) {
      const imgUrl = parsedImages[i];
      const itemTitle = parsedImages.length > 1 ? `${title} (${i + 1})` : title;

      const newItem = await Gallery.create({
        title: itemTitle || `Adventure Photo`,
        category,
        image: imgUrl
      });
      createdItems.push(newItem);
    }

    res.status(201).json(createdItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await item.deleteOne();

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItems,
  deleteGalleryItem
};
