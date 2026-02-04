import Review from '../models/Review.js';
import Request from '../models/Request.js';
import Service from '../models/Service.js';
import catchAsync from '../utils/catchAsync.js';

// ========================================
// CRIAR AVALIAÇÃO
// ========================================
// POST /api/reviews
// Cria uma nova avaliação após serviço concluído
export const createReview = catchAsync(async (req, res) => {
    const { requestId, rating, comment, categories } = req.body;

    // Verificar se o pedido existe e está concluído
    const request = await Request.findById(requestId);
    if (!request) {
        return res.status(404).json({
            status: 'fail',
            message: 'Pedido não encontrado'
        });
    }

    if (request.status !== 'completed') {
        return res.status(400).json({
            status: 'fail',
            message: 'Só é possível avaliar serviços concluídos'
        });
    }

    // Verificar se o utilizador é o cliente do pedido
    if (request.clientId.toString() !== req.user.id) {
        return res.status(403).json({
            status: 'fail',
            message: 'Apenas o cliente pode avaliar este serviço'
        });
    }

    // Verificar se já existe avaliação para este pedido
    const existingReview = await Review.findOne({ requestId });
    if (existingReview) {
        return res.status(400).json({
            status: 'fail',
            message: 'Este serviço já foi avaliado'
        });
    }

    // Criar a avaliação
    const review = await Review.create({
        requestId,
        clientId: req.user.id,
        serviceId: request.serviceId,
        providerId: request.providerId,
        rating,
        comment,
        categories
    });

    // Atualizar média de avaliações do serviço
    const allReviews = await Review.find({ serviceId: request.serviceId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Service.findByIdAndUpdate(request.serviceId, {
        'rating.average': avgRating,
        'rating.count': allReviews.length
    });

    res.status(201).json({
        status: 'success',
        data: { review }
    });
});

// ========================================
// BUSCAR AVALIAÇÕES DE UM SERVIÇO
// ========================================
// GET /api/reviews/service/:serviceId
export const getServiceReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
        .populate('clientId', 'name')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });
});

// ========================================
// BUSCAR MINHAS AVALIAÇÕES
// ========================================
// GET /api/reviews/my
export const getMyReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ clientId: req.user.id })
        .populate('serviceId', 'title category')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });
});

// ========================================
// RESPOSTA DO PRESTADOR
// ========================================
// PATCH /api/reviews/:id/response
export const addProviderResponse = catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            status: 'fail',
            message: 'Avaliação não encontrada'
        });
    }

    // Verificar se o utilizador é o prestador
    if (review.providerId.toString() !== req.user.id) {
        return res.status(403).json({
            status: 'fail',
            message: 'Apenas o prestador pode responder'
        });
    }

    review.response = req.body.response;
    await review.save();

    res.status(200).json({
        status: 'success',
        data: { review }
    });
});
