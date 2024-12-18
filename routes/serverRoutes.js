const express = require('express');
const serverController = require('../controllers/serverController');
const textChannelController = require('../controllers/textChannelController');
const voiceChannelController = require('../controllers/voiceChannelController');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Подключаем middleware для авторизации
const router = express.Router();

// Маршруты
router.get('/', protect, serverController.getAllServers);
router.get('/:id', protect, serverController.getServerById);
router.post('/create', protect, serverController.createServer);
router.put('/update/:id', protect, serverController.updateServer);
router.delete('/delete/:id', protect, serverController.deleteServer);

router.get('/:server_id/text_channels', protect, textChannelController.getAllTextChannels);
router.get('/:server_id/text_channels/:text_id', protect, textChannelController.getTextChannelById);
router.post('/:server_id/text_channels/create', protect, textChannelController.createTextChannel);
router.put('/:server_id/text_channels/update/:text_id', protect, textChannelController.updateTextChannel);
router.delete('/:server_id/text_channels/delete/:text_id', protect, textChannelController.deleteTextChannel);

router.get('/:server_id/voice_channels', protect, voiceChannelController.getAllVoiceChannels);
router.get('/:server_id/voice_channels/:voice_id', protect, voiceChannelController.getVoiceChannelById);
router.post('/:server_id/voice_channels/create', protect, voiceChannelController.createVoiceChannel);
router.put('/:server_id/voice_channels/update/:voice_id', protect, voiceChannelController.updateVoiceChannel);
router.delete('/:server_id/voice_channels/delete/:voice_id', protect, voiceChannelController.deleteVoiceChannel);

router.get('/:server_id/text_channels/:text_id/messages', protect, messageController.getAllMessages);
router.post('/:server_id/text_channels/:text_id/messages/create', protect, messageController.createMessage);
router.put('/:server_id/text_channels/:text_id/messages/update/:message_id', protect, messageController.updateMessage);
router.delete('/:server_id/text_channels/:text_id/messages/delete/:message_id', protect, messageController.deleteMessage);

module.exports = router;
