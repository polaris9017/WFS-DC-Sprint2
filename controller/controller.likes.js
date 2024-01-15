const jwt = require('jsonwebtoken');
const conn = require('../database');
const dotenv = require('dotenv');
const {StatusCodes} = require("http-status-codes");

dotenv.config();

const addLike = (req, res) => {
    const {book_id} = req.params;
    let sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        let values = [auth['user_id'], book_id];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Error adding like please try again.'
                });
            }
            return res.status(StatusCodes.OK).json(result);
        });
    }
};

const deleteLike = (req, res) => {
    const {book_id} = req.params;

    let sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';

    let auth = verifyToken(req);

    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        let values = [auth['user_id'], book_id];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Error deleting like please try again.'
                });
            }
            return res.status(StatusCodes.OK).json(result);
        });
    }
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
    addLike,
    deleteLike
};