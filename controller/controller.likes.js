const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const addLike = (req, res) => {
    const {book_id} = req.params;
    const {user_id} = req.body;
    let sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
    let values = [user_id, book_id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end('Error adding like please try again.');
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const deleteLike = (req, res) => {
    const {book_id} = req.params;
    const {user_id} = req.body;
    let sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';
    let values = [user_id, book_id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end('Error deleting like please try again.');
        }
        return res.status(StatusCodes.OK).json(result);
    });
}

module.exports = {
    addLike,
    deleteLike
};