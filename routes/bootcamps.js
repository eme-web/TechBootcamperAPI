const express = require('express');
const { protect, authorize } = require("../middleware/auth")
const {
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

//Include other resource routers
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);
// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
//router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);



router.get('/',advancedResults(Bootcamp, 'courses'), getBootcamps)
router.get('/:id', getBootcamp)
router.post('/new', protect, authorize('publisher', 'admin'), createBootcamp);
router.patch('/:id/edit', protect, authorize('publisher', 'admin'),updateBootcamp)
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteBootcamp)



module.exports = router
