import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup = async(req, res, next) =>{
    const {username, email, password} = req.body;
    {/* Password encypted */}
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser =  new User({
        username,
        email,
        password: hashPassword
    });

    try{ 
        await newUser.save();
        res.status(200).json({message: 'User created successfully'});
    }   catch(error){
        next(error);
    }
};

export const signin = async(req, res, next) => {
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
