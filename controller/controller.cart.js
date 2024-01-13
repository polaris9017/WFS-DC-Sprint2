const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const addToCart = (req, res) => {
    let sql = 'INSERT INTO cart (user_id, book_id, amount) SET (?, ?, ?)';

    conn.query(sql, req.body, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.CREATED).json(result);
    });
};

const getCartItems = (req, res) => {
    const {user_id, selected} = req.body;

    let sql = `SELECT cart.user_id, cart.book_id, title, summary, amount, price 
                      FROM cart LEFT JOIN book 
                      ON cart.book_id = book.id
                      WHERE cart.user_id = ? AND user_id IN (?)`;

    let values = [user_id, selected];
    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(result);
    });
}

const deleteCartItem = (req, res) => {
    /*let sql = 'DELETE FROM cart WHERE book_id = ?';

    conn.query(sql, req.params.bookId, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.NO_CONTENT).end();
    });*/
}

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem
};