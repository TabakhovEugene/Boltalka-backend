const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Импорт модели User


// Регистрация пользователя
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Проверка на пустые поля
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
        }

        // Проверка, существует ли пользователь с таким email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Генерация JWT токена
        const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Возвращаем данные пользователя и токен
        res.status(201).json({
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
    }
};

// Авторизация пользователя
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверка на пустые поля
        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
        }

        // Проверка, существует ли пользователь с таким email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email' });
        }

        // Проверка пароля
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Возвращаем данные пользователя и токен
        res.status(200).json({
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
    }
};

// Получение информации о текущем пользователе
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Получение пользователя по ID
        const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email'] });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения данных пользователя', error: error.message });
    }
};

// Обновление информации о пользователе
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        // Обновление данных пользователя
        const updatedUser = await User.update({ username, email }, { where: { id: userId } });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Профиль обновлен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления данных', error: error.message });
    }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Удаление пользователя
        await User.destroy({ where: { id: userId } });

        res.status(200).json({ message: 'Пользователь удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления', error: error.message });
    }
};
