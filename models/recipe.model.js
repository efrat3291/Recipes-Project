import { model, Model, Schema } from "mongoose";
import {data, required, string} from "joi";

const layerSchema = new Schema({
    description: { type: String, required: true },
    ingredients: { type: [String], required: true }
})

const recipeSchema = new Scheama({
    name: { type: String, required: true },
    description: { type: String},
    category: { type: [String]},
    prepartionTime: { type: Number },
    difficultyLevel: { type: Number, enum: [1,2,3,4,5], required: true },
    addDate: { type: Date, default: Date.now },
    layersArr: { 
        type: [{
            description: { type: String},
            ingredients: { type: [String] }
        }] 
    },
    instructionArr: { type: [String] },
    img: { type: String },
    isPrivate: { type: Boolean, default: false },
    contributor: { 
       _id: { type: Schema.Types.ObjectId, ref: 'users' },
       name: String
    }
})
export default model('recipes', recipeSchema);

