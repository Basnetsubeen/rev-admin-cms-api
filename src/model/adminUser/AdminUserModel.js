import AdminUserSchema from "./AdminUserSchema.js";

//insert admin user
export const insertAdminUser = (obj) => {
  return AdminUserSchema(obj).save();
};

//Update admin user to verify email
export const updateAdminUser = (filter, update) => {
  return AdminUserSchema.findOneAndUpdate(filter, update, { new: true });
};

//login Admin User
export const findOneAdminUser = (filter) => {
  return AdminUserSchema.findOne(filter);
};

//Get all admin users
export const getAllAdminUser = () => {
  return AdminUserSchema.find();
};

//delete admin users
export const deleteAdminUser = (_id) => {
  return AdminUserSchema.findByIdAndDelete(_id);
};
