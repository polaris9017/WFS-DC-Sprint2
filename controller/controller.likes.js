const jwt = require('jsonwebtoken');
const conn = require('../database');
const dotenv = require('dotenv');
const {StatusCodes} = require("http-status-codes");
const verifyToken = require("../auth");

dotenv.config();

const addLike = async (req, res) => {
    const {book_id} = req.params;
    let sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
    let auth = verifyToken(req);
    let results = [];

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
        let values = [auth['user_id'], book_id];
        results = await conn.query(sql, values);
        return res.status(StatusCodes.OK).json(results);
    }
};

const deleteLike = async (req, res) => {
    const {book_id} = req.params;
    let results;

    let sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';

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
        let values = [auth['user_id'], book_id];
        results = await conn.query(sql, values);

        return res.status(StatusCodes.OK).end(results);
    }
};

module.exports = {
    addLike,
    deleteLike
};