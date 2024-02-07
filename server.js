const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const helmet = require('helmet');
const path = require('path');
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses');
const users = require("./routes/users");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews")

// Load env vars
dotenv.config()

// connect to databse
connectDB()

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CookieParser
app.use(cookieParser());
app.use(morgan('dev'));

//set security headers
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);


app.use(errorHandler);

const PORT = process.env.PORT || 5090;


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// // Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`);
//     // close server & exit process
//     server.close(() => process.exit(1));
});
