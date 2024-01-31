const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

//@desc     GET reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1/bootcamps/:bootcamId/reviews
//@access   Public
exports.getReviews = asyncHandler(async(req,res,next) =>{
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults)
    }
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const { params: { id }} = req
    const review = await Review.findById({_id:id}).populate({
      path: 'bootcamp',
      select: 'name description'
    });
  
    if (!review) {
      return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: review
    });
  });
  
  // @desc      Add review
  // @route     POST /api/v1/bootcamps/:bootcampId/reviews
  // @access    Private
  exports.addReview = asyncHandler(async (req, res, next) => {
    const { params: {bootcampId} } = req;
    req.body.bootcamp = bootcampId;
    req.body.user = req.user;
  
    const bootcamp = await Bootcamp.findById({ _id: bootcampId });
  
    if (!bootcamp) {
      return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404));
    }
  
    const review = await Review.create(req.body);
  
    res.status(201).json({
      success: true,
      data: review
    });
  });
  
  // @desc      Update review
  // @route     PATCH /api/v1/reviews/:id
  // @access    Private
  exports.updateReview = asyncHandler(async (req, res, next) => {
    const { params: { id }, body } = req

    let review = await Review.findById({ _id:id });
  
    if (!review) {
      return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
  
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }
  
    review = await Review.findByIdAndUpdate({_id: id}, 
        { $set: {...body } }, { new: true });
  
    res.status(200).json({success: true, data: review });
  });
  
  // @desc      Delete review
  // @route     DELETE /api/v1/reviews/:id
  // @access    Private
  exports.deleteReview = asyncHandler(async (req, res, next) => {
    const { params: { id } } = req

    let review = await Review.findById({ _id: id });
  
    if (!review) {
      return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
  
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }
  
    review = await Review.findByIdAndDelete({ _id:id });
  
    res.status(200).json({success: true, data: {} });
  });