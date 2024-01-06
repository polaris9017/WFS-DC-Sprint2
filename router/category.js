const express = require('express');
const router = express.Router();

const {getAllCategories} = require('../controller/controller.category');

router.use(express.json());

router.get('/', getAllCategories);

module.exports = router;