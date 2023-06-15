import express from "express";
import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
} from "../model/product/ProductModel.js";
import { newProductValidation } from "../middlewares/joi-validation/JoiValidation.js";
import slugify from "slugify";
import multer from "multer";
import fs from "fs";
const router = express.Router();

//setup multer validation and upload destination
const fileUploadDestination = "public/img/products";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let error = null;
    //validation test if needed ...
    callback(error, fileUploadDestination);
  },
  filename: (req, file, callback) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    callback(null, fullFileName);
  },
});

const upload = multer({ storage });

//Get all the products
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id ? await getProductById(_id) : await getAllProducts();
    res.json({
      status: "success",
      message: " Here is your products",
      products,
    });
  } catch (error) {
    next(error);
  }
});

//Insert product
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      const files = req.files;
      if (files.length) {
        //To store the images path to access easily
        const images = files.map((img) => img.path.slice(6));
        req.body.images = images;
        req.body.thumbnail = images[0];
      }

      const slug = slugify(req.body.name, { lower: true, trim: true });
      req.body.slug = slug;

      const result = await addProduct(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "New product has been added",
          })
        : res.json({
            status: "error",
            message: "Unable to add the products, please try later",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.message =
          "This is already another product with same name or slug, SKU, please use another one";
        error.status = 200;
      }

      next(error);
    }
  }
);

//Delete product
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const imgToDelete = req.body;
    // First delete the item  based on _id and the delete the images form diskStorage.
    const products = await deleteProductById(_id);
    // Delete the images from database.
    if (imgToDelete) {
      imgToDelete.map((item) => item && fs.unlinkSync("./public" + item));
    }
    products?._id
      ? res.json({
          status: "success",
          message: "The product has been sucessfully deleted.",
        })
      : res.json({
          status: "error",
          message: "The product cannot be deleted deleted, please try again",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
