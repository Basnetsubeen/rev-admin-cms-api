import ProductSchema from "./ProductSchema.js";

//get product
export const getAllProducts = () => {
  return ProductSchema.find();
};

export const getSelectedProducts = (filter) => {
  return ProductSchema.find(filter);
};

export const getProductById = (_id) => {
  return ProductSchema.findById(_id);
};
export const getSingleProduct = (filter) => {
  return ProductSchema.find(filter);
};
//Insert Poducts
export const addProduct = (obj) => {
  return ProductSchema(obj).save();
};

//Update products
export const updateProductById = ({ _id, ...rest }) => {
  return ProductSchema.findByIdAndUpdate(_id, rest);
};
//Delete products
export const deleteProductById = (_id) => {
  return ProductSchema.findByIdAndDelete(_id);
};
