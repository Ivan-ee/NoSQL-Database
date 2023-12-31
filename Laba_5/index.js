const express = require('express');
const {Client} = require('cassandra-driver');
const bodyParser = require('body-parser');
const uuid = require('uuid');
// const productRoute = require('./routes/product');

const app = express();
const PORT = 5000;
const LINK = `http://localhost:${PORT}`;

const client = new Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'eshop'
});


(async () => {
    await client.connect();
    console.log("Подлючение к Cossandra выполнено");
})();

const createTableUser = `
    CREATE TABLE IF NOT EXISTS eshop.user (
    user_id UUID PRIMARY KEY,
    name TEXT,
    login TEXT,
    email TEXT,
);`;


const createTableProduct = `
    CREATE TABLE IF NOT EXISTS eshop.product (
    product_id UUID PRIMARY KEY,
    name TEXT,
    price INT,
    rating INT,
    description TEXT,
    category_id UUID
);`;

const createTableCategory = `
    CREATE TABLE IF NOT EXISTS eshop.category (
    category_id UUID PRIMARY KEY,
    name TEXT
);`;

const createTableCart = `
    CREATE TABLE IF NOT EXISTS eshop.cart (
    cart_id UUID PRIMARY KEY,
    price INT,
    user_id UUID,
    products SET<UUID>  
);`;


(async () => {

    await client.execute(createTableUser, [], {prepare: true});

    await client.execute(createTableCart, [], {prepare: true});

    // await client.execute(createTableUserProduct, [], {prepare: true});

    await client.execute(createTableCategory, [], {prepare: true});

    await client.execute(createTableProduct, [], {prepare: true});

    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.user (login)', [], {prepare: true});

    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.product (name)', [], {prepare: true});
    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.product (price)', [], {prepare: true});
    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.product (rating)', [], {prepare: true});
    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.product (category_id)', [], {prepare: true});

    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.category (name)', [], {prepare: true});

    await client.execute('CREATE INDEX IF NOT EXISTS ON eshop.cart (user_id)', [], {prepare: true});


})();

