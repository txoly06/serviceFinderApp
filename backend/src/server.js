import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { initSocket } from './socket.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    // Criar servidor HTTP explicitamente para unir Express + Socket.IO
    const httpServer = createServer(app);

    // Inicializar Socket.IO
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`🔌 Socket.IO enabled`);
    });
};

startServer();
