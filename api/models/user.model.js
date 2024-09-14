import mongoose from "mongoose";
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;