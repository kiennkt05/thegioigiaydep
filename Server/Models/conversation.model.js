const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    channel: {
        type: String,
        enum: ['HOTLINE', 'CHAT', 'EMAIL'],
        default: 'CHAT'
    },
    messages: [
        {
            from: { type: String, enum: ['USER', 'AGENT'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    tone: {
        type: String,
        enum: ['FRIENDLY', 'PROFESSIONAL', 'WARM'],
        default: 'WARM'
    },
    context: {
        customerNotes: { type: String }, // e.g. "Chân bè, hay đau"
        lastIssues: [String]
    },
    resolved: { type: Boolean, default: false }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
