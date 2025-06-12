import mongoose ,{ Model, Schema } from "mongoose";
import { number, required } from "joi";

const categorySchema = new Schema({
    description: {
         type: String,
         required: true },
    recipesAmount: {
         type: Number, 
         default: 0 },
    recipesArr: [{ 
        _id: {type: Schema.Types.ObjectId, ref:'recipes'},
        name: { type: String },
        description: { type: String },
        ingredientName: { type: String },
    }]
})
