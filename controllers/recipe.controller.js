import Recipe from '../models/recipe.model.js';
import Category from '../models/category.model.js';
import { addCategory, deleteCategory } from '../services/category.service.js';

export const getAllRecipes = async (req, res, next) => {
    try {
        const _id = req.myUser ? req.myUser._id : null;
        let { search, limit, page } = req.query;
        let query = {};
        let conditions = [];
        if (_id) {
            conditions.push({
                $or: [
                    { isPrivate: false },
                    { isPrivate: true, "contributor._id": _id }
                ]
            });
        } else {
            conditions.push({isPrivate: false});
        }
        if (search) {
            conditions.push({
                $or:[
                    {name:{$regex:search, $options: 'i'}},
                    {ingredients:{$regex:search, $options: 'i'}},
                    {desc:{$regex:search, $options: 'i'}}
                ]
            })
        }
        if (conditions.length > 0) {
            query = { $and: conditions };
        }
         const recipes = await Recipe.find(query)
            .sort({ publicationDate: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Recipe.countDocuments(query);
        res.status(200).json({
            recipes,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        next({ message: error.message });
    }
}

export const getAllMyRecipes = async (req, res, next) => {
    try {
        const _id = req.myUser.id;
        const query = { "contributor._id":  _id};
        const recipes = await Recipe.find(query);
        const total = await Recipe.countDocuments(query);
        res.status(200).json({
            recipes,
            total,
        });
    } catch (error) {
        { next({ message: error.message }); }
    }
}

export const getRecipeById = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const recipe = await Recipe.findById(_id);
        if (!recipe) {
            return next({ message: 'Recipe not found', status: 404 });
        }
        res.status(200).json(recipe);
    } catch (error) {
        next({ message: error.message });
    }
}

export const getRecipeByPreparingTime = async (req, res, next) => {
    try {
        const { prepareTime } = req.body;
        const recipes = await Recipe.find(r => r.prepareTime <= prepareTime);
        res.status(200).json(recipes);
    } catch (error) {
        next({ message: error.message });
    }
}

export const addRecipe = async (req, res, next) => {
    try {
        if (!req.myUser) {
            return next({ message: 'you must login to add a recipe', status: 403 });
        }
        const { _id, userName } = req.myUser;
        const  categories = req.body;
        const categoryIdsAndNames = [];
        const categoriesToUpdate = [];

        for (const category in categories) {
            const c  = await category.findOne({
                desc: { $regex: new RegExp(`^${c}$`, i) }
            });
            if (!c) {
                c = new Category({ desc: c});
                await c.save();
            }
            categoryIdsAndNames.push({_id: c._id, desc: c.desc });
            categoriesToUpdate.push(c);
        }

        const recipe = new Recipe({
            ...req.body,
            contributor: {
                _id,
                name: userName
            },
            category: categoryIdsAndNames
        });

        await recipe.save();
        categoriesToUpdate.forEach(async(c) => {
            c.recipesCount++;
            c.recipesArr.push({
                _id: recipe._id,
                name: recipe.name,
                desc: recipe.description,
                contributor: userName
            });
            await c.save();
        });
        res.status(201).json(recipe);
    } catch (error) {
        next({ message: error.message });
    }
};

export const updateRecipe = async (req, res, next) => {
    try {
        if (!req.myUser) {
            return next({ message: 'Login required to update a recipe', status: 403 });
        }
        const { id } = req.params;
        const { _id } = req.myUser._id;
        const newRecipeData = req.body;
        const { categories } = req.body;
        if (id !== req.body._id) {
            return next({ message: 'Recipe ID mismatch', status: 409 });
        }
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return next({ message: 'Recipe not found', status: 404 });
        }
        if (recipe.contributor._id.toString() !== _id.toString()) {
            return next({ message: 'You are not authorized to update this recipe', status: 403 });
        }

        const oldCategories = recipe.categories || [];
        for (const cat of oldCategories) {
            const category = await Category.findById(cat._id);
            if (category) {
                category.recipesCount--;
                category.recipesArr = category.recipesArr.filter(r => r._id.toString() !== id);
                if (category.recipesCount === 0) {
                    await Category.findByIdAndDelete(cat._id);
                }
                await category.save();
            }
        }
        const newCategories = newRecipeData.categories || [];
        for (const cat of newCategories) {
            const category = await Category.findById(cat._id);
            if (!category) {
                category = new Category({
                    desc: cat.categoryName,
                    recipesCount: 1,
                    recipesArr: [{
                        _id: id,
                        name: newRecipeData.name,
                        desc: newRecipeData.desc,
                        contributorName: req.myUser.userName
                    }]
                });
                await category.save();
            } else {
                const alreadyInCategory = category.recipesArr.some(r => r._id.toString() === id);
                if (!alreadyInCategory) {
                    category.recipesArr.push({
                        _id: recipe._id,
                        name: newRecipeData.name,
                        desc: newRecipeData.desc,
                        contributorName: newRecipeData.contributor?.name
                    });
                    category.recipesCount = category.recipesArr.length;
                    await category.save();
                }
            }
        }
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, newRecipeData, { new: true });
        res.status(200).json(updatedRecipe);
    }
    catch (error) {
        next({ message: error.message });
    }
};

export const deleteRecipe = async (req, res, next) => {
    try {
        if (!req.myUser) {
            return next({ message: 'Login required to delete a recipe', status: 403 });
        }
        const { id } = req.params;
        const { _id } = req.myUser;
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return next({ message: 'Recipe not found', status: 404 });
        }
        if (recipe.contributor._id.toString() !== _id.toString()) {
            return next({ message: 'You are not authorized to delete this recipe', status: 403 });
        }
        const recipeCategories = recipe.categories || [];
        for (const cat of recipeCategories) {
            const category = await Category.findById(cat._id);
            if (category) {
                category.recipesCount--;
                category.recipesArr = category.recipesArr.filter(r => r._id.toString() !== id);
                if (category.recipesCount === 0) {
                    await Category.findByIdAndDelete(cat._id);
                } else {
                    await category.save();
                }
            }
        }
        await Recipe.findByIdAndDelete(id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        next({ message: error.message });
    }
};