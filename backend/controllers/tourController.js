const Tour = require('../models/Tour');

// @desc    Get all tours with search/filter
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  const { search, difficulty } = req.query;
  
  try {
    const query = {};

    // Filter by search string
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by difficulty level
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Sort by tour date ascending
    const tours = await Tour.find(query).sort({ tourDate: 1 });

    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single tour details
// @route   GET /api/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(tour);
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

    const newTour = await Tour.create({
      title,
      location,
      description,
      duration,
      difficulty,
      price: Number(price),
      seats: Number(seats),
      tourDate: new Date(tourDate),
      coverImage,
      galleryImages: parsedGallery
    });

    res.status(201).json(newTour);
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

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Update simple fields
    if (title) tour.title = title;
    if (location) tour.location = location;
    if (description) tour.description = description;
    if (duration) tour.duration = duration;
    if (difficulty) tour.difficulty = difficulty;
    if (price !== undefined) tour.price = Number(price);
    if (seats !== undefined) tour.seats = Number(seats);
    if (tourDate) tour.tourDate = new Date(tourDate);
    if (coverImage) tour.coverImage = coverImage;

    // Parse and set gallery images
    if (galleryImages !== undefined) {
      let parsedGallery = [];
      if (Array.isArray(galleryImages)) {
        parsedGallery = galleryImages;
      } else if (typeof galleryImages === 'string') {
        parsedGallery = galleryImages.split(',').map(url => url.trim()).filter(Boolean);
      }
      tour.galleryImages = parsedGallery;
    }

    const updatedTour = await tour.save();

    res.json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    await tour.deleteOne();

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
