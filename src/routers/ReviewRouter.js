import express from "express";

const router = express.Router();

const reviewArgs = [
  {
    _id: "sd3435df",
    review: "some review for this product.",
    productId: "sdf67",
    productName: "Iphone seven",
    rating: 5,
    reviewedBy: "Subin",
    reviewedById: "dsfg345",
  },
  {
    _id: "sd3435dsff",
    review: "some review for this product.",
    productId: "sdf67",
    productName: "Iphone seven",
    rating: 5,
    reviewedBy: "Subin",
    reviewedById: "dsfg345",
  },
  {
    _id: "sd34efgd35df",
    review: "some review for this product.",
    productId: "sdf67",
    productName: "Iphone seven",
    rating: 5,
    reviewedBy: "Subin",
    reviewedById: "dsfg345",
  },
];
//Get orders
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const reviews = _id
      ? reviewArgs.filter((item) => item._id === _id)[0]
      : reviewArgs;

    res.json({
      status: "success",
      message: "Reviews",
      reviews,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
