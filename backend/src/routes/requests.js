import { Router } from 'express';
import {
    createRequest,
    getMyRequests,
    updateRequestStatus
} from '../controllers/requestController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.use(protect);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.patch('/:id/status', updateRequestStatus);

export default router;
