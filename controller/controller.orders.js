const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const addOrder = async (req, res) => {
    const {items, delivery, total_amount, total_price, user_id, top_book_id} = req.body;
    let values = [delivery['address'], delivery['recipient'], delivery['phone']];
    let results;

    // 배송지 정보 저장
    let sql = 'INSERT INTO delivery (address, recipient, phone) VALUES (?, ?, ?)';
    results = await conn.query(sql, values);
    let delivery_id = results.insertId;

    // 주문 정보 저장
    sql = 'INSERT INTO orders (user_id, delivery_id, top_book_id, total_price) VALUES (?, ?, ?, ?)';
    values = [user_id, delivery_id, top_book_id, total_price];
    results = await conn.query(sql, values);
    let order_id = results.insertId;

    // 주문 목록 저장
    sql = 'INSERT INTO order_list (order_id, book_id, amount) VALUES (?, ?, ?)';
    values.empty();
    items.forEach((item) => values.push([order_id, item['book_id'], item['amount']]));
    results = await conn.query(sql, [values]);

    return res.status(StatusCodes.OK).json(results[0]);
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