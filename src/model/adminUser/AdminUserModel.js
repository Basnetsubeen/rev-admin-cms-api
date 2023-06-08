import AdminUserSchema from "./AdminUserSchema.js";

//insert admin user
export const insertAdminUser = (obj) => {
  return AdminUserSchema(obj).save();
};

//Update admin user
export const updateAdminUser = (filter, update) => {
  return AdminUserSchema.findOneAndUpdate(filter, update, { new: true });
};

//login Admin User
export const findOneAdminUser = (filter) => {
  return AdminUserSchema.findOne(filter);
};
