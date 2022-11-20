import jwt from 'jsonwebtoken';

require('dotenv').config();

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function emptyOrRow(rows) {
    if (!rows) {
        return {};
    }
    return rows[0];
}

function verifyJWT(req, res, next){

    if ("/users/signup".match(req.route.path)) next();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      req.id = decoded.id;
      next();
    });
}

module.exports = {
    getOffset,
    emptyOrRows,
    emptyOrRow,
    verifyJWT
}