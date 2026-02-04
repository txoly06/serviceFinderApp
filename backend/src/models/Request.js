import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true
    },
    images: [String],
    scheduledDate: {
        type: Date,
        required: true
    },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    proposedPrice: Number
}, {
    timestamps: true
});

requestSchema.index({ clientId: 1, status: 1 });
requestSchema.index({ providerId: 1, status: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
