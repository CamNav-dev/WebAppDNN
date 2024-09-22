import mongoose from "mongoose";

// Constants for membership types and limits
const MEMBERSHIP_TYPES = {
    SMALL_BUSINESS: 'plan pequeña empresa',
    MEDIUM_BUSINESS: 'plan mediana empresa',
    UNLIMITED: 'plan grande empresa'
};

const FILE_LIMITS = {
    [MEMBERSHIP_TYPES.SMALL_BUSINESS]: 2,
    [MEMBERSHIP_TYPES.MEDIUM_BUSINESS]: 5,
    [MEMBERSHIP_TYPES.UNLIMITED]: Infinity
};

const RETENTION_PERIOD_DAYS = 90; // 3 months

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    creditCard: {
        number: { type: String, default: '' },  // valor por defecto vacío
        expiry: { type: String, default: '' },
        cvv: { type: String, default: '' },
    },
    role: {
        type: String,
    },
    country: {
        type: String,
    },
    profileImage: {
        type: String,
        default: ''
    },
    membershipType: {
        type: String,
        enum: Object.values(MEMBERSHIP_TYPES),
        required: true
    },
    lastUploadDate: {
        type: Date,
        default: null
    },
    uploadCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;