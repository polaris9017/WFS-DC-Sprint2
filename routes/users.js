const express = require('express');
const router = express.Router();
const conn = require('../database');

router.post('/signup', (req, res) => {
    const {email, password} = req.body;
    let sql = 'INSERT INTO users (email, password) VALUES (? , ?)';
    let values = [email, password];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send('Error registering new user please try again.');
        } else {
            console.log(result);
            res.status(200).send('Welcome to the club!');
        }
        res.status(200).json(result);
    });
});

router.post('/signin', (req, res) => {
    res.send('Sign in');
});

router.post('/reset-password', (req, res) => {
    res.send('Reset password');
});

router.put('/reset-password', (req, res) => {
    res.send('Reset password');
});

module.exports = router;