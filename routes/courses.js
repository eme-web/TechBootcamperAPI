const express = require('express');
const  Course = require('../models/Course');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true});

const { protect, authorize} = require('../middleware/auth');

router.get('/', advancedResults(Course, {path: 'bootcamp', select: 'name description'}),
    getCourses);

router.post('/', protect, authorize('publisher', 'admin'), addCourse);
router.get('/:id', advancedResults(Course, { path: 'bootcamp', select: 'name description'}), getCourse);
router.patch('/:id/edit', protect, authorize('publisher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
