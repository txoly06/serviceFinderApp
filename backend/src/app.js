import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import requestRoutes from './routes/requests.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';
import errorHandler from './middlewares/errorHandler.js';
import AppError from './utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler - apanha rotas que não existem
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
