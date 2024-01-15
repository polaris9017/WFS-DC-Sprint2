const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addToCart = (req, res) => {
    const {book_id, amount} = req.body;
    let sql = 'INSERT INTO cart (user_id, book_id, amount) SET (?, ?, ?)';

    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        let values = [auth['user_id'], book_id, amount];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(result);
        });
    }
};

const getCartItems = (req, res) => {
    const {selected} = req.body;

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
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(result);
        });
    }
};

const deleteCartItem = (req, res) => {
    const {cart_id} = req.params;
    let sql = 'DELETE FROM cart WHERE book_id = ?';

    conn.query(sql, cart_id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.NO_CONTENT).end();
    });
};

function verifyToken(req) {
    try {
        return jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
    } catch (err) {
        console.log('Exception occurred while verifying token');
        console.log(err);
        return err;
    }
}

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem
};