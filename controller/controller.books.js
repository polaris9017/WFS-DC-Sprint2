const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");

const getBooks = async (req, res) => {
    const {catId, isNew, limit, page} = req.query;
    let values = [], results;
    let isTrue = (isNew === 'true');  // isNew 직접 대입 시 'false' 값도 true 로 인식하여 값 대조 방식 사용
    let totalResults = {books: [], pagination: {}};

    let sql = 'SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE book_id=books.id) AS likes FROM books';

    if (catId && isTrue) {
        sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [parseInt(catId)];
    } else if (catId) {
        sql += ' WHERE category_id = ?';
        values = [parseInt(catId)];
    } else if (isTrue) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [isNew];
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), limit * (page - 1));

    if (values) {  // query 값이 존재할 경우
        results = await conn.query(sql, values);
        if (results)
            totalResults.books = results;
        else
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: 'No books found.'
            });
    } else {  // query 값이 없으면 전체 조회
        results = await conn.query(sql);
        totalResults.books = results;
    }

    sql = 'SELECT found_rows()';

    results = await conn.query(sql, values);
    totalResults.pagination = {page: page, count: results[0]['found_rows()']};

    return res.status(StatusCodes.OK).json(totalResults);
};

const bookDetail = async (req, res) => {
    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else if (auth instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Invalid token'
        });
    } else if (auth instanceof ReferenceError) {
        let {book_id} = req.params.id;
        let results;

        let sql = `SELECT *,
                      (select count(*) from likes where book_id = books.id)                  as likes
               from books
                        left join category
                                  on books.category_id = category.id
               where books.id = ?`;
        let values = [book_id];

        results = await conn.query(sql, values);

        return res.status(StatusCodes.OK).json(results);
    } else {
        let {book_id} = req.params.id;
        let results;

        let sql = `SELECT *,
                      (select count(*) from likes where book_id = books.id)                  as likes,
                      (select exists(select * from likes where user_id = ? and book_id = ?)) as liked,
               from books
                        left join category
                                  on books.category_id = category.id
               where books.id = ?`;
        let values = [auth['id'], book_id, book_id];

        results = await conn.query(sql, values);

        return res.status(StatusCodes.OK).json(results);
    }
};

module.exports = {
    getBooks,
    bookDetail
};