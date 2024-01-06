const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getAllCategories = (req, res) => {
    let sql = 'SELECT * FROM category';

    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    getAllCategories
};