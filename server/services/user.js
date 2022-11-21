import db from './db';

const helper = require('../helper');

async function addUser(body) {
    const sql = `INSERT INTO user_shop (user_id, shop_id) VALUES (?,?)`;
    return await db.query(sql, [ body.id, body.shop_id ]);
}

async function findByEmail(email) {
    const sql = `SELECT id, email FROM user WHERE email = ?`;
    const rows = await db.query(sql, [ email ]);
    return helper.emptyOrRow(rows);
}

async function signUp(body) {
    const sql = `INSERT INTO user (type, name, email, passwd, document) VALUES (?,?,?,?,?)`;
    return await db.query(sql, [ body.type, body.name, body.email, body.passwd, body.document ]);
}

async function confirmUser(id) {
    const sql = `UPDATE user SET status = 1 WHERE id = ?`;
    return await db.query(sql, [ id ]);
}

async function removeUser(id) {
    const sql = `UPDATE user SET status = 2 WHERE id = ?`;
    return await db.query(sql, [ id ]);
}

module.exports = {
    addUser,
    signUp,
    findByEmail,
    confirmUser,
    removeUser
};