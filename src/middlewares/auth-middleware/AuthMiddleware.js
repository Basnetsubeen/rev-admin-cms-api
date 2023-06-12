// 1. Receive authoriztion as a headers
// 2. Pass the authorozation to verify the accessJWT
//3. wheather vaild or no check on the session table
//.If valid, find that adminuser and send admin info as a req.info and give access to user

import { verifyAccessJWT } from "../../helper/jwtHelper.js";
import { findOneAdminUser } from "../../model/adminUser/AdminUserModel.js";
import { getSessiontable } from "../../model/session/SessionModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = await verifyAccessJWT(authorization);
    if (decoded === "jwt expired") {
      return res.status(403).json({
        status: "error",
        message: "jwt expired",
      });
    }
    if (decoded?.email) {
      const existInDb = await getSessiontable({
        type: "jwt",
        token: authorization,
      });
      if (existInDb?._id) {
        const adminInfo = await findOneAdminUser({ email: decoded.email });
        if (adminInfo?._id) {
          req.adminInfo = adminInfo;
          return next();
        }
      }
    }
    res.status(401).res.json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    error.status = 500;
    next();
  }
};
