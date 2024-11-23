const express = require('express');
const router = express.Router();

const { getUsers, } = require('../controllers/user');

router.get('/total/users', getUsers);

module.exports = router;