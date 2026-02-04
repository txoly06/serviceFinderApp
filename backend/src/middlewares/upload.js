// ========================================
// CONFIGURAÇÃO DE UPLOAD - MULTER
// ========================================
// Middleware para upload de imagens
// Aceita: jpg, jpeg, png, webp (max 5MB)

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de uploads
const uploadsDir = path.join(__dirname, '../../uploads');

// Criar diretório se não existir
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Gera nome único: timestamp-random-extensão
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Filtro de tipos permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Use: JPG, PNG ou WebP'), false);
    }
};

// Configuração do Multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5 // Máximo 5 arquivos por vez
    }
});

export default upload;
