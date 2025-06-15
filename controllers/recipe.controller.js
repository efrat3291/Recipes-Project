import Recipe from '../models/recipe.model.js';
import Category from '../models/category.model.js';

export const getAllRecipes = async (req, res, next) => {
    try{
        const _id = req.myUser ? req.myUser._id : null;
        let { search, limit, page } = req.query;
        let query = { };
        if(_id){
            query.$or = [
                {isPrivate: false},
                {isPrivate: true, contributor: _id}
            ];
        }else{
            query.isPrivate = false;
        }
        if(search){
            query.name = { $regex: search, $options: 'i' };
        }
        limit = parseInt(limit) ||await Recipe.countDocuments();
        const skip = ((page ? parseInt(page) : 1) - 1) * limit;
        const recipes = await Recipe.find(query).skip(skip).limit(limit);
        res.status(200).json(recipes);
   
    }catch(error){
        next({message:error.message});
    }
}

export const getAllMyRecipes = async (req, res, next) => {
    try{
        const {_id} = req.myUser;
        if(!_id){
            return next({message: 'you must login to see your recipes', status: 401});
        }
        const recipes = await Recipe.find(r => r.contributor._id.toString() === _id.toString());
        res.status(200).json(recipes);
    }catch(error){
        {next({message: error.message});}       
    }
}

export const getRecipeById = async (req, res, next) => {
    try{
        const {_id} = req.params;
        const recipe = await Recipe.findById(_id);
        if(!recipe){
            return next({message: 'Recipe not found', status: 404});
        }
        res.status(200).json(recipe);
    }catch(error){
        next({message: error.message});
    }
}

export const getRecipeByPreparingTime = async (req, res, next) => {
    try{
        const { prepareTime } = req.body;
        const recipes = await Recipe.find(r => r.prepareTime <= prepareTime );
        res.status(200).json(recipes);
    }catch(error){  
        next({message: error.message});
    }   
}

export const addRecipe = async (req, res, next) => {
    try{
        if(!req.myUser){
            return next({message: 'you must login to add a recipe', status: 403});
        }
        const { _id, userName } = req.myUser;
        
        const { categories } = req.body;
        const categoryIds =[];
        const categoriesToUpdate =[];

        for (const c of categories) {
            let category = await Category.findOne({
                desc: { $regex: new RegExp(`^${c}$`,i)}                           
            })
            if(!category){
                category = await Category({desc: c});
                await category.save();
            }
            categoryIds.push(category._id);
            categoriesToUpdate.push(category);
        }   

        const recipeData = {
            ...req.body,
            contributor: {
                _id,
                name: userName
            },
            category: categoryIds
        };

        const newRecipe = new Recipe(recipeData);
        await newRecipe.save();

        for( const cat of categoriesToUpdate) {
            const recipeToPush = {
                _id: newRecipe._id,
                name: newRecipe.name,
                desc: newRecipe.description,
                contributor: newRecipe.contributor.name,
            };
            const updatedCategory = await Category.findByIdAndUpdate(
                {_id: cat._id, "recipesArr._id": {$ne: newRecipe._id}},
                {
                    $addToSet: { recipesArr: recipeToPush },
                    $inc: { recipesCount: 1 }
                },  
                { new: true }              
            );    
    }
    res.status(201).json(newRecipe);
}catch(error){
    next({message: error.message});
    }
}

export const updateRecipe = async (req, res, next) => {
    try{
        if(!req.myUser){
            return next({message: 'you must login to update a recipe', status: 403});
        }
        const { id } = req.params;
        const { _id } = req.myUser;
        const categories = req.body;
        if( id !== req.body._id ){
            return next({message: 'id conflict', status: 409});
        }
        const recipe = await Recipe.findById(id);
        if(!recipe){
            return next({message: 'Recipe not found', status: 404});
        }
        if(recipe.contributor._id.toString() !== _id.toString()){
            return next({message: "you can't update recipe that you don't own.", status: 403});
        }
        const updateRecipe = await Recipe.findByIdAndUpdate(id, {
            $set: {...recipe, ...req.body}
        })
         res.status(200).json(updateRecipe);   
    }catch(error){
        next({message: error.message});
    }
} 

export const deleteRecipe = async (req, res, next) => {
     try {
        if (!req.myUser)
            return next({ message: 'you must login to delete recipe', status: 403 })
        const { id } = req.params;
        const { _id } = req.myUser;
        if (id !== req.body._id)
            return next({ message: 'id conflict', status: 409 })
        const recipe = await Recipe.findById(id)
        if (!recipe)
            return next({ message: 'recipe not found', status: 404 })
        if (recipe.owner._id !== _id && myUser.role != 'admin')
            return next({ message: `you can't delete recipe that you don't own.`, status: 403 })
        for (const cat of recipe.categories) {
            const category = await Category.findById(cat);
            category.recipesCount -= 1;
            if (category.recipesCount === 0) {
                await Category.findByIdAndDelete(cat);
            }
            else {
                category.recipesArr = category.recipesArr.filter(
                    (r) => !r._id.equals(recipe._id)
                );
            }
            await category.save();
        }
        await Recipe.findByIdAndDelete(id)
        res.status(204).json({ message: 'Recipe deleted succesfully' })
    } catch (error) {
        next({ message: error.message })
    }
}