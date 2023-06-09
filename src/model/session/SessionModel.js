import SessionSchema from "./SessionSchema.js";

//Insert accessJWT token
export const insertAcessJwt = (obj) => {
  return SessionSchema(obj).save();
};
