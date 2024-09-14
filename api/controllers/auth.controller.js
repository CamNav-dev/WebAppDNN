import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler, createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import CryptoJS from 'crypto-js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashPassword,
        creditCard: {
            number: '',
            expiry: '',
            cvv: ''
        }
    });

    try {
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            userId: savedUser._id,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(errorHandler(404, 'User not found'));

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return next(errorHandler(401, 'Invalid password'));

        // Generate a token that expires in 30 minutes
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

        // Exclude password from response
        const { password: hashPassword, ...userWithoutPassword } = user._doc;

        // Send token and user data in the response
        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            token,
            expiresIn: 30 * 60 * 1000 // 30 minutes in milliseconds
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    const { id } = req.params; // Get user ID from params

    try {
        // Find the user by ID and delete it
        const user = await User.findByIdAndDelete(id);

        // If user doesn't exist, throw an error
        if (!user) return next(errorHandler(404, 'User not found'));

        // Successful deletion
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error); // Pass error to error handler middleware
    }
};

// Update user
export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email, password, creditCard, role, country } = req.body;

    try {
        let user = await User.findById(id);

        if (!user) return next(errorHandler(404, 'User not found'));

        // Update fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (creditCard) user.creditCard = creditCard;
        if (role) user.role = role;
        if (country) user.country = country;

        // Handle password update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user
        const updatedUser = await user.save();

        // Remove password from response
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'User updated successfully',
            user: userResponse
        });
    } catch (error) {
        next(error);
    }
};

export const processPayment = async (req, res, next) => {
    const { id } = req.params;
    const { cardNumber, expiryDate, cvv } = req.body;

    if (!cardNumber || !expiryDate || !cvv) {
        return next(createError(400, 'All fields are required'));
    }

    // Encriptar los datos de la tarjeta
    const encryptedCardData = encryptCardData({
        number: cardNumber,
        expiry: expiryDate,
        cvv: cvv,
    });

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    'creditCard.number': encryptedCardData.number,
                    'creditCard.expiry': encryptedCardData.expiry,
                    // No almacenar el CVV de forma insegura
                    hasPaid: true
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(createError(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                hasPaid: updatedUser.hasPaid,
                creditCard: {
                    number: '**** **** **** ' + updatedUser.creditCard.number.slice(-4), // Mostrar solo los últimos 4 dígitos
                    expiry: updatedUser.creditCard.expiry,
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const secretKey = process.env.SECRET_KEY || 'your-secret-key';
export const encryptCardData = (cardData) => {
    const encryptedNumber = CryptoJS.AES.encrypt(cardData.number, secretKey).toString();
    const encryptedExpiry = CryptoJS.AES.encrypt(cardData.expiry, secretKey).toString();
    const encryptedCvv = CryptoJS.AES.encrypt(cardData.cvv, secretKey).toString();
  
    return {
      number: encryptedNumber,
      expiry: encryptedExpiry,
      cvv: encryptedCvv, // No se recomienda almacenar el CVV, pero en caso de hacerlo, debe estar encriptado
    };
  };
  
  // Para desencriptar:
  export const decryptCardData = (encryptedCardData) => {
    const decryptedNumber = CryptoJS.AES.decrypt(encryptedCardData.number, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedExpiry = CryptoJS.AES.decrypt(encryptedCardData.expiry, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedCvv = CryptoJS.AES.decrypt(encryptedCardData.cvv, secretKey).toString(CryptoJS.enc.Utf8);
  
    return {
      number: decryptedNumber,
      expiry: decryptedExpiry,
      cvv: decryptedCvv,
    };
  };