const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const users = require('./routes/users');
const books = require('./routes/books');
const likes = require('./routes/likes');
const carts = require('./routes/carts');
const orders = require('./routes/orders');

app.use('/', users);
app.use('/books', books);
app.use('/likes', likes);
app.use('/carts', carts);
app.use('/orders', orders);