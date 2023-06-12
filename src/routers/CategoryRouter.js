import express from "express";
import {
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  hasChildCategoryById,
  insertCategory,
  updateCategoryById,
} from "../model/category/CategoryModel.js";
import {
  categoryValidation,
  updatecategoryValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import slugify from "slugify";

const router = express.Router();

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

// Update category
router.put("/", updatecategoryValidation, async (req, res, next) => {
  try {
    if (req.body.parentId) {
      const hasChildCategory = await hasChildCategoryById(req.body._id);
      if (hasChildCategory) {
        return res.json({
          status: "error",
          message:
            "This category has a child categories, please delete or re assign them to another category before taking the action",
        });
      }
    }

    const category = await updateCategoryById(req.body);
    category?._id
      ? res.json({
          status: "success",
          message: "The item has been updated successfully.",
        })
      : res.json({
          status: "error",
          message: "Unable to update. Please try again !",
        });
  } catch (error) {
    next(error);
  }
});
// Delete category
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const hasChildCategory = await hasChildCategoryById(_id);
    if (hasChildCategory) {
      return res.json({
        status: "error",
        message:
          "This category has child category, You cannot delete this category.",
      });
    }
    const category = await deleteCategoryById(_id);
    category?._id
      ? res.json({
          status: "success",
          message: "The item has been deleted successfully.",
        })
      : res.json({
          status: "error",
          message: "Unable to delete. Please try again !",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
