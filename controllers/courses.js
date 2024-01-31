const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

//@desc     GET courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcamId/courses
//@access   Public
exports.getCourses = asyncHandler(async(req,res,next) =>{
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults)
    }
});

//@desc     GET single course
//@route    GET /api/v1/courses/:id
//@access   Public

exports.getCourse = asyncHandler(async(req,res,next) =>{
    const { params: { id } } = req
    const course = await Course.findById({_id:id}).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
    }
    res.status(200).json({ success: true, data: course});
});

//@desc     Add course
//@route    POST /api/v1/bootcamps/:bootcampId/courses
//@access   Private

exports.addCourse = asyncHandler(async(req,res,next) =>{
    const { params: { bootcampId } } = req
    req.body.bootcamp = bootcampId;
    req.body.user = req.user

    const bootcamp = await Bootcamp.findById({ _id: bootcampId })

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)
    }

    //Make sure user is a bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }

    const course = await Course.create(req.body);

    res.status(200).json({ success: true, data: course})
});

//@desc     Update course
//@desc     PUT /api/v1/courses/:id
//@access   Private

exports.updateCourse = asyncHandler(async(req,res,next) =>{
    const { params: { id }, body } = req
    let course = await Course.findById({ _id: id });

    if(!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404)
    }

    //Make sure user is a course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`,401));
    }

    course = await Course.findByIdAndUpdate({_id: id}, 
        { $set: {...body } }, { new: true });

    res.status(200).json({success: true, data: course})
});

//@desc     Delete course
//@route    DELETE /api/v1/courses/:id
//@access   Private

exports.deleteCourse = asyncHandler(async(req, res, next) =>{
    const { params: { id }} = req
    let course = await Course.findById({ _id: id});

    if(!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404)
    }

    //Make sure user is a course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`,401));
    }

    course = await Course.findByIdAndDelete({_id: id});

    res.status(200).json({success: true, data: {}})
    
})