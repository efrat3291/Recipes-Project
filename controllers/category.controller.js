import Category from '../models/category.model.js';

export const getAllCategories = async (req, res, next) => {
    try{
        const categories = await Category.find();
        res.status(200).json(categories);
    }catch(error){
        next({message: error.message});
    }
}
export const getAllRecipesByCategory = async (req, res, next) => {
    try {
        const recipesByCategory = await Category.find.populate('recipes');
        res.status(200).json(recipesByCategory);
    } catch (error) {
        next({ message: error.message });
    }
};

export const getRecipesByCategoryId = async (req, res, next) => {
    try {
        const { _id } = req;
        const recipesByCategory = await Category.findById(_id).populate('recipes');
        res.status(200).json(recipesByCategory);
    } catch (error) {
        next({ message: error.message });
    }
};

