const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const users = require('./router/users');
const books = require('./router/books');
const likes = require('./router/likes');
const carts = require('./router/carts');
const orders = require('./router/orders');

app.use('/', users);
app.use('/books', books);
app.use('/likes', likes);
app.use('/carts', carts);
app.use('/orders', orders);