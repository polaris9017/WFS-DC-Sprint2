const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req) => {
    try {
        return jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
    } catch (err) {
        console.log('Exception occurred while verifying token');
        console.log(err);
        return err;
    }
};

module.exports = verifyToken;