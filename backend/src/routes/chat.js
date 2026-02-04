import { Router } from 'express';
import {
    getConversations,
    getOrCreateConversation,
    getMessages,
    sendMessage
} from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(protect);

// Listar conversas do usuário
router.get('/', getConversations);

// Criar ou obter conversa existente
router.post('/start', getOrCreateConversation);

// Obter mensagens de uma conversa
router.get('/:conversationId/messages', getMessages);

// Enviar mensagem (fallback HTTP)
router.post('/:conversationId/messages', sendMessage);

export default router;
