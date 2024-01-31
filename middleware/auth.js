const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new ErrorResponse("No token provided", 401))
    }

    const token = authHeader.split(" ")[1];

    // Make sure token exists
    if(!token) {
        return next(new ErrorResponse('No token provided', 401));}
        // verify token
    const { id }  = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id);

    const user  = await User.findById({_id: id });
    if (!user){
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }
    req.user = user;
    //console.log(req.user)
    return next();
       

    //     return next();
    // } catch (err) {
    //     return next(new ErrorResponse("Not authorize to access this route", 401));
    // }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 401))
        }
        return next();
    }
}