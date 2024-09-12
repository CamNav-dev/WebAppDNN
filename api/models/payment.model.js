import mongoose from "mongoose";

const paymentInfoSchema = new mongoose.Schema({
    cardHolder: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const PaymentInfo = mongoose.model('PaymentInfo', paymentInfoSchema);

export default PaymentInfo;
