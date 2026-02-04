import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new AppError('Not authorized, no token', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('User not found', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401));
    }
};

export const restrictTo = (...userTypes) => {
    return (req, res, next) => {
        if (!userTypes.includes(req.user.userType)) {
            return next(new AppError('Not authorized for this action', 403));
        }
        next();
    };
};

// Optional auth - extracts user if token present, but doesn't require it
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Token invalid, continue without user
        next();
    }
};
