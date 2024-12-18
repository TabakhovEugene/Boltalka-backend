const { TextChannel } = require('../models');

exports.getAllTextChannels = async (req, res) => {
    try {
        const { server_id } = req.params;

        // Проверка доступа к серверу может быть вынесена в middleware
        const textChannels = await TextChannel.findAll({
            where: { server_id },
        });

        res.status(200).json(textChannels);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении текстовых каналов', error: error.message });
    }
};

exports.getTextChannelById = async (req, res) => {
    try {
        const { server_id, text_id } = req.params;

        const textChannel = await TextChannel.findOne({
            where: { text_id, server_id },
        });

        if (!textChannel) {
            return res.status(404).json({ message: 'Текстовый канал не найден' });
        }

        res.status(200).json(textChannel);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении текстового канала', error: error.message });
    }
};

exports.createTextChannel = async (req, res) => {
    try {
        const { server_id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Имя и описание текстового канала обязательно' });
        }

        const userId = req.user?.user_id; // Проверяем наличие userId
        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
        }

        const textChannel = await TextChannel.create({
            name,
            description,
            server_id,
        });

        res.status(201).json(textChannel);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании текстового канала', error: error.message });
    }
};

exports.updateTextChannel = async (req, res) => {
    try {
        const { server_id, text_id } = req.params;
        const { name, description } = req.body;

        const textChannel = await TextChannel.findOne({
            where: { text_id, server_id },
        });

        if (!textChannel) {
            return res.status(404).json({ message: 'Текстовый канал не найден' });
        }

        textChannel.name = name || textChannel.name;
        textChannel.description = description || textChannel.description;
        await textChannel.save();

        res.status(200).json(textChannel);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении текстового канала', error: error.message });
    }
};

exports.deleteTextChannel = async (req, res) => {
    try {
        const { server_id, text_id } = req.params;

        const textChannel = await TextChannel.findOne({
            where: { text_id, server_id },
        });

        if (!textChannel) {
            return res.status(404).json({ message: 'Текстовый канал не найден' });
        }

        await textChannel.destroy();

        res.status(200).json({ message: 'Текстовый канал успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении текстового канала', error: error.message });
    }
};
