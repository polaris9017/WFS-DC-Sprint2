const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    res.send('장바구니 담기');
});

router.get('/', (req, res) => {
    res.send('장바구니 조회');
});

router.delete('/:bookId', (req, res) => {
    res.send('장바구니 항목 삭제');
});

router.get('/checkout', (req, res) => {
    res.send('주문 예상 상품 목록 조회');
});

module.exports = router;