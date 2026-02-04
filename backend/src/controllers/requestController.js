import Request from '../models/Request.js';
import Service from '../models/Service.js';
import AppError from '../utils/AppError.js';
import { z } from 'zod';

const createRequestSchema = z.object({
    serviceId: z.string(),
    description: z.string().min(10),
    scheduledDate: z.string().transform(v => new Date(v)),
    location: z.object({
        address: z.string()
    }).optional()
});

export const createRequest = async (req, res, next) => {
    try {
        const validated = createRequestSchema.parse(req.body);

        const service = await Service.findById(validated.serviceId);
        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        const request = await Request.create({
            ...validated,
            clientId: req.user._id,
            providerId: service.providerId
        });

        res.status(201).json({
            status: 'success',
            data: { request }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getMyRequests = async (req, res, next) => {
    try {
        const query = req.user.userType === 'client'
            ? { clientId: req.user._id }
            : { providerId: req.user._id };

        const requests = await Request.find(query)
            .populate('serviceId', 'title category')
            .populate('clientId', 'name phone')
            .populate('providerId', 'name phone')
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            results: requests.length,
            data: { requests }
        });
    } catch (error) {
        next(error);
    }
};

export const updateRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        const request = await Request.findOneAndUpdate(
            { _id: req.params.id, providerId: req.user._id },
            { status },
            { new: true }
        );

        if (!request) {
            return next(new AppError('Request not found or not authorized', 404));
        }

        res.json({
            status: 'success',
            data: { request }
        });
    } catch (error) {
        next(error);
    }
};
