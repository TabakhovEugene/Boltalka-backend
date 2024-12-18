require('dotenv').config(); // Загружаем переменные окружения из .env
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Роуты для пользователей
const serverRoutes = require('./routes/serverRoutes'); // Роуты для серверов

// Создаем приложение
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Разрешите доступ только вашему клиенту
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Укажите разрешенные HTTP-методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Укажите разрешенные заголовки
}));

// Мидлвары
app.use(bodyParser.json()); // Для обработки JSON-запросов
app.use(bodyParser.urlencoded({ extended: true })); // Для обработки URL-кодированных запросов

// Подключение роутов
app.use('/api/users', userRoutes); // Роуты пользователей
app.use('/api/servers', serverRoutes); // Роуты серверов

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'Что-то пошло не так!',
    });
});

// Указываем порт из .env или по умолчанию 8000
const PORT = process.env.PORT || 8000;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
