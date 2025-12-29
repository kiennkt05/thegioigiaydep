const asyncHandler = require('express-async-handler');
const crmService = require('../Services/crmService');

exports.getHistory = asyncHandler(async (req, res) => {
    const history = await crmService.getConversationHistory(req.params.userId);
    res.status(200).json(history);
});

exports.sendMessage = asyncHandler(async (req, res) => {
    const { userId, from, content, tone } = req.body;
    const conversation = await crmService.addMessage(userId, from, content, tone);
    res.status(200).json(conversation);
});

exports.resolve = asyncHandler(async (req, res) => {
    await crmService.resolveConversation(req.params.userId);
    res.status(200).json({ message: 'Conversation resolved' });
});
