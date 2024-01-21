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
    } else if (auth instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Invalid token'
        });
    } else {
        let values = [auth['user_id'], book_id, amount];

        results = await conn.query(sql, values);
    }

    return res.status(StatusCodes.OK).json(results);
};

const getCartItems = async (req, res) => {
    const {selected} = req.body;
    let results, values = []

    let sql = `SELECT cart.id, cart.book_id, title, summary, amount, price 
                      FROM carts LEFT JOIN books 
                      ON carts.book_id = books.id
                      WHERE carts.user_id = ?`;

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
    } else {
        values = [auth['user_id']];

        if (selected) {  // 주문서 작성 시 선택한 장바구니 목록 조회
            sql += ' AND user_id IN (?)';
            values.push(selected);
        }

        results = await conn.query(sql, values);
    }

    return res.status(StatusCodes.OK).json(results);
};

const deleteCartItem = async (req, res) => {
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
    } else {
        const {cart_id} = req.params;
        let results;
        let sql = 'DELETE FROM carts WHERE book_id IN (?)';

        results = await conn.query(sql, [cart_id]);
        return res.status(StatusCodes.OK).json(results);
    }
};

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem
};