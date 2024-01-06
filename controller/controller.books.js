const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getBooks = (req, res) => {
    const {catId, isNew} = req.query;
    let values = [];

    let sql = 'SELECT * FROM books';

    if (catId && isNew) {
        sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [catId, isNew];
    } else if (catId) {
        sql += ' WHERE category_id = ?';
        values = [catId];
    } else if (isNew) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [isNew];
    }

    if (values) {  // query 값이 존재할 경우
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).send(err);
            }
            if (result[0])
                return res.status(StatusCodes.OK).json(result);
            else
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: StatusCodes.NOT_FOUND,
                    message: 'No books found matches the category.'
                });
        });
    } else {  // query 값이 없으면 전체 조회
        conn.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).send(err);
            }
            return res.status(StatusCodes.OK).json(result);
        });
    }
};

const bookDetail = (req, res) => {
    const {id} = parseInt(req.params);

    let sql = 'SELECT * FROM books WHERE id = ?';

    conn.query(sql, id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (result[0])
            return res.status(StatusCodes.OK).json(result[0]);
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {
    getBooks,
    bookDetail
};