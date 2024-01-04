const express = require('express');
const router = express.Router();

const {getBooks, bookDetail} = require('../controller/controller.books');

router.use(express.json());

router.get('/', getBooks);
router.get('/:bookid', bookDetail);

module.exports = router;