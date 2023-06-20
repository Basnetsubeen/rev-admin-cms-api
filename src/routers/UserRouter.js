import express from "express";

const router = express.Router();

const userArgs = [
  {
    _id: "sd3435df",
    fName: "lionee",
    lName: "dhijok",
    phone: "345ty456",
    email: "messi@10.com",
  },
  {
    _id: "etrerr",
    fName: "lionee",
    lName: "dhijok",
    phone: "345ty456",
    email: "messi@10.com",
  },
  {
    _id: "retytfgf",
    fName: "lionee",
    lName: "dhijok",
    phone: "345ty456",
    email: "messi@10.com",
  },
];
//Get orders
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const users = _id
      ? userArgs.filter((item) => item._id === _id)[0]
      : userArgs;

    res.json({
      status: "success",
      message: "users",
      users,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
