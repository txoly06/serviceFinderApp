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

export default router;
