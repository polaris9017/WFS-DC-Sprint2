const conn = require('../database');
const {StatusCodes} = require("http-status-codes");

const getBooks = async (req, res) => {
    const {catId, isNew, limit, page} = req.query;
    let values = [], results;
    let isTrue = (isNew === 'true');  // isNew 직접 대입 시 'false' 값도 true 로 인식하여 값 대조 방식 사용

    let sql = 'SELECT * FROM books';

    if (catId && isTrue) {
        sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [parseInt(catId)];
    } else if (catId) {
        sql += ' WHERE category_id = ?';
        values = [parseInt(catId)];
    } else if (isTrue) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [isNew];
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), limit * (page - 1));

    if (values) {  // query 값이 존재할 경우
        results = await conn.query(sql, values);
        if (results)
            return res.status(StatusCodes.OK).json(results);
        else
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: 'No books found matches the category.'
            });
    } else {  // query 값이 없으면 전체 조회
        results = await conn.query(sql);
        return res.status(StatusCodes.OK).json(results);
    }
};

const bookDetail = async (req, res) => {
    let user_id = req.body;
    let {book_id} = req.params.id;
    let results;

    let sql = `SELECT *,
                      (select count(*) from likes where book_id = books.id)                  as likes,
                      (select exists(select * from likes where user_id = ? and book_id = ?)) as liked,
               from books
                        left join category
                                  on books.category_id = category.id
               where books.id = ?`;
    let values = [user_id, book_id, book_id];

    results = await conn.query(sql, values);

    return res.status(StatusCodes.OK).json(results);
};

module.exports = {
    getBooks,
    bookDetail
};