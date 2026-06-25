const { prisma } = require('../config/db');

// Helper to format tour database object to frontend format
const mapTour = (tour) => {
  if (!tour) return null;
  return {
    ...tour,
    _id: tour.id,
    galleryImages: tour.galleryImages ? tour.galleryImages.split(',').map(url => url.trim()).filter(Boolean) : []
  };
};

// @desc    Get all tours with search/filter
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  const { search, difficulty } = req.query;
  
  try {
    const conditions = {};

    if (search) {
      conditions.OR = [
        { title: { contains: search } },
        { location: { contains: search } }
      ];
    }

    if (difficulty && difficulty !== 'All') {
      conditions.difficulty = difficulty;
    }

    const tours = await prisma.tour.findMany({
      where: conditions,
      orderBy: {
        tourDate: 'asc'
      }
    });

    res.json(tours.map(mapTour));
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.json([]);
  }
};

// @desc    Get single tour details
// @route   GET /api/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: req.params.id }
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(mapTour(tour));
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private/Admin
const createTour = async (req, res) => {
  try {
    const { title, location, description, duration, difficulty, price, seats, tourDate, coverImage, galleryImages } = req.body;

    if (!coverImage) {
      return res.status(400).json({ message: 'Cover image URL is required' });
    }

    // Parse gallery images (can be array or comma-separated string)
    let parsedGallery = [];
    if (galleryImages) {
      if (Array.isArray(galleryImages)) {
        parsedGallery = galleryImages;
      } else if (typeof galleryImages === 'string') {
        parsedGallery = galleryImages.split(',').map(url => url.trim()).filter(Boolean);
      }
    }
    const galleryString = parsedGallery.join(',');

    const newTour = await prisma.tour.create({
      data: {
        title,
        location,
        description,
        duration,
        difficulty,
        price: Number(price),
        seats: Number(seats),
        tourDate: new Date(tourDate),
        coverImage,
        galleryImages: galleryString
      }
    });

    res.status(201).json(mapTour(newTour));
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
const updateTour = async (req, res) => {
  try {
    const { title, location, description, duration, difficulty, price, seats, tourDate, coverImage, galleryImages } = req.body;

    const tour = await prisma.tour.findUnique({
      where: { id: req.params.id }
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (location !== undefined) dataToUpdate.location = location;
    if (description !== undefined) dataToUpdate.description = description;
    if (duration !== undefined) dataToUpdate.duration = duration;
    if (difficulty !== undefined) dataToUpdate.difficulty = difficulty;
    if (price !== undefined) dataToUpdate.price = Number(price);
    if (seats !== undefined) dataToUpdate.seats = Number(seats);
    if (tourDate !== undefined) dataToUpdate.tourDate = new Date(tourDate);
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;

    if (galleryImages !== undefined) {
      let parsedGallery = [];
      if (Array.isArray(galleryImages)) {
        parsedGallery = galleryImages;
      } else if (typeof galleryImages === 'string') {
        parsedGallery = galleryImages.split(',').map(url => url.trim()).filter(Boolean);
      }
      dataToUpdate.galleryImages = parsedGallery.join(',');
    }

    const updatedTour = await prisma.tour.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });

    res.json(mapTour(updatedTour));
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
const deleteTour = async (req, res) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: req.params.id }
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    await prisma.tour.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};
