const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "Laba", (err, user) => {
            if (err) res.status(403).json("Невалидный токен");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("Авторизация не прошла");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Неверный токен");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Неверный токен");
        }
    });
};



module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};