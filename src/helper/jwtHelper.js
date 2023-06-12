import jwt from "jsonwebtoken";
import {
  deleteSessiontable,
  insertAcessJwt,
} from "../model/session/SessionModel.js";
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

//verifying accessJWT
export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch ({ message }) {
    if (message === "jwt expired") {
      //delete the session table
      deleteSessiontable({
        type: "jwt",
        token,
      });
    }
    return message;
  }
};

//verifying accessJWT
export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    error.status = 500;
    message = error.message;
  }
};
