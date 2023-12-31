const express = require('express');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Client } = require('../index');

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = cryptoJS.AES.encrypt(password, 'laba').toString();

    try {
        const userIdResult = await Client.execute('SELECT uuid() as user_id');
        const userId = userIdResult.rows[0].user_id;

        await Client.execute(
            'INSERT INTO eshop.users (user_id, username, email, password) VALUES (?, ?, ?, ?)',
            [userId, username, email, hashedPassword]
        );

        res.status(200).json({ user_id: userId, username, email });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await Client.execute(
            'SELECT user_id, username, email, password, is_admin FROM eshop.users WHERE username = ?',
            [username]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'данные не верны' });
        }

        const hashedPassword = cryptoJS.AES.decrypt(
            user.password,
            "laba"
        );

        const originalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

        if (originalPassword !== password) {
            return res.status(401).json({ error: 'данные не верны' });
        }

        const accessToken = jwt.sign(
            {
                id: user.user_id,
                isAdmin: user.is_admin,
            },
            "Laba",
            { expiresIn: "3d" }
        );

        const { password: _, ...other } = user;

        res.status(200).json({ ...other, accessToken });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'ошибка сервера' });
    }
});

module.exports = router;
