const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const addOrder = async (req, res) => {
    const {items, delivery, total_amount, total_price, user_id, top_book_id} = req.body;
    let sql = 'INSERT INTO delivery (address, recipient, phone) VALUES (?, ?, ?)';
    let values = [delivery.address, delivery.recipient, delivery.phone];
    let delivery_id, order_id;

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        delivery_id = result.insertId;
    });

    sql = 'INSERT INTO orders (user_id, delivery_id, top_book_id, total_price) VALUES (?, ?, ?, ?)';
    values = [user_id, delivery_id, top_book_id, total_price];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        order_id = result.insertId;
    });

    sql = 'INSERT INTO order_list (order_id, book_id, amount) VALUES (?, ?, ?)';
    values.empty();
    items.forEach((item) => values.push([order_id, item.book_id, item.amount]));

    conn.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const getOrderList = (req, res) => {
    res.send('주문 목록 조회');
};

const getOrderDetail = (req, res) => {
    res.send('주문 상세 상품 조회');
};

module.exports = {
    addOrder,
    getOrderList,
    getOrderDetail
};