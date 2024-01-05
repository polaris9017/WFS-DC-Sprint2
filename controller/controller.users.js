const conn = require('../database');
const {StatusCodes} = require("http-status-codes");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

function hash_password(password, salt) {
    /* salt를 이용한 password 해싱 */
    const salt_in = (salt ? salt : crypto.randomBytes(16).toString('base64'));
    return {
        hashedPassword: crypto.pbkdf2Sync(password, salt_in, 100000, 32, 'sha512').toString('base64'),
        salt: salt_in
    };
}

const signup = (req, res) => {
    const {email, password} = req.body;

    /*
    * 비밀번호 암호화
    * Reference: https://minu0807.tistory.com/84, https://d2.naver.com/helloworld/318732
    */

    /* 단순 password 해싱*/
    //const hashedPassword_hash = crypto.createHash('sha512').update(password).digest('base64');

    /* salt를 이용한 password 해싱 */
    const {hashedPassword, salt} = hash_password(password);

    let sql = 'INSERT INTO users (user_id, password) VALUES (? , ?)';
    let sql_salt = 'INSERT INTO users_cred (user_id, salt) VALUES (? , ?)';
    let values = [email, hashedPassword];
    let register_success = true;

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            register_success = false;
        }
        return res.status(StatusCodes.CREATED).json(result);
    });

    // salt 저장 시 계정 정보와 분리하여 저장
    conn.query(sql_salt, [email, salt], (err, result) => {
        if (err) {
            console.log(err);
            register_success = false;
        }
    });

    // 계정 등록과 salt 저장 중 하나라도 실패 시 실패 메시지 전송
    if (!register_success) return res.status(StatusCodes.BAD_REQUEST).send('Error registering new user please try again.');
};

const signin = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE user_id = ?';
    let sql_salt = 'SELECT salt FROM users_cred WHERE user_id = ?';
    let values = [email, password];
    let salt = '';
    let signin_success = true;

    conn.query(sql_salt, email, (err, result) => {
        if (err) {
            console.log(err);
            signin_success = false;
        } else salt = result[0].salt;
    });
    
    // salt 값 가져오기 성공 시 로그인 시도
    if (signin_success) {
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                signin_success = false;
            }
            const login = result[0];
            const {hashedPassword} = hash_password(password, salt);

            if (login && login.password === hashedPassword) {
                const token = jwt.sign({
                    email: login['user_id']
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
    } else return res.status(StatusCodes.BAD_REQUEST).send('Error signing in please try again.'); // 로그인 토큰값과 salt 값 둘 중 하나라도 가져오기 실패 시 실패 메시지 전송
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