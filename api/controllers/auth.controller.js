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

export const signin = async(req, res, next) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return next(errorHandler(404, 'User not found'));
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if(!isPasswordCorrect) return next(errorHandler(401, 'Invalid password'));
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const {password: hashPassword, ...rest} = user._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(user);
    }   catch(error){
        next(error);
    }
};