import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
    categories: {
        quality: {
            type: Number,
            min: 1,
            max: 5
        },
        punctuality: {
            type: Number,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    images: [String],
    response: String
}, {
    timestamps: true
});

reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ providerId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
