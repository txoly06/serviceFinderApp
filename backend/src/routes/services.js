import { Router } from 'express';
import {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} from '../controllers/serviceController.js';
import { protect, restrictTo, optionalAuth } from '../middlewares/auth.js';

const router = Router();

// Optional auth for filtering by provider=me
router.get('/', optionalAuth, getServices);
router.get('/:id', getService);
router.post('/', protect, restrictTo('provider'), createService);
router.put('/:id', protect, restrictTo('provider'), updateService);
router.delete('/:id', protect, restrictTo('provider'), deleteService);

export default router;
