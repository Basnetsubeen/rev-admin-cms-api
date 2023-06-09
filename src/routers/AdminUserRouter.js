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
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  userVerificationNotification,
  verificationEmail,
} from "../helper/emailHelper.js";
import { createJWSToken } from "../helper/jwtHelper.js";

const router = express.Router();

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

export default router;
