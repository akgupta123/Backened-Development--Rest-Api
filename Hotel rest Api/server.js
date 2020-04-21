var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
mongoose.connect('mongodb://localhost/hotels', { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
const hotelRoom = require('./routes/hotelroom')
app.use('/hotel', hotelRoom);
app.listen(3000, () => console.log('Server Started'))