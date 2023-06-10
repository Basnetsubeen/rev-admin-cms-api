import express from "express";
import {
  getAllCategories,
  getCategoryById,
  insertCategory,
} from "../model/category/CategoryModel.js";
import { categoryValidation } from "../middlewares/joi-validation/JoiValidation.js";
import slugify from "slugify";

const router = express.Router();

//Instert category
router.post("/", categoryValidation, async (req, res, next) => {
  try {
    const { name } = req.body;
    req.body.slug = slugify(name, {
      lower: true,
      trim: true,
    });
    const result = await insertCategory(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "The item has been inserted successfully.",
        })
      : res.json({
          status: "error",
          message: "The item has not been inserted. Please try again !",
        });
  } catch (error) {
    next(error);
  }
});

//Get category
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const categories = _id
      ? await getCategoryById(_id)
      : await getAllCategories();
    res.json({
      status: "success",
      message: "Here are your categories.",
      categories,
    });
  } catch (error) {
    error.status = 500;
    next();
  }
});

export default router;
