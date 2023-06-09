import jwt from "jsonwebtoken";
import { insertAcessJwt } from "../model/session/SessionModel.js";
import { updateAdminUser } from "../model/adminUser/AdminUserModel.js";

//Creating accessJWT tokens
export const signAccessJWT = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  await insertAcessJwt(obj);
  return accessJWT;
};

//Creating refreshJWT tokens
export const signrefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  await updateAdminUser(payload, { refreshJWT });
  return refreshJWT;
};

//Combining both tokens
export const createJWSToken = async (payload) => {
  return {
    accessJWT: await signAccessJWT(payload),
    refreshJWT: await signrefreshJWT(payload),
  };
};
