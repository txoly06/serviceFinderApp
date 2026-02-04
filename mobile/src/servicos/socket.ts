// ========================================
// SERVIÇO SOCKET.IO
// ========================================
// Gerencia conexão em tempo real para chat

import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/api';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
    if (socket?.connected) return socket;

    socket = io(API_URL, {
        auth: {
            token
        },
        transports: ['websocket'], // Força websocket para melhor performance
        autoConnect: true,
    });

    socket.on('connect', () => {
        console.log('🔌 Socket connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (err) => {
        console.log('⚠️ Socket connection error:', err.message);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        console.warn('Socket not initialized. Call initSocket(token) first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
