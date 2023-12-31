const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.js');
const authRoute = require('./routes/auth.js');
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const dotenv = require('dotenv');

/*
Laba eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2UyOWU3Yjg1YmFmMTY5M2YzNjYyZCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMjc2Nzc1MiwiZXhwIjoxNzAzMDI2OTUyfQ.oyD5yhMv86jmejU_XmWSLm5I2CF7QhZDsfuk1Mfflbg
 */


dotenv.config();
const app = express();

const PORT = 3000;
const LINK = `http://localhost:${PORT}`;
const URL = "mongodb://localhost:27017/eShop";

mongoose
    .connect(URL)
    .then((res) => console.log('Подлючение к MongoDB завершено'))
    .catch((err) => console.log(`Ошибка подлючения к бд: ${err}`));

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Приложение запущено на порту: ${PORT}. Перейдите на : ${LINK}`);
});