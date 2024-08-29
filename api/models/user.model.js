import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    identifier: {
        type: Number,
        required: true,
    },
    updated: {
        type: Date,
        required:true,
        default: Date.now,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;