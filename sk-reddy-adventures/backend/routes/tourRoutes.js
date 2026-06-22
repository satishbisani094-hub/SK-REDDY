const express = require('express');
const router = express.Router();
const { getTours, getTourById, createTour, updateTour, deleteTour } = require('../controllers/tourController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTours)
  .post(protectAdmin, createTour);

router.route('/:id')
  .get(getTourById)
  .put(protectAdmin, updateTour)
  .delete(protectAdmin, deleteTour);

module.exports = router;
