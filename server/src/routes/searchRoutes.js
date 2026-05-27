const express = require('express');
const { searchContent } = require('../controllers/searchController');

const router = express.Router();

router.get('/', searchContent);

module.exports = router;
