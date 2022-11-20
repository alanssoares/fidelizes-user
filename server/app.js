require('dotenv').config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const app = express();
const userRouter = require("./routes/user");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use("/users", userRouter);

export default app;