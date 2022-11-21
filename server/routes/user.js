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
        res.status(500).json({ message: "Error add shop to user" });
    }
});

router.delete('/:id', verifyJWT, async (req, res, next) => {
    try {
        const data = await userService.removeUser(req.params.id);
        if (data) res.json(data);
        else res.status(404).json({ message: "User not found" });
    } catch (err) {
        console.error(`Error while delete user `, err.message);
        res.status(500).json({ message: "Error delete user" });
    }
});

router.post('/confirm/:hash', async (req, res, next) => {
    try {
        const token = await tokenSevice.findToken(req.params.hash);
        console.log(token);
        if (token) {
            const curTime = new Date();
            const expireTime = new Date(token.expire_at);
            if (curTime < expireTime) {
                await userService.confirmUser(token.user_id);
                await tokenSevice.removeToken(token.hash);
                res.json({ message: "Successfully" });
            } else {
                res.status(404).json({ message: "Token has been expired or used" });
            }
        } else {
            res.status(404).json({ message: "Token has been expired or used" });
        }
    } catch (err) {
        console.error(`Error while confirm user `, err.message);
        res.status(500).json({ message: "Error confirm user" });
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const exist = await userService.findByEmail(req.body.email);
        if (exist) {
            res.status(400).json({ message: "User already exists", status: 401 });
        } else {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(req.body.passwd, salt);
            req.body.passwd = hash;
            const data = await userService.signUp(req.body);
            if (data) {
                const token = await tokenSevice.addToken(data.insertId);
                const email = {
                    email: req.body.email,
                    subject: 'Fidelizes - Confirm Your Account',
                    template: `<h3>Welcome to Fidelizes!</h3>
                    <p>Click on the link below to confirm your account:</p>
                    <p>Link: <a href="https://www.fidelizes.com/confirm-account/${token.hash}">https://www.fidelizes.com/confirm-account/${token.hash}</a></p>
                    <p>Fidelizes Team</p>
                    `
                };
                await mailService.send(email);
                res.json(data);
            } else {
                res.status(400).json({ message: "Error signup" });
            }
        }
    } catch (err) {
        console.error(`Error while signup `, err.message);
        res.status(500).json({ message: "Error signup" });
    }
});

router.post('/forgot-passwd', async (req, res, next) => {
    try {
        const data = await userService.findByEmail(req.body.email);
        if (data) {
            const token = await tokenSevice.addToken(data.id);
            const email = {
                email: req.body.email,
                subject: 'Fidelizes - Reset Password',
                template: `<h3>Reset Password</h3>
                <p>Click on the link below to reset your password:</p>
                <p>Link: <a href="https://www.fidelizes.com/reset-password/${token.hash}">https://www.fidelizes.com/reset-password/${token.hash}</a></p>
                <p>Fidelizes Team</p>
                `
            };
            await mailService.send(email);
            res.json(data);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(`Error while forgot password `, err.message);
        res.status(500).json({ message: "Error send email forgot password" });
    }
});

module.exports = router;