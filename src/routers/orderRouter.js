import express from "express";

const router = express.Router();
const orderArg = [
  {
    _id: "11",
    status: "processing", //processing, completed, cancelled
    buyers: {
      buyerId: "sidhi454",
      fName: "subin",
      lName: "Basnet",
      email: "shfaih@fmail",
      phone: "433434",
    },
    cart: [
      {
        productId: "sdhfdsi",
        productName: "sdfjisd",
        salesPrice: 100,
        quantity: 4,
        thumbnail: "http://.....",
        subTotal: 400,
      },
      {
        productId: "hfghfg",
        productName: "hthrt",
        salesPrice: 200,
        quantity: 3,
        thumbnail: "http://.....",
        subTotal: 600,
      },
    ],
    shipping: {
      fName: "subin",
      lName: "Basnet",
      phone: "353454",
      street: "10 george st",
      suburb: "caomosie",
      postCode: 3535,
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 400,
    discount: 50,
    discountCode: "HDIHA",
    totalAmount: 350, //carTotal-discount
    paymentInfo: {
      status: "paid", //paid, pending,
      method: "card", //cash or credit card, bank transfer, ...
      paidAmount: 350,
      transactionId: "34545hd",
      paidDate: "3033-33-33",
    },
  },
  {
    _id: "1",
    status: "processing", //processing, completed, cancelled
    buyers: {
      buyerId: "sidhi454",
      fName: "subin",
      lName: "Basnet",
      email: "shfaih@fmail",
      phone: "433434",
    },
    cart: [
      {
        productId: "sdhfdsi",
        productName: "sdfjisd",
        salesPrice: 100,
        quantity: 4,
        thumbnail: "http://.....",
        subTotal: 400,
      },
      {
        productId: "hfghfg",
        productName: "hthrt",
        salesPrice: 200,
        quantity: 3,
        thumbnail: "http://.....",
        subTotal: 600,
      },
    ],
    shipping: {
      fName: "subin",
      lName: "Basnet",
      phone: "353454",
      street: "10 george st",
      suburb: "caomosie",
      postCode: 3535,
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 400,
    discount: 50,
    discountCode: "HDIHA",
    totalAmount: 350, //carTotal-discount
    paymentInfo: {
      status: "paid", //paid, pending,
      method: "card", //cash or credit card, bank transfer, ...
      paidAmount: 350,
      transactionId: "34545hd",
      paidDate: "3033-33-33",
    },
  },
  {
    _id: "1",
    status: "processing", //processing, completed, cancelled
    buyers: {
      buyerId: "sidhi454",
      fName: "subin",
      lName: "Basnet",
      email: "shfaih@fmail",
      phone: "433434",
    },
    cart: [
      {
        productId: "sdhfdsi",
        productName: "sdfjisd",
        salesPrice: 100,
        quantity: 4,
        thumbnail: "http://.....",
        subTotal: 400,
      },
      {
        productId: "hfghfg",
        productName: "hthrt",
        salesPrice: 200,
        quantity: 3,
        thumbnail: "http://.....",
        subTotal: 600,
      },
    ],
    shipping: {
      fName: "subin",
      lName: "Basnet",
      phone: "353454",
      street: "10 george st",
      suburb: "caomosie",
      postCode: 3535,
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 400,
    discount: 50,
    discountCode: "HDIHA",
    totalAmount: 350, //carTotal-discount
    paymentInfo: {
      status: "paid", //paid, pending,
      method: "card", //cash or credit card, bank transfer, ...
      paidAmount: 350,
      transactionId: "34545hd",
      paidDate: "3033-33-33",
    },
  },
  {
    _id: "1",
    status: "processing", //processing, completed, cancelled
    buyers: {
      buyerId: "sidhi454",
      fName: "subin",
      lName: "Basnet",
      email: "shfaih@fmail",
      phone: "433434",
    },
    cart: [
      {
        productId: "sdhfdsi",
        productName: "sdfjisd",
        salesPrice: 100,
        quantity: 4,
        thumbnail: "http://.....",
        subTotal: 400,
      },
      {
        productId: "hfghfg",
        productName: "hthrt",
        salesPrice: 200,
        quantity: 3,
        thumbnail: "http://.....",
        subTotal: 600,
      },
    ],
    shipping: {
      fName: "subin",
      lName: "Basnet",
      phone: "353454",
      street: "10 george st",
      suburb: "caomosie",
      postCode: 3535,
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 400,
    discount: 50,
    discountCode: "HDIHA",
    totalAmount: 350, //carTotal-discount
    paymentInfo: {
      status: "paid", //paid, pending,
      method: "card", //cash or credit card, bank transfer, ...
      paidAmount: 350,
      transactionId: "34545hd",
      paidDate: "3033-33-33",
    },
  },
  {
    _id: "1",
    status: "processing", //processing, completed, cancelled
    buyers: {
      buyerId: "sidhi454",
      fName: "subin",
      lName: "Basnet",
      email: "shfaih@fmail",
      phone: "433434",
    },
    cart: [
      {
        productId: "sdhfdsi",
        productName: "sdfjisd",
        salesPrice: 100,
        quantity: 4,
        thumbnail: "http://.....",
        subTotal: 400,
      },
      {
        productId: "hfghfg",
        productName: "hthrt",
        salesPrice: 200,
        quantity: 3,
        thumbnail: "http://.....",
        subTotal: 600,
      },
    ],
    shipping: {
      fName: "subin",
      lName: "Basnet",
      phone: "353454",
      street: "10 george st",
      suburb: "caomosie",
      postCode: 3535,
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 400,
    discount: 50,
    discountCode: "HDIHA",
    totalAmount: 350, //carTotal-discount
    paymentInfo: {
      status: "paid", //paid, pending,
      method: "card", //cash or credit card, bank transfer, ...
      paidAmount: 350,
      transactionId: "34545hd",
      paidDate: "3033-33-33",
    },
  },
];

//Get orders
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const orders = _id
      ? orderArg.filter((item) => item._id === _id)[0]
      : orderArg;

    res.json({
      status: "success",
      message: "Order list.",
      orders,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
