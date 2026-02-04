import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    userType: {
        type: String,
        enum: ['client', 'provider'],
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    location: {
        city: String,
        state: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
}, {
    timestamps: true
});

// Hook que corre ANTES de guardar o usuário
// Encripta a password automaticamente
userSchema.pre('save', async function () {
    // Se a password não foi modificada, não faz nada
    if (!this.isModified('password')) return;
    // Encripta a password com força 10
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
