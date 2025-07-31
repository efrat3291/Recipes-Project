import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
const userSchema = new Schema({
    username: { type: String, required: true, minLength: 2, maxlength: 30 },
    password: {
        type: String,
        required: true,
        validate: {
            validator: v => /^[a-zA-Z0-9]{8,30}$/.test(v),
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+(com|net)$/]
    },
    address: {
        city: { type: String, default: '' },
        street: { type: String, default: '' },
        house: { type: Number, default: 0 },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
export const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const token = jwt.sign({ _id: user._id, role: user.role }, secretKey, { expiresIn: '24h' });
    return token;
}
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
})
export const JoiUserSchema = {
    register: Joi.object({
        username: Joi.string()
            .min(2)
            .max(30)
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .pattern(/^[a-zA-Z0-9]+$/)
            .required(),
        email: Joi.string()
            .email()
            .lowercase()
            .required(),
        address: Joi.object({
            city: Joi.string().allow(''),
            street: Joi.string().allow(''),
            house: Joi.number().default(0)
        }),
    }),

    login: Joi.object({
        email: Joi.string().lowercase().required(),
        password: Joi.string().required()
    })
};
export default model('users', userSchema)