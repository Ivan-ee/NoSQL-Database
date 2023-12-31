const express = require('express');
const User = require('../models/user.js');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password, 'laba').toString()
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (e) {
        res.status(500).json(e);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Неверные данные");

        const hashedPassword = cryptoJS.AES.decrypt(
            user.password,
            "laba"
        )

        const originalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("Пароли не верны!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            "Laba",
            {expiresIn: "3d"}
        )

        const {password, ...other} = user._doc;

        res.status(200).json({...other, accessToken});
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;