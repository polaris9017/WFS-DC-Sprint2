const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth");

const addToCart = async (req, res) => {
    const {book_id, amount} = req.body;
    let sql = 'INSERT INTO cart (user_id, book_id, amount) SET (?, ?, ?)';
    let results;

    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        let values = [auth['user_id'], book_id, amount];

        results = await conn.query(sql, values);
    }

    return res.status(StatusCodes.OK).json(results);
};

const getCartItems = async (req, res) => {
    const {selected} = req.body;
    let results;

    let sql = `SELECT cart.id, cart.book_id, title, summary, amount, price 
                      FROM cart LEFT JOIN book 
                      ON cart.book_id = book.id
                      WHERE cart.user_id = ? AND user_id IN (?)`;

    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        let values = [auth['user_id'], selected];
        results = await conn.query(sql, values);
    }

    return res.status(StatusCodes.OK).json(results);
};

const deleteCartItem = async (req, res) => {
    const {cart_id} = req.params;
    let results;
    let sql = 'DELETE FROM cart WHERE book_id = ?';

    results = await conn.query(sql, cart_id);
    return res.status(StatusCodes.OK).json(results);
};

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem
};