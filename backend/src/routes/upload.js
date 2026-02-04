// ========================================
// ROTAS DE UPLOAD
// ========================================
// Endpoints para upload de imagens

import express from 'express';
import upload from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// ========================================
// POST /api/upload
// ========================================
// Upload de uma ou múltiplas imagens
// Retorna array de URLs das imagens
router.post('/', protect, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Nenhum arquivo enviado'
        });
    }

    // Gerar URLs para as imagens
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

    res.status(201).json({
        status: 'success',
        data: {
            images: imageUrls
        }
    });
});

// ========================================
// POST /api/upload/single
// ========================================
// Upload de uma única imagem
router.post('/single', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Nenhum arquivo enviado'
        });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({
        status: 'success',
        data: {
            image: imageUrl
        }
    });
});

export default router;
