const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req) => {
    try {
        if (req.headers['authorization']) return jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
        else throw new ReferenceError('No token provided');
    } catch (err) {
        console.log('Exception occurred while verifying token');
        console.log(err);
        return err;
    }
};

module.exports = verifyToken;