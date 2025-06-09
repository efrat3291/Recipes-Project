import { Model, Schema } from "mongoose";

const categorySchema = new Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    recipesAmount: { type: Number, default: 0 },
    recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
})
