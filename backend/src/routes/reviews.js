import { Router } from 'express';
import {
    createReview,
    getServiceReviews,
    getMyReviews,
    addProviderResponse
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Rota pública - ver avaliações de um serviço
router.get('/service/:serviceId', getServiceReviews);

// Rotas protegidas
router.use(protect);

router.post('/', createReview);
router.get('/my', getMyReviews);
router.patch('/:id/response', addProviderResponse);

// Verificar se já existe avaliação para um pedido
router.get('/request/:requestId/exists', async (req, res) => {
    try {
        const Review = (await import('../models/Review.js')).default;
        const exists = await Review.exists({ requestId: req.params.requestId });
        res.json({ status: 'success', data: { exists: !!exists } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
});

export default router;
