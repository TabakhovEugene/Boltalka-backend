const { Message, TextChannel, ServerUser, Server, User } = require('../models');

// Получить все сообщения из текстового канала
exports.getAllMessages = async (req, res) => {
    try {
        const { text_id, server_id } = req.params;
        const userId = req.user.user_id;

        // Проверяем доступ пользователя к серверу
        const channel = await TextChannel.findOne({
            where: { text_id },
            include: {
                model: Server,
                where: { server_id: server_id },
                include: {
                    model: User,
                    where: { user_id: userId },
                    attributes: [], // Оставляем пустым, чтобы исключить лишние данные
                },
            },
        });

        if (!channel) {
            return res.status(403).json({ message: 'У вас нет доступа к этому каналу' });
        }

        // Получаем сообщения с данными о пользователях
        const messages = await Message.findAll({
            where: { text_id },
            attributes: ['message_id', 'message', 'user_id', 'created_at'], // Основные атрибуты
            include: [
                {
                    model: User, // Включаем пользователя, который отправил сообщение
                    attributes: ['username'], // Берем только имя пользователя
                },
            ],
            order: [['created_at', 'ASC']], // Сортируем по дате
        });

        // Форматируем сообщения для вывода
        const formattedMessages = messages.map((msg) => ({
            message_id: msg.message_id,
            message: msg.message,
            created_at: msg.created_at,
            user: {
                user_id: msg.user_id,
                username: msg.User.username, // Имя пользователя из ассоциации
            },
            my_user: userId,
        }));

        res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении сообщений', error: error.message });
    }
};



// Создать новое сообщение
exports.createMessage = async (req, res) => {
    try {
        const { server_id, text_id } = req.params;
        const { message } = req.body;
        const userId = req.user.user_id;

        if (!message) {
            return res.status(400).json({ message: 'Сообщение не может быть пустым' });
        }

        // Проверяем, связан ли пользователь с сервером, к которому принадлежит канал
        const channel = await TextChannel.findOne({
            where: { text_id },
            include: {
                model: Server,
                where: { server_id: server_id },
                include: {
                    model: User,
                    where: { user_id: userId },
                    attributes: [],
                },
            },
        });

        if (!channel) {
            return res.status(403).json({ message: 'У вас нет доступа к этому каналу' });
        }

        // Создаем сообщение
        const newMessage = await Message.create({
            message,
            user_id: userId,
            text_id,
            created_at: new Date(),
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании сообщения', error: error.message });
    }
};


// Обновить сообщение
exports.updateMessage = async (req, res) => {
    try {
        const { text_id, message_id, server_id } = req.params;
        const { message } = req.body;
        const userId = req.user.user_id;

        if (!message) {
            return res.status(400).json({ message: 'Сообщение не может быть пустым' });
        }

        // Проверяем, есть ли доступ к серверу
        const channel = await TextChannel.findOne({
            where: { text_id },
            include: {
                model: Server,
                where: { server_id: server_id },
                include: {
                    model: User,
                    where: { user_id: userId },
                    attributes: [],
                },
            },
        });

        if (!channel) {
            return res.status(403).json({ message: 'У вас нет доступа к этому каналу' });
        }

        // Проверяем, является ли пользователь автором сообщения
        const existingMessage = await Message.findOne({
            where: { message_id, text_id, user_id: userId },
        });

        if (!existingMessage) {
            return res.status(404).json({ message: 'Сообщение не найдено или у вас нет прав на его редактирование' });
        }

        // Обновляем сообщение
        existingMessage.message = message;
        await existingMessage.save();

        res.status(200).json(existingMessage);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении сообщения', error: error.message });
    }
};


// Удалить сообщение
exports.deleteMessage = async (req, res) => {
    try {
        const { text_id, message_id } = req.params;
        const userId = req.user.user_id;

        // Проверяем, связан ли пользователь с сервером, к которому принадлежит канал
        const channel = await TextChannel.findOne({
            where: { text_id },
            include: {
                model: Server,
                include: {
                    model: ServerUser,
                    where: { user: userId },
                    attributes: [],
                },
            },
        });

        if (!channel) {
            return res.status(403).json({ message: 'У вас нет доступа к этому каналу' });
        }

        // Проверяем, является ли пользователь автором сообщения
        const existingMessage = await Message.findOne({
            where: { message_id, text_id, user_id: userId },
        });

        if (!existingMessage) {
            return res.status(404).json({ message: 'Сообщение не найдено или у вас нет прав на его удаление' });
        }

        // Удаляем сообщение
        await existingMessage.destroy();

        res.status(200).json({ message: 'Сообщение успешно удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении сообщения', error: error.message });
    }
};
