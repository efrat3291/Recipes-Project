import mongoose, { model, Schema } from "mongoose";
const recipeSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String },
    categories: [{
        _id: { type: Schema.Types.ObjectId, ref: 'categories' },
        categoryName: String
    }],
    preparationTime: { type: Number },
    level: { type: Number, enum: [1, 2, 3, 4, 5] },
    publicationDate: { type: Date, default: Date.now() },
    layersArr: {
        type: [{
            desc: { type: String },
            ingredients: { type: [String] }
        }]
    },
    instructionsArr: { type: [String] },
    img: { type: String },
    isPrivate: { type: Boolean },
    contributor: {
        _id: { type: Schema.Types.ObjectId, ref: 'users' },
        name: String
    }
})
export default model('recipes', recipeSchema)