const express = require('express');
const  Review = require('../models/Review');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true});

const { protect, authorize} = require('../middleware/auth');

router.get('/', advancedResults(Review, {path: 'bootcamp', select: 'name description'}),
    getReviews);

router.post('/', protect, authorize('publisher', 'admin'), addReview);
router.get('/:id', advancedResults(Review, { path: 'bootcamp', select: 'name description'}), getReview);
router.patch('/:id/edit', protect, authorize('publisher', 'admin'), updateReview);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteReview);

module.exports = router;
