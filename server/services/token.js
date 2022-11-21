import db from './db';

const uuid = require('uuid');
const helper = require('../helper');

async function addToken(user_id) {
    const sql = `INSERT INTO token (hash, user_id, expire_at) VALUES (?, ?, DATE_ADD( NOW(), INTERVAL 24 HOUR ))`;
    const hash = uuid.v4();
    const data = await db.query(sql, [ hash, user_id ]);
    return {
        data,
        hash
    };
}

async function findToken(hash) {
    const sql = `SELECT * FROM token WHERE hash = ?`;
    const rows = await db.query(sql, [ hash ]);
    return helper.emptyOrRow(rows);
}

async function removeToken(hash) {
    const sql = `DELETE FROM token WHERE hash = ?`;
    return await db.query(sql, [ hash ]);
}

module.exports = {
    addToken,
    findToken,
    removeToken
};