import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const userSchema = new Schema({
    name: {type: String, required: true, minlength: 2, maxlength: 30},
    email: {
        type: String, 
        required: true, 
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+(com|net)$/]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: v => /^[a-zA-Z0-9]{8,30}$/.test(v),
        }
    },
    address: {
        city: String,
        street: String,
        house: Number
    },
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
})

userSchema.pre('sava', async function(){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
})

export const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY';
    const token = jwt.sign({ _id: user._id, role: user.role }, secretKey, { expiresIn: '24h' });
    return token;
}

export const JoiUserSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().min(2).max(30).required(),
        password: Joi.string()
                .min(8) 
                .max(30)
                .pattern(/^[a-zA-Z0-9]+$/)  
                .required(),
        email: Joi.string()
              .email()
              .lowercase()
              .required()        
}),
    login: Joi.object({
        email: Joi.string()
              .email()
              .lowercase()
              .required(),
        password: Joi.string() 
                .required(),
    })
})

export const JoiPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      "any.required": "Password is required",
    }),
});

export default model('users', userSchema);