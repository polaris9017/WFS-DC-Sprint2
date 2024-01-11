const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, deleteCartItem} = require('../controller/controller.cart');

router.use(express.json());

router.post('/', addToCart);

router.post('/', getCartItems);

router.delete('/:bookId', deleteCartItem);

router.get('/checkout', (req, res) => {
    res.send('주문 예상 상품 목록 조회');
});

module.exports = router;