async function getCategoryByName(categoryName) {
    try {
        const query = 'SELECT category_id FROM eshop.category WHERE name = ?';
        const result = await client.execute(query, [categoryName], {prepare: true});

        if (result.rows.length > 0) {
            return result.rows[0].category_id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка доступа к категории:', error);
    }
}

async function getCategoryById(categoryId) {
    try {
        if (categoryId === undefined || categoryId === null) {
            return null;
        }

        const query = 'SELECT name FROM eshop.category WHERE category_id = ?';
        const result = await client.execute(query, [categoryId], {prepare: true});

        if (result.rows.length > 0) {
            return result.rows[0].name;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка доступа к категории:', error);
        return null;
    }
}


app.use(bodyParser.json());

app.post('/users', async (req, res) => {
    const {name, login, email} = req.body;

    if (!name || !login || !email) {
        return res.status(400).json({error: 'Введены не все данные'});
    }

    try {
        const userId = uuid.v4();

        const query = 'INSERT INTO eshop.user (user_id, name, login, email) VALUES (?, ?, ?, ?)';
        await client.execute(query, [userId, name, login, email], {prepare: true});

        res.status(201).json({message: 'Пользователь добавлен!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM eshop.user';
        const result = await client.execute(query, [], {prepare: true});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// 1
app.get('/users/by-login', async (req, res) => {
    const login = req.query.login;

    try {
        const query = 'SELECT * FROM eshop.user WHERE login = ?';
        const result = await client.execute(query, [login], {prepare: true});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const query = 'SELECT * FROM eshop.user WHERE user_id = ?';
        const result = await client.execute(query, [userId], {prepare: true});

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({error: 'Пользователь не найден'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.post('/categories', async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Заполните все данные'});
    }

    try {
        const categoryId = uuid.v4();
        const query = 'INSERT INTO eshop.category (category_id, name) VALUES (?, ?)';
        await client.execute(query, [categoryId, name], {prepare: true});

        res.status(201).json({message: 'категория создана'});
    } catch (error) {
        console.error('Ошибка создания категории', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/categories', async (req, res) => {

    try {
        const getCategoryQuery = 'SELECT * FROM eshop.category';
        const categoryResult = await client.execute(getCategoryQuery, [], {prepare: true});

        res.json(categoryResult.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.post('/products', async (req, res) => {
    const {name, price, rating, description, category} = req.body;

    if (!name || !price || !rating || !description || !category) {
        return res.status(400).json({error: 'Введите все данные'});
    }

    try {
        const productId = uuid.v4();

        const categoryId = await getCategoryByName(category);

        if (!categoryId) {
            return res.status(400).json({error: 'Нет такой категории'});
        }

        const query = 'INSERT INTO eshop.product (product_id, name, price, rating, description, category_id) VALUES (?, ?, ?, ?, ?, ?)';
        await client.execute(query, [productId, name, price, rating, description, categoryId], {prepare: true});

        res.status(201).json({message: 'Продукт успешно создлан'});
    } catch (error) {
        console.error('Ошибка создания продукта:', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/products', async (req, res) => {
    try {
        const query = 'SELECT * FROM eshop.product';
        const result = await client.execute(query, []);

        const productsWithCategories = await Promise.all(
            result.rows.map(async (product) => {
                const categoryName = await getCategoryById(product.category_id);
                return {...product, category: categoryName};
            })
        );

        res.json(productsWithCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.put('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const {name, price, description, rating} = req.body;

    try {
        const query = 'UPDATE eshop.product SET name = ?, price = ?, description = ?, rating = ? WHERE product_id = ?';
        await client.execute(query, [name, price, description, rating, productId], {prepare: true});
        res.json({message: 'Продукт обновлён!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.delete('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const query = 'DELETE FROM eshop.product WHERE product_id = ?';
        await client.execute(query, [productId], {prepare: true});
        res.json({message: 'Продукт удалён!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// 3
app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const query = 'SELECT * FROM eshop.product WHERE product_id = ?';
        const result = await client.execute(query, [productId]);

        if (result.rows.length > 0) {
            const product = result.rows[0];
            const categoryName = await getCategoryById(product.category_id);
            console.log(categoryName);

            res.json({product, categoryName});
        } else {
            res.status(404).json({error: 'Продукт не найден'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// 4
app.get('/by-category/:category_id', async (req, res) => {
    const category_id = req.params.category_id;
    try {
        const query = 'SELECT * FROM eshop.product WHERE category_id = ?';
        const result = await client.execute(query, [category_id], {prepare: true});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});


// 5
app.get('/by-category-rating/:category_id', async (req, res) => {
    const category_id = req.params.category_id;
    const rating = req.query.rating;

    try {
        const query = 'SELECT * FROM eshop.product WHERE category_id = ? AND rating = ?';
        const result = await client.execute(query, [category_id, rating], {prepare: true});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});


app.post('/cart', async (req, res) => {
    try {
        const {price, user_id, products} = req.body;

        if (!price || !user_id || !products) {
            return res.status(400).json({error: 'Введите все данные'});
        }

        const cartId = uuid.v4();

        const query = 'INSERT INTO eshop.cart (cart_id, price, user_id, products) VALUES (?, ?, ?, ?)';
        await client.execute(query, [cartId, price, user_id, products], {prepare: true});

        res.status(201).json({message: 'Корзина добавлена'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// 2
app.get('/cart/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const query = 'SELECT * FROM eshop.cart WHERE user_id = ?';
        const result = await client.execute(query, [user_id], {prepare: true});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/by-price', async (req, res) => {
    const minPrice = parseFloat(req.query.min) || 0;
    const maxPrice = parseFloat(req.query.max) || Number.MAX_SAFE_INTEGER;

    try {
        const query = 'SELECT * FROM eshop.product WHERE price >= ? AND price <= ? ALLOW FILTERING';
        const result = await client.execute(query, [minPrice, maxPrice], {prepare: true});
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.get('/by-rating', async (req, res) => {
    const minRating = parseInt(req.query.min) || 0;
    const maxRating = parseInt(req.query.max) || 5;

    try {
        const query = 'SELECT * FROM eshop.product WHERE rating >= ? AND rating <= ? ALLOW FILTERING';
        const result = await client.execute(query, [minRating, maxRating], {prepare: true});
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Приложение запущено на порту: ${PORT}. Перейдите на : ${LINK}`);
});
