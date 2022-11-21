import db from './db';
const uuid = require('uuid');

async function addToken() {
    const sql = `INSERT INTO token (token, expire_at) VALUES (?, DATE_ADD( NOW(), INTERVAL 24 HOUR ))`;
    const token = uuid.v4();
    const data = await db.query(sql, [ token ]);
    return {
        data,
        token
    };
}

module.exports = {
    addToken
};