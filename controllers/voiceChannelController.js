const { VoiceChannel } = require('../models');

exports.getAllVoiceChannels = async (req, res) => {
    try {
        const { server_id } = req.params;

        const voiceChannels = await VoiceChannel.findAll({
            where: { server_id },
        });

        res.status(200).json(voiceChannels);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении голосовых каналов', error: error.message });
    }
};

exports.getVoiceChannelById = async (req, res) => {
    try {
        const { server_id, voice_id } = req.params;

        const voiceChannel = await VoiceChannel.findOne({
            where: { voice_id: voice_id, server_id: server_id },
            attributes: ['voice_id', 'name', 'description'],
        });

        if (!voiceChannel) {
            return res.status(404).json({ message: 'Голосовой канал не найден' });
        }

        res.status(200).json({ voiceChannel });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении голосового канала', error: error.message });
    }
};

exports.createVoiceChannel = async (req, res) => {
    try {
        const { server_id } = req.params;
        const { name, max_people } = req.body;

        const userId = req.user?.user_id; // Проверяем наличие userId
        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Название канала обязательно' });
        }

        const voiceChannel = await VoiceChannel.create({
            name,
            max_people,
            server_id: server_id,
        });

        res.status(201).json({ voiceChannel });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании голосового канала', error: error.message });
    }
};

exports.updateVoiceChannel = async (req, res) => {
    try {
        const { server_id, voice_id } = req.params;
        const { name, max_people } = req.body;

        const voiceChannel = await VoiceChannel.findOne({
            where: { voice_id: voice_id, server_id: server_id },
        });

        if (!voiceChannel) {
            return res.status(404).json({ message: 'Голосовой канал не найден' });
        }

        voiceChannel.name = name || voiceChannel.name;
        voiceChannel.max_people = max_people || voiceChannel.max_people;

        await voiceChannel.save();

        res.status(200).json({ message: 'Голосовой канал обновлен', voiceChannel });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении голосового канала', error: error.message });
    }
};

exports.deleteVoiceChannel = async (req, res) => {
    try {
        const { server_id, voice_id } = req.params;

        const voiceChannel = await VoiceChannel.findOne({
            where: { voice_id: voice_id, server_id: server_id },
        });

        if (!voiceChannel) {
            return res.status(404).json({ message: 'Голосовой канал не найден' });
        }

        await voiceChannel.destroy();

        res.status(200).json({ message: 'Голосовой канал удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении голосового канала', error: error.message });
    }
};

