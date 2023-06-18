import express from "express";
import {
  findOneAdminUser,
  insertAdminUser,
  updateAdminUser,
} from "../model/adminUser/AdminUserModel.js";
import { comparePassword, hashPassword } from "../helper/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminUserValidation,
  updateAdminPasswordUserValidation,
  updateAdminUserValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  userVerificationNotification,
  verificationEmail,
} from "../helper/emailHelper.js";
import {
  createJWSToken,
  signAccessJWT,
  verifyRefreshJWT,
} from "../helper/jwtHelper.js";
import { authMiddleware } from "../middlewares/auth-middleware/AuthMiddleware.js";

const router = express.Router();

//Get admin user
router.get("/", authMiddleware, (req, res, next) => {
  try {
    const user = req.adminInfo;
    user.password = undefined;
    user.refreshJWT = undefined;
    res.json({
      status: "success",
      message: "Here is ypur user.",
      user,
    });
  } catch (error) {
    error.status = 500;
    next();
  }
});

//Inserted the admin user, hash the password, generated unique code and send url linking to frontend to verify
router.post("/", newAdminUserValidation, async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = hashPassword(password);
    req.body.emailValidationCode = uuidv4();
    const user = await insertAdminUser(req.body);
    if (user?._id) {
      res.json({
        status: "success",
        message:
          "The user has been created successfully. We have send you a link to verify. Please check your email including spam.",
      });
      const url = `${process.env.ROOT_DOMAIN}/admin/verify-email?c=${user.emailValidationCode}&e=${user.email}`;
      verificationEmail({
        email: user.email,
        fName: user.fName,
        url,
      });
      return;
    }
    res.json({
      status: "error",
      message: "Unable to create user. Please try again !",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.status = 200;
      error.message =
        "There is already another user with this email. Please try another email.";
    }
    next(error);
  }
});

//verify admin user
router.patch(
  "/verify-email",
  emailVerificationValidation,
  async (req, res, next) => {
    try {
      const { email, emailValidationCode } = req.body;
      const user = await updateAdminUser(
        { email, emailValidationCode },
        { status: "active", emailValidationCode: "" }
      );
      user?._id
        ? res.json({
            status: "success",
            message: "The user has been verified. You may login now.",
          }) && userVerificationNotification(user)
        : res.json({
            status: "error",
            message: "Invalid or expaired link, no action was taken.",
          });
    } catch (error) {
      next(error);
    }
  }
);

//Login admin user
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findOneAdminUser({ email });

    if (user?._id) {
      if (user.status !== "active") {
        res.json({
          status: "error",
          message:
            "Your account has not been verified, Please verify your account through link.",
        });
      }
      const isMatched = await comparePassword(password, user.password);
      if (isMatched) {
        user.password = undefined;

        const jwts = await createJWSToken({ email });
        return res.json({
          status: "success",
          message: "Login successfully",
          user,
          ...jwts,
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid credentials.",
    });
  } catch (error) {
    next(error);
  }
});

//Update admin profile
router.put(
  "/",
  authMiddleware,
  updateAdminUserValidation,
  async (req, res, next) => {
    try {
      const { _id, ...rest } = req.body;

      const result = await updateAdminUser({ _id }, rest);
      result?._id
        ? res.json({
            status: "success",
            message: "The user has been updated",
          })
        : res.json({
            status: "error",
            message: "Unable to update the user profile, Please try again!!",
          });
    } catch (error) {
      next(error);
    }
  }
);

//Update admin user Password
router.patch(
  "/",
  authMiddleware,
  updateAdminPasswordUserValidation,
  async (req, res, next) => {
    try {
      const { password, _id, newPassword } = req.body;
      const userId = req.adminInfo._id.toString();
      if (_id !== userId) {
        return res.status(401).json({
          status: "error",
          message: "Invalid user request",
        });
      }
      const passwordFromDB = req.adminInfo.password;
      const isMatched = comparePassword(password, passwordFromDB);

      if (isMatched) {
        const hashedPassword = hashPassword(newPassword);
        const result = await updateAdminUser(
          { _id },
          {
            password: hashedPassword,
          }
        );
        if (result?._id) {
          return res.json({
            status: "success",
            message: "Password has been successfully updated",
          });
        }
      }
      res.json({
        status: "error",
        message: "Unable to update the passsord. please try again!!",
      });
    } catch (error) {
      error.status = 401;
      next(error);
    }
  }
);
//Generate new accessJWT key for adminuser
router.get("/accessJwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      //First verify token received in authorization
      const decoded = verifyRefreshJWT(authorization);
      if (decoded?.email) {
        //After verying token, find the adminUser based on decoded email
        const user = await findOneAdminUser({ email: decoded.email });
        //Once you find user, generate a new accessJWT for admin
        if (user?._id) {
          return res.json({
            status: "success",
            accessJWT: await signAccessJWT({ email: decoded.email }),
          });
        }
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthenticated",
    });
  } catch (error) {
    error.status = 401;
    next();
  }
});
export default router;
