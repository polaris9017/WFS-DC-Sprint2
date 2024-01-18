const mariadb = require('mysql2/promise');

class Connection {
    constructor(config) {
        this.connection = mariadb.createPool(config);
    }

    async query(sql, values) {
        const conn = await this.connection.getConnection();
        let results = [];
        try {
            results = await (values ? conn.query(sql, values) : conn.query(sql));
        } catch (err) {
            console.log('[Error] DB connection error: ' + err);
        } finally {
            conn.release();
        }
        return results;
    }
}

const connection = new Connection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Bookstore',
    dateStrings: true
});

module.exports = connection;