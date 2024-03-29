const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const { params: { id } } = req
    const user = await User.findById({_id: id})
    res.status(200).json({success: true, data: user});
  });

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const { body } = req
    const user = await User.create({...body })
    res.status(201).json({success: true, data: user});
  });
  
// @desc    Update user
// @route   PATCH /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { params: { id }, body } = req
    const user = await User.findByIdAndUpdate({_id: id}, 
        { $set: {...body } }, { new: true });
    res.status(200).json({success: true, data: user});
  });

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { params: { id } } = req
    const user = await User.findByIdAndDelete({_id: id}) ;
    res.status(200).json({success: true, data: {}});
  });
