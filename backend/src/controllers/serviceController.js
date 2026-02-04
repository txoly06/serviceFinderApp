import Service from '../models/Service.js';
import AppError from '../utils/AppError.js';
import { z } from 'zod';

const createServiceSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.enum([
        'home-repairs', 'beauty', 'health', 'education',
        'tech', 'cleaning', 'transport', 'events', 'other'
    ]),
    subcategory: z.string().optional(),
    priceRange: z.object({
        min: z.number().min(0),
        max: z.number().optional()
    }).optional(),
    location: z.object({
        city: z.string(),
        state: z.string()
    }).optional()
});

export const getServices = async (req, res, next) => {
    try {
        const { category, city, search, page = 1, limit = 10, provider } = req.query;
        const query = { active: true };

        if (category) query.category = category;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (search) query.title = new RegExp(search, 'i');

        // Provider filter - requires auth token for 'me'
        if (provider === 'me' && req.user) {
            query.providerId = req.user._id;
            delete query.active; // Show all services for owner
        } else if (provider) {
            query.providerId = provider;
        }

        const skip = (page - 1) * limit;
        const services = await Service.find(query)
            .populate('providerId', 'name avatar')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ 'rating.average': -1 });

        const total = await Service.countDocuments(query);

        res.json({
            status: 'success',
            results: services.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: { services }
        });
    } catch (error) {
        next(error);
    }
};

export const getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('providerId', 'name email phone avatar location');

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        res.json({
            status: 'success',
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

export const createService = async (req, res, next) => {
    try {
        const validated = createServiceSchema.parse(req.body);
        const service = await Service.create({
            ...validated,
            providerId: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: { service }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const updateService = async (req, res, next) => {
    try {
        const service = await Service.findOneAndUpdate(
            { _id: req.params.id, providerId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return next(new AppError('Service not found or not authorized', 404));
        }

        res.json({
            status: 'success',
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findOneAndDelete({
            _id: req.params.id,
            providerId: req.user._id
        });

        if (!service) {
            return next(new AppError('Service not found or not authorized', 404));
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
