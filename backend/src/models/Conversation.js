import mongoose from 'mongoose';

// Schema para mensagens individuais
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Schema para conversa entre dois usuários
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    // Referência ao serviço/pedido que originou a conversa
    relatedRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    },
    relatedService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    messages: [messageSchema],
    lastMessage: {
        content: String,
        sender: mongoose.Schema.Types.ObjectId,
        createdAt: Date
    }
}, {
    timestamps: true
});

// Index para buscar conversas de um usuário
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
