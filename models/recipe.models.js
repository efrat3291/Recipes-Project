import { Model, Schema } from "mongoose";

const layerSchema = new Schema({
    description: { type: String, required: true },
    ingredients: { type: [String], required: true }
})

const recipeSchema = new Scheama({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    prepartionTime: { type: Number, required: true },
    difficultyLevel: { type: Number, enum: [1,2,3,4,5], required: true },
    addDate: { type: Date, default: Date.now },
    layers: { type: [layerSchema], required: true },
    ingredients: { type: [String], required: true },
    image: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})