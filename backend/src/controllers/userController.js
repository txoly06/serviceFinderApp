import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(9).optional(),
    location: z.object({
        city: z.string(),
        state: z.string()
    }).optional()
});

// Obter perfil do usuário atual
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites', 'title category priceRange rating');

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// Atualizar perfil do usuário
export const updateProfile = async (req, res, next) => {
    try {
        const validated = updateProfileSchema.parse(req.body);

        const user = await User.findByIdAndUpdate(
            req.user._id,
            validated,
            { new: true, runValidators: true }
        );

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

// Adicionar serviço aos favoritos
export const addFavorite = async (req, res, next) => {
    try {
        const { serviceId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favorites: serviceId } },
            { new: true }
        ).populate('favorites', 'title category priceRange rating');

        res.json({
            status: 'success',
            data: { favorites: user.favorites }
        });
    } catch (error) {
        next(error);
    }
};

// Remover serviço dos favoritos
export const removeFavorite = async (req, res, next) => {
    try {
        const { serviceId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favorites: serviceId } },
            { new: true }
        ).populate('favorites', 'title category priceRange rating');

        res.json({
            status: 'success',
            data: { favorites: user.favorites }
        });
    } catch (error) {
        next(error);
    }
};

// Obter lista de favoritos
export const getFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites', 'title category description priceRange rating location');

        res.json({
            status: 'success',
            data: { favorites: user.favorites || [] }
        });
    } catch (error) {
        next(error);
    }
};
