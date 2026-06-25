const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  const { category } = req.query;

  try {
    let items;
    if (global.isMongoConnected) {
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      items = await Gallery.find(query).sort({ createdAt: -1 });
    } else {
      const { readData } = require('../config/jsonDb');
      items = readData('gallery');
      if (category && category !== 'All') {
        items = items.filter(item => item.category === category);
      }
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

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

    if (global.isMongoConnected) {
      // Save each image URL to MongoDB
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
    } else {
      const { readData, writeData, generateId } = require('../config/jsonDb');
      const items = readData('gallery');
      
      for (let i = 0; i < parsedImages.length; i++) {
        const imgUrl = parsedImages[i];
        const itemTitle = parsedImages.length > 1 ? `${title} (${i + 1})` : title;

        const newItem = {
          _id: generateId(),
          title: itemTitle || `Adventure Photo`,
          category,
          image: imgUrl,
          createdAt: new Date().toISOString()
        };

        items.push(newItem);
        createdItems.push(newItem);
      }
      writeData('gallery', items);
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
    if (global.isMongoConnected) {
      const item = await Gallery.findById(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }

      await item.deleteOne();
    } else {
      const { readData, writeData } = require('../config/jsonDb');
      const items = readData('gallery');
      const item = items.find(i => i._id === req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }

      const updatedItems = items.filter(i => i._id !== req.params.id);
      writeData('gallery', updatedItems);
    }

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
