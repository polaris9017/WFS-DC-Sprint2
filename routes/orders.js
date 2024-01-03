const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    res.send('주문하기');
});

router.get('/', (req, res) => {
    res.send('주문 목록 조회');
});

router.get('/:orderId', (req, res) => {
    res.send('주문 상세 상품 조회');
});

module.exports = router;