const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getBooks = (req, res) => {
    const {catId, isNew} = req.query;

    let sql = 'SELECT * FROM books';
    let sql_cat = 'SELECT * FROM books WHERE category_id = ?';

    if (!(catId || isNew)) {
        conn.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).send(err);
            }
            return res.status(StatusCodes.OK).json(result);
        });
    } else if (catId && isNew) {
        conn.query(sql_cat, catId, (err, result) => {
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