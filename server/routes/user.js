import express from 'express';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const { verifyJWT } = require('../helper');
const router = express.Router();
const userService = require('../services/user');
const tokenSevice = require('../services/token');
const mailService = require('../services/mail');

router.post('/:id/shops/:shop_id', verifyJWT, async (req, res, next) => {
    try {
        const data = await userService.addUser(req.params);
        if (data) res.json(data);
        else res.status(400).json({ message: "Error add shop to user" });
    } catch (err) {
        console.error(`Error while adding shops `, err.message);
        res.status(400).json({ message: "Error add shop to user" });
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.passwd, salt);
        req.body.passwd = hash;
        const data = await userService.signUp(req.body);
        if (data) {
            const dataToken = await tokenSevice.addToken();
            await mailService.send({ email: req.body.email, token: dataToken.token });
            res.json(data);
        } else {
            res.status(400).json({ message: "Error signup" });
        }
    } catch (err) {
        console.error(`Error while signup `, err.message);
        res.status(400).json({ message: "Error signup" });
    }
});

module.exports = router;