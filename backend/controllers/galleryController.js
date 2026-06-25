const { prisma } = require('../config/db');

// Helper to format gallery item to frontend format
const mapGallery = (item) => {
  if (!item) return null;
  return {
    ...item,
    _id: item.id
  };
};

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  const { category } = req.query;

  try {
    const conditions = {};
    if (category && category !== 'All') {
      conditions.category = category;
    }

    const items = await prisma.gallery.findMany({
      where: conditions,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(items.map(mapGallery));
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.json([]);
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

    // Save each image URL using Prisma
    for (let i = 0; i < parsedImages.length; i++) {
      const imgUrl = parsedImages[i];
      const itemTitle = parsedImages.length > 1 ? `${title} (${i + 1})` : title;

      const newItem = await prisma.gallery.create({
        data: {
          title: itemTitle || `Adventure Photo`,
          category,
          image: imgUrl
        }
      });
      createdItems.push(mapGallery(newItem));
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
    const item = await prisma.gallery.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await prisma.gallery.delete({
      where: { id: req.params.id }
    });

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
