import SessionSchema from "./SessionSchema.js";

//Insert accessJWT token
export const insertAcessJwt = (obj) => {
  return SessionSchema(obj).save();
};

//Update session table
export const getSessiontable = (filter) => {
  return SessionSchema.findOne(filter);
};

//Delete session table
export const deleteSessiontable = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
