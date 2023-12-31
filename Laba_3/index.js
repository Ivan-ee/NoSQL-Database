const express = require('express');
const path = require('path');
const redis = require('redis');

const PORT = 3000;
const LINK = 'http://localhost:3000';

const app = express();

let client = '';
let userData = {
    name: '',
    surname: '',
    age: '',
    email: '',
    city: '',
    password: '',
};


(async () => {
    client = redis.createClient();

    client.on("error", (error) => console.log('Что-то пошло не так', error));

    await client.connect();
})();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'templates'));
console.log(__dirname)

async function saveData(userData) {
    await client.set('user', userData, {EX: 30, NX: true});
}

async function getData() {
    try {
        const userData = await client.get('user');
        return JSON.parse(userData);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return null;
    }
}

app.get('/', async (req, res) => {
    try {
        const userData = await getData();

        if (userData) {
            res.render('index', userData);
        } else {
            res.render('index', {
                    name: '',
                    surname: '',
                    age: '',
                    email: '',
                    city: '',
                    password: '',
                });
        }
    } catch (error) {
        console.error(`Ошибка загрузки страницы: ${error}`);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/', async (req, res) => {
    userData = {
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        email: req.body.email,
        city: req.body.city,
        password: req.body.password
    };

    try {
        await saveData(JSON.stringify(userData));
        console.log('Данные успешно сохранены');
    } catch (err) {
        console.log(`Ошибка сохранения: ${err}`);
    }

    res.redirect('/about');
});

app.get('/about', async (req, res) => {
    // try {
    //     const userData = await getData();
    //     res.render('about', userData);
    // } catch (error) {
    //     console.error(`Error rendering about page: ${error}`);
    //     res.status(500).send('Internal Server Error');
    // }
    try {
        const userData = await getData();

        if (userData) {
            res.render('about', userData);
        } else {
            res.render('about', {
                name: '',
                surname: '',
                age: '',
                email: '',
                city: '',
                password: '',
            });
        }
    } catch (error) {
        console.error(`Ошибка загрузки страницы: ${error}`);
        res.status(500).send('Ошибка загрузки страницы');
    }
});

app.get('/index', async (req, res) => {
    try {
        const userData = await getData();

        if (userData) {
            res.render('index', userData);
        } else {
            res.render('index', {
                name: '',
                surname: '',
                age: '',
                email: '',
                city: '',
                password: '',
            });
        }
    } catch (error) {
        console.error(`Ошибка загрузки страницы: ${error}`);
        res.status(500).send('Ошибка загрузки страницы');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту ${LINK}`);
});
