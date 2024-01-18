const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getAllCategories = async (req, res) => {
    let sql = 'SELECT * FROM category';
    let results;

    results = await conn.query(sql);

    return res.status(StatusCodes.OK).json(results);
};

module.exports = {
    getAllCategories
};