const express = require('express');
const router = express.Router();

const {addOrder, getOrderList, getOrderDetail} = require('../controller/controller.orders');

router.use(express.json());

router.post('/', addOrder);

router.get('/', getOrderList);

router.get('/:orderId', getOrderDetail);

module.exports = router;