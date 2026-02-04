import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        required: true,
        enum: [
            'home-repairs',
            'beauty',
            'health',
            'education',
            'tech',
            'cleaning',
            'transport',
            'events',
            'other'
        ]
    },
    subcategory: String,
    priceRange: {
        min: {
            type: Number,
            default: 0
        },
        max: Number
    },
    images: [String],
    availability: {
        days: [String],
        hours: String
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    location: {
        city: String,
        state: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

serviceSchema.index({ category: 1, active: 1 });
serviceSchema.index({ 'location.city': 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
