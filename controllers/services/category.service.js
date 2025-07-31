import Category from '../../models/category.model.js';
export const deleteCategory = async (categoryId, next) => {
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            next({ message: 'Category not found', status: 404 });
        }
    } catch (error) {
        next({ message: error.message });
    }
};

export const addCategory = async (categoryDesc, recipe, next) => {
    try {
        const newCategory = new Category({ desc: categoryDesc });
        await newCategory.save();
        const category = await Category.findOne({ desc: categoryDesc });
        if (!category) {
            return next({ message: 'Category not found after creation', status: 404 });
        }
        category.recipesArr.push(recipe);
        category.recipesCount++;
        return newCategory;
    } catch (error) {
        next({ message: error.message });
    }
}