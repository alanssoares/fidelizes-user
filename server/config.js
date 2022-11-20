require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_URL,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: "fidelizes",
    },
    listPerPage: 10,
};
module.exports = config;