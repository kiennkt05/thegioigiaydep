const Conversation = require('../Models/conversation.model');

const getConversationHistory = async (userId) => {
    return await Conversation.find({ userId }).sort({ createdAt: -1 });
};

const addMessage = async (userId, from, content, tone = 'WARM') => {
    let conversation = await Conversation.findOne({ userId, resolved: false });

    if (!conversation) {
        conversation = new Conversation({
            userId,
            messages: [],
            tone
        });
    }

    conversation.messages.push({ from, content });

    // Auto-update context if keywords found (basic simulation)
    if (content.toLowerCase().includes('chân bè') || content.toLowerCase().includes('đau')) {
        conversation.context.customerNotes = "Customer mentioned 'chân bè' or pain - consider wide fit.";
    }

    return await conversation.save();
};

const resolveConversation = async (userId) => {
    return await Conversation.updateMany({ userId, resolved: false }, { resolved: true });
};

module.exports = { getConversationHistory, addMessage, resolveConversation };
