const { Server, User, ServerUser, TextChannel, VoiceChannel } = require('../models');

const jwt = require('jsonwebtoken');



// Получить все серверы пользователя
exports.getAllServers = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Получаем серверы, связанные с текущим пользователем
        const servers = await Server.findAll({
            include: [
                {
                    model: User,
                    where: { user_id: userId }, // Фильтруем по пользователю через таблицу ServerUser
                    through: { attributes: [] }, // Не возвращаем данные таблицы связи
                    attributes: ['user_id', 'username', 'email'], // Выводим только нужные поля пользователя
                },
                {
                    model: TextChannel, // Включаем связанные текстовые каналы
                    attributes: ['text_id', 'name', 'description'], // Указываем, какие поля возвращать
                },
                {
                    model: VoiceChannel, // Включаем связанные голосовые каналы
                    attributes: ['voice_id', 'name', 'max_people'], // Указываем, какие поля возвращать
                },
            ],
        });

        res.status(200).json({servers: servers});
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении серверов', error: error.message });
    }
};


// Получить конкретный сервер пользователя
exports.getServerById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        // Проверяем, есть ли связь сервера с пользователем
        const server = await Server.findOne({
            where: { server_id: id },
            include: [
                {
                    model: User,
                    where: { user_id: userId }, // Фильтруем по пользователю через таблицу ServerUser
                    through: { attributes: [] }, // Не возвращаем данные таблицы связи
                },
                {
                    model: TextChannel, // Включаем связанные текстовые каналы
                    attributes: ['text_id', 'name', 'description'], // Указываем, какие поля возвращать
                },
                {
                    model: VoiceChannel, // Включаем связанные голосовые каналы
                    attributes: ['voice_id', 'name', 'max_people'], // Указываем, какие поля возвращать
                },
            ],
        });

        if (!server) {
            return res.status(404).json({ message: 'Сервер не найден или недоступен' });
        }

        res.status(200).json({server: server});
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении сервера', error: error.message });
    }
};


// Добавить новый сервер и связать с пользователем
exports.createServer = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Имя и описание обязательны' });
        }

        const userId = req.user?.user_id; // Проверяем наличие userId
        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
        }

        // Создаем сервер
        const server = await Server.create({
            title,
            description,
            created_at: new Date(),
        });

        if (!server || !server.server_id) {
            return res.status(500).json({ message: 'Не удалось создать сервер' });
        }

        // Устанавливаем связь в таблице ServerUser
        await ServerUser.create({
            server: server.server_id,
            user: userId,
            is_creator: true,
            is_admin: true,
        });

        res.status(201).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании сервера', error: error.message });
    }
};

// Изменить сервер
exports.updateServer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const userId = req.user.id;

        // Проверяем, связан ли сервер с текущим пользователем
        const server = await Server.findOne({
            where: { id },
            include: {
                model: User,
                through: { where: { userId } }, // Проверяем связь в таблице ServerUser
            },
        });

        if (!server) {
            return res.status(404).json({ message: 'Сервер не найден или недоступен' });
        }

        // Обновляем данные сервера
        server.name = name || server.name;
        server.description = description || server.description;

        await server.save();

        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении сервера', error: error.message });
    }
};

// Удалить сервер и его связь с пользователем
exports.deleteServer = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Проверяем, связан ли сервер с текущим пользователем
        const server = await Server.findOne({
            where: { id },
            include: {
                model: User,
                through: { where: { userId } }, // Проверяем связь в таблице ServerUser
            },
        });

        if (!server) {
            return res.status(404).json({ message: 'Сервер не найден или недоступен' });
        }

        // Удаляем связь пользователя с сервером
        await ServerUser.destroy({ where: { serverId: id, userId } });

        // Удаляем сервер, если он не привязан больше ни к одному пользователю
        const remainingLinks = await ServerUser.count({ where: { serverId: id } });
        if (remainingLinks === 0) {
            await server.destroy();
        }

        res.status(200).json({ message: 'Сервер успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении сервера', error: error.message });
    }
};