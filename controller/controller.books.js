const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getBooks = (req, res) => {
    const {catId, isNew} = req.query;
    if (catId && isNew) res.send('카테고리별 도서 조회');
    else if (!(catId || isNew)) res.send('전체 도서 조회');
};

const bookDetail = (req, res) => {
    res.send('개별 도서 조회');
};

module.exports = {
    getBooks,
    bookDetail
};