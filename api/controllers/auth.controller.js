import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
export const signup = async(req,res) =>{
    const {username, email, password} = req.body;
    {/* Password encypted */}
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser =  new User({
        username,
        email,
        password: hashPassword
    });
    await newUser.save();
    res.status(201).json({message: 'User created successfully'});
}