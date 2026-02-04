import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Conversation from './models/Conversation.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Middleware de autenticação
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.user.name} (${socket.user._id})`);

        // Entrar em uma sala de conversa
        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`👤 ${socket.user.name} joined room: ${conversationId}`);
        });

        // Sair de uma sala
        socket.on('leave_conversation', (conversationId) => {
            socket.leave(conversationId);
        });

        // Enviar mensagem
        socket.on('send_message', async (data) => {
            try {
                const { conversationId, content } = data;

                // Salvar no banco (mesma lógica do Controller)
                const conversation = await Conversation.findById(conversationId);
                if (!conversation) return;

                const newMessage = {
                    sender: socket.user._id,
                    content,
                    read: false,
                    createdAt: new Date()
                };

                conversation.messages.push(newMessage);
                conversation.lastMessage = {
                    content,
                    sender: socket.user._id,
                    createdAt: new Date()
                };

                await conversation.save();

                // Obter a mensagem salva (o último item)
                const savedMsg = conversation.messages[conversation.messages.length - 1];

                // Emitir para todos na sala (incluindo quem enviou, para confirmar)
                io.to(conversationId).emit('new_message', {
                    _id: savedMsg._id,
                    content: savedMsg.content,
                    sender: {
                        _id: socket.user._id,
                        name: socket.user.name
                    },
                    createdAt: savedMsg.createdAt
                });

                // Notificar o outro participante (fora da sala atual, talvez na lista de conversas)
                const otherParticipant = conversation.participants.find(
                    p => p.toString() !== socket.user._id.toString()
                );

                // (Opcional) Poderíamos emitir um evento global para notificação push aqui

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Erro ao enviar mensagem' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.name}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
