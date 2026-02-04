import Conversation from '../models/Conversation.js';
import AppError from '../utils/AppError.js';

// Obter todas as conversas do usuário
export const getConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'name avatar')
            .populate('relatedService', 'title')
            .sort({ updatedAt: -1 });

        // Adicionar contagem de mensagens não lidas
        const conversationsWithUnread = conversations.map(conv => {
            const unreadCount = conv.messages.filter(
                msg => !msg.read && msg.sender.toString() !== req.user._id.toString()
            ).length;
            return {
                ...conv.toObject(),
                unreadCount
            };
        });

        res.json({
            status: 'success',
            data: { conversations: conversationsWithUnread }
        });
    } catch (error) {
        next(error);
    }
};

// Obter ou criar conversa com outro usuário
export const getOrCreateConversation = async (req, res, next) => {
    try {
        const { userId, serviceId, requestId } = req.body;

        if (!userId) {
            return next(new AppError('userId is required', 400));
        }

        // Verifica se já existe conversa entre os dois
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] }
        }).populate('participants', 'name avatar');

        if (!conversation) {
            // Cria nova conversa
            conversation = await Conversation.create({
                participants: [req.user._id, userId],
                relatedService: serviceId || null,
                relatedRequest: requestId || null,
                messages: []
            });
            await conversation.populate('participants', 'name avatar');
        }

        res.json({
            status: 'success',
            data: { conversation }
        });
    } catch (error) {
        next(error);
    }
};

// Obter mensagens de uma conversa
export const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user._id
        }).populate('messages.sender', 'name avatar');

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        // Marca mensagens como lidas
        conversation.messages.forEach(msg => {
            if (msg.sender.toString() !== req.user._id.toString()) {
                msg.read = true;
            }
        });
        await conversation.save();

        res.json({
            status: 'success',
            data: { messages: conversation.messages }
        });
    } catch (error) {
        next(error);
    }
};

// Enviar mensagem (fallback HTTP quando Socket não disponível)
export const sendMessage = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            return next(new AppError('Message content is required', 400));
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user._id
        });

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        const newMessage = {
            sender: req.user._id,
            content: content.trim(),
            read: false
        };

        conversation.messages.push(newMessage);
        conversation.lastMessage = {
            content: content.trim(),
            sender: req.user._id,
            createdAt: new Date()
        };
        await conversation.save();

        const savedMessage = conversation.messages[conversation.messages.length - 1];

        res.status(201).json({
            status: 'success',
            data: { message: savedMessage }
        });
    } catch (error) {
        next(error);
    }
};
