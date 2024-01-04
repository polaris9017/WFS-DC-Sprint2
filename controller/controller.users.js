const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

function hash_password(password, salt) {
    /* salt를 이용한 password 해싱 */
    const salt_in = (salt ? salt : crypto.randomBytes(64).toString('base64'));
    return {
        hashedPassword: crypto.pbkdf2Sync(password, salt_in, 100000, 64, 'sha512').toString('base64'),
        salt: salt_in
    };
}

const signup = (req, res) => {
    const {email, password} = req.body;

    /* 비밀번호 암호화 */

    /*
    * 단순 password 해싱
    * 해싱 후 앞 16자리 slicing 해서 사용하려 했으나 이러면 Rainbow attack 이나 collision 우려가 있어 base64 사용
    * Reference: https://minu0807.tistory.com/84, https://d2.naver.com/helloworld/318732
    */
    const hashedPassword_hash = crypto.createHash('sha512').update(password).digest('base64');

    /* salt를 이용한 password 해싱 */
    const {hashedPassword, salt} = hash_password(password);

    let sql = 'INSERT INTO users (email, password) VALUES (? , ?)';
    let sql_salt = 'INSERT INTO user_salts (email, salt) VALUES (? , ?)';
    let values = [email, hashedPassword];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error registering new user please try again.');
        }
        return res.status(StatusCodes.CREATED).json(result);
    });

    // salt 저장 시 계정 정보와 분리하여 저장
    conn.query(sql_salt, [email, salt], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error registering new user please try again.');
        }
        return res.status(StatusCodes.CREATED).json(result);
    });
};

const signin = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    let sql_salt = 'SELECT * FROM user_salts WHERE email = ?';
    let values = [email, password];
    let salt = '';

    conn.query(sql_salt, email, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error signing in please try again.');
        }
        salt = result[0].salt;
    });

    const {hashedPassword} = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error signing in please try again.');
        }
        const login = result[0];

        if (login && login.password === hashedPassword) {
            const token = jwt.sign({
                email: login.email
            }, process.env.SECRET_KEY, {
                expiresIn: '30m',
                issuer: 'admin'
            });

            res.cookie('token', token, {
                httpOnly: true
            });
            return res.status(StatusCodes.OK).json(token);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send('Incorrect email or password');
        }
    });
};

const requestResetPassword = (req, res) => {
    const {email} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error requesting reset password please try again.');
        }
        const user = result[0];
        if (user) return res.status(StatusCodes.OK).json({
            email: email
        });
        else return res.status(StatusCodes.UNAUTHORIZED).send('Incorrect email');

    });
};

const resetPassword = (req, res) => {
    const {email, password} = req.body;
    const {hashedPassword, salt} = hash_password(password);

    let sql = 'UPDATE users SET password = ? WHERE email = ?';
    let sql_salt = 'UPDATE user_salts SET salt = ? WHERE email = ?';
    let values = [email, hashedPassword];

    conn.query(sql_salt, [email, salt], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error resetting password please try again.');
        }
        return res.status(StatusCodes.OK).end();
    });

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).send('Error resetting password please try again.');
        }
        if (result.affectedRows === 0) return res.status(StatusCodes.BAD_REQUEST).send('Incorrect email');
        else return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    signup,
    signin,
    requestResetPassword,
    resetPassword
}