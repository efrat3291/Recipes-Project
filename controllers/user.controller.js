import Joi from "joi";
import User, { generateToken, JoiUserSchema } from "../models/user.model.js";
import bcrypt from 'bcrypt';

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
        const {userName, email, password, address} = req.body;
        const user = await users.findOne({email});
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
        const user = await users.findByIdAndDelete(id);
        if(!user){
            return next({message: "User not found", status: 404});
        }
        res.json({message: "User deleted successfully"});
    }
    catch(err){
        next({message: err.message});
    }
}

export const updateUser = async(req, res, next) => {
    try{
        const {id} = req.params;
        const {password} = req.body;
        if(req.myUser._id !== id){
            return next({message: "No Access permission", status: 403}); 
        }
        if(JoiUserSchema.login.extract('password').validate(password).error){
            return next({message: "Invalid password", status: 400});
        }
        const user = await User.findById(id);
        if(!user){
            return next({message: "User not found", status: 404});
        }
        user.password = password;
        await user.save();

        
    }catch(error){
        next({message: error.message});
    }
    

}