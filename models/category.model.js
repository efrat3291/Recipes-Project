import mongoose, { model, Schema } from "mongoose";
const categorySchema = new Schema({
    desc: { type: String, required: true },
    recipesCount: { type: Number, default: 0 },
    recipesArr: {
        type: [{
            _id: { type: Schema.Types.ObjectId, ref: 'recipes' },
            name: { type: String },
            desc: { type: String },
            contributorName: { type: String },
        }],
        default: []
    }
})
export default model('categories', categorySchema);