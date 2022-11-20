import db from './db';

const helper = require('../helper');
const config = require('../config');

async function addUser(body) {
    const sql = `INSERT INTO user_shop (user_id, shop_id) VALUES (?,?)`;
    console.log(sql);
    const data = await db.query(sql, [ body.id, body.shop_id ]);
    return {
        data
    };
}

async function signUp(body) {
    const sql = `INSERT INTO user (type, name, email, passwd, document) VALUES (?,?,?,?,?)`;
    const data = await db.query(sql, [ body.type, body.name, body.email, body.passwd, body.document ]);
    return {
        data
    };
}

module.exports = {
    addUser,
    signUp
};