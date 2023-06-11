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

//update category
export const updateCategoryById = ({ _id, ...update }) => {
  return CategorySchema.findByIdAndUpdate(_id, update, { new: true });
};
//has child category
export const hasChildCategoryById = async (parentId) => {
  const category = await CategorySchema.findOne({ parentId });
  return category?._id ? true : false;
};

//Delete category
export const deleteCategoryById = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};
