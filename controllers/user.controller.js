import User, { generateToken, JoiPasswordSchema, JoiUserSchema } from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(error){
        next({message: error.message});
    }
}

export const signUp = async (req, res, next) => {
    try{
        const valid = JoiUserSchema.register.validate(req.body);
        if(valid.error){
            return next({message: valid.error, status: 400});
        }
        const {userName, email, password, address} = valid.value;
        const user = new User({userName, email, password, address});
        await user.save();
        const token = generateToken(user);
        res.status(201).json({userName: user.userName, token})
    }
    catch(error){
        next({message: error.message});
    }
}

export const signIn = async (req, res, next) => {
    try{
        if(JoiUserSchema.login.validate(req.body).error){
            return next({message: "Invalid data", status: 400});
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return next({message: "User not found", status: 401});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return next({message: "password is not correct", status: 401});
        }
        const token = generateToken(user);
        res.status(200).json({username: user.username, token});
    }
    catch(error){
        next({message: error.message});
    }
}

export const deleteUser = async (req, res, next) => {
    try{
        const {id} = req.params;
        if(req.myUser._id !== id){
            return next({message: "No Access permission", status: 403}); 
        }
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return next({message: "User not found", status: 404});
        }
        res.json({message: "User deleted successfully"});
    }
    catch(error){
        next({message: error.message});
    }
}

export const updateUser = async(req, res, next) => {
    try{
        const {id} = req.params;
        const {password} = req.body;
        if(req.myUser._id !== id){
            return next({message: "No Access permission", status: 403}); 
        }
        const {error} = JoiPasswordSchema.validate({password});
        if(error){
            return next({message: error.message, status: 400});
        }
        const user = await User.findById(id);
        if(!user){
            return next({message: "User not found", status: 404});
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(204).end();        
    }catch(error){
        next({message: error.message});
    }
    

}