import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    addFavorite,
    removeFavorite,
    getFavorites
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(protect);

// Perfil
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Favoritos
router.get('/favorites', getFavorites);
router.post('/favorites/:serviceId', addFavorite);
router.delete('/favorites/:serviceId', removeFavorite);

export default router;
