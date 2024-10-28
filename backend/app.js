const express = require('express');
const app = express();

const cors = require('cors')
const products = require('./routes/product');
const category = require('./routes/category');
const seller = require('./routes/seller');
const cookieParser = require('cookie-parser');

app.use(express.json({limit:'50mb'}));

app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cors());
app.use(cookieParser());

app.use('/api/v1', products);
app.use('/api/v1', category);
app.use('/api/v1', seller);

module.exports = app