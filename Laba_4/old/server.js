const express = require('express');
const mongoose = require('mongoose');

const Product = require('./models/products.js');
const Order = require('./models/orders.js');
const User = require('./models/users.js');

const productsData = require('./Data/productsData.json');
const usersData = require('./Data/usersData.js');
const ordersData = require('./Data/ordersData.js');

const PORT = 3000;
const URL = "mongodb://localhost:27017/eShop";

const app = express();
app.use(express.json());

mongoose
    .connect(URL)
    .then((res) => console.log('Connected to MongoDB'))
    .catch((err) => console.log(`DB connection error: ${err}`));

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`listening port ${PORT}`);
});

const handleError = (res, error, e) => {
    console.log(e);
    res.status(500).json({error});
}

app.post('/products', (req, res) => {
    const product = new Product(req.body);
    product
        .save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так."));
});

app.post('/orders', (req, res) => {
    const order = new Order(req.body);
    order
        .save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((e) => handleError(res, "Что-то пошло не так..", e));
});

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user
        .save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.get('/products', (req, res) => {
    Product
        .find()
        .then((products) => {
            res.status(200).json(products);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.get('/products/:id', (req, res) => {
    Product
        .findById(req.params.id)
        .then((product) => {
            res.status(200).json(product);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.get('/orders', (req, res) => {
    Order
        .find()
        .then((orders) => {
            res.status(200).json(orders);
        })
        .catch(() => handleError(res, "Что-то пошло не так.."));
});

app.get('/orders/:id', (req, res) => {
    Order
        .findById(req.params.id)
        .then((order) => {
            res.status(200).json(order);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.get('/users', (req, res) => {
    User
        .find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.get('/users/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.patch('/products/:id', (req, res) => {
    Product
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.patch('/orders/:id', (req, res) => {
    Order
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так.."));
});

app.patch('/users/:id', (req, res) => {
    User
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.delete('/products/:id', (req, res) => {
    Product
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.delete('/orders/:id', (req, res) => {
    Order
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

app.delete('/users/:id', (req, res) => {
    User
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => handleError(res, "Что-то пошло не так..."));
});

// Product.insertMany(productsData)
//     .then((result) => {
//         console.log('Продукты созданы', result);
//     })
//     .catch((error) => {
//         console.error('Ошибка создания продукта', error);
//     });
//
// User.insertMany(usersData)
//     .then((result) => {
//         console.log('Пользователи созданы:', result);
//     })
//     .catch((error) => {
//         console.error('Ошибка создания пользователя:', error);
//     });
//
// Order.insertMany(ordersData)
//     .then((result) => {
//         console.log('Заказы созданы:', result);
//     })
//     .catch((error) => {
//         console.error('Ошибка создания закааз:', error);
//     });
