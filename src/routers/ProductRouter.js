import express from "express";
import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../model/product/ProductModel.js";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
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
    error.status = 500;
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

//Update product
router.put(
  "/",
  upload.array("newImages", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      const { body, files } = req;
      //First we filter out the images to be deleted form the previously exisiting images.
      let { images, imgToDelete } = body;
      images = images.split(",");
      imgToDelete = imgToDelete.split(",");

      images = images.filter((img) => imgToDelete.includes(img));

      //Second: If we add new images while editing, we need to loop it and add the path of images as we did in post product
      if (files) {
        const newImgs = files.map((img) => img.path.slice(6));

        // we need to add images left from deleting and add to new incoming images to make a new image array and store
        images = [...images, ...newImgs];
      }

      //overwiritng images the new images
      body.images = images;

      const product = await updateProductById(body);
      product?._id
        ? res.json({
            status: "success",
            message: "The product has been updated successfully",
          })
        : res.json({
            status: "error",
            message: "Unable to update the product, Please try again",
          });
    } catch (error) {
      error.status = 500;
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
