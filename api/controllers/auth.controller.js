import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler, createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const { id } = req.params;  // El ID del usuario que se va a actualizar
    const { username, email, password, creditCard, role, country } = req.body;  // Agregar los campos faltantes

    try {
        // Buscar el usuario en la base de datos por su ID
        let user = await User.findById(id);

        if (!user) return next(errorHandler(404, 'User not found'));  // Si el usuario no se encuentra, lanzar error

        // Actualizar los campos solo si se proporcionan
        if (username) user.username = username;
        if (email) user.email = email;

        // Rehashear la contraseña si se proporciona una nueva
        if (password) {
            const hashPassword = bcrypt.hashSync(password, 10);
            user.password = hashPassword;
        }

        // Actualización de otros campos opcionales
        if (creditCard) user.creditCard = creditCard;
        if (role) user.role = role;
        if (country) user.country = country;

        // Guardar el usuario actualizado en la base de datos
        const updatedUser = await user.save();

        // Enviar una respuesta de éxito con el usuario actualizado
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser  // Devuelve los datos del usuario actualizado
        });
    } catch (error) {
        next(error);  // En caso de error, manejarlo con el middleware de error
    }
};

export const processPayment = async (req, res, next) => {
    const { id } = req.params;
    const { cardNumber, expiryDate, cvv } = req.body;

    if (!cardNumber || !expiryDate || !cvv) {
        return next(createError(400, 'All fields are required'));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    'creditCard.number': cardNumber,
                    'creditCard.expiry': expiryDate,
                    // Note: It's not recommended to store CVV
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
                    number: updatedUser.creditCard.number,
                    expiry: updatedUser.creditCard.expiry,
                }
            }
        });
    } catch (error) {
        next(error);
    }
};