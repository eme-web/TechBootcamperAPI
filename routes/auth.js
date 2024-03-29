const express = require('express');
const { register, login, getMe, forgotPassword, 
    resetPassword, updateDetails, updatePassword} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/me',protect, getMe);
router.patch('/updatedetails',protect, updateDetails);
router.patch('/updatepassword',protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:resettoken', resetPassword);


module.exports = router;