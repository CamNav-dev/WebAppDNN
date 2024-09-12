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
    updated: {
        type: Date,
        required:true,
        default: Date.now,
    },
    paymentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentInfo'
    }
});

const User = mongoose.model('User', userSchema);

export default User;