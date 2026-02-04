import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { generateToken } from '../utils/jwt.js';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(9),
    userType: z.enum(['client', 'provider'])
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const register = async (req, res, next) => {
    try {
        const validated = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email: validated.email });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        const user = await User.create(validated);
        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userType: user.userType
                },
                token
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const validated = loginSchema.parse(req.body);

        const user = await User.findOne({ email: validated.email }).select('+password');
        if (!user || !(await user.comparePassword(validated.password))) {
            return next(new AppError('Invalid email or password', 401));
        }

        const token = generateToken(user._id);

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userType: user.userType
                },
                token
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    res.json({
        status: 'success',
        data: { user: req.user }
    });
};
