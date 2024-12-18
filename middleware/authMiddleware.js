const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // Извлекаем токен из заголовка
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Проверяем токен
        req.user = await User.findByPk(decoded.user_id); // Находим пользователя
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }
        next(); // Все проверки прошли — передаем запрос дальше
    } catch (error) {
        res.status(401).json({ message: 'Неавторизован', error: error.message });
    }
};
