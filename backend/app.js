const express = require('express');
const app = express();

const cors = require('cors')
const products = require('./routes/product');
const categories = require('./routes/category');
const sellers = require('./routes/seller');
const brands = require('./routes/brand');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const order = require('./routes/order');
const user = require('./routes/user');
app.use(express.json({limit:'50mb'}));

app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cors());
app.use(cookieParser());

app.use('/api/v1', products);
app.use('/api/v1', categories);
app.use('/api/v1', sellers);
app.use('/api/v1', brands);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', user);

module.exports = app