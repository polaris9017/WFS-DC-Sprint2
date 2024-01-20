const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");

const addOrder = async (req, res) => {
    const {items, delivery, total_price, top_book_id} = req.body;
    let values = [delivery['address'], delivery['recipient'], delivery['phone']];
    let results;

    let auth = verifyToken(req);
    if (auth instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Token expired'
        });
    } else {
        // 배송지 정보 저장
        let sql = 'INSERT INTO delivery (address, recipient, phone) VALUES (?, ?, ?)';
        results = await conn.query(sql, values);
        let delivery_id = results.insertId;

        // 주문 정보 저장
        sql = 'INSERT INTO orders (user_id, delivery_id, top_book_id, total_price) VALUES (?, ?, ?, ?)';
        values = [auth['id'], delivery_id, top_book_id, total_price];
        results = await conn.query(sql, values);
        let order_id = results.insertId;

        // 주문 목록 저장
        sql = 'INSERT INTO order_list (order_id, book_id, amount) VALUES (?, ?, ?)';
        values.empty();
        items.forEach((item) => values.push([order_id, item['book_id'], item['amount']]));
        results = await conn.query(sql, [values]);

        // 장바구니에서 주문한 경우 장바구니에서 삭제
        let result = await deleteCartItem(auth['id'], items.map((item) => item['book_id']));

        return res.status(StatusCodes.OK).json(results[0]);
    }
};

const deleteCartItem = async (user_id, items) => {
    let sql = 'DELETE FROM carts WHERE book_id IN (?) and user_id = ?';
    return await conn.query(sql, [[items], user_id]);
}

const getOrderList = async (req, res) => {
    const user_id = req.body['email'];
    let sql = `select orders.id, orders.total_price, orders.created_at,
                      delivery.address, delivery.recipient, delivery.phone 
                      from orders left join delivery 
                      on orders.delivery_id = delivery.id
                      where orders.user_id = ?`;

    let [rows, fields] = await conn.query(sql, user_id);
    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
    const {orderId} = req.params;
    let sql = `select book_id, title, author, price, amount
                        from order_list left join books
                        on order_list.book_id = books.id
                        where order_list.order_id = ?`;
    let [rows, fields] = await conn.query(sql, orderId);
    return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
    addOrder,
    getOrderList,
    getOrderDetail
};