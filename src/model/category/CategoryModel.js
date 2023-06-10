import CategorySchema from "./CategorySchema.js";

//Insert category
export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};

//Get single item
export const getCategoryById = (_id) => {
  return CategorySchema.findById(_id);
};

//Get categories
export const getAllCategories = () => {
  return CategorySchema.find();
};
