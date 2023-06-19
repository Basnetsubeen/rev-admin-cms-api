import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;

//database connection
import { dbConnection } from "./src/config/dbconfig.js";
dbConnection();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());

//serve static
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

//routers
import adminUserRouter from "./src/routers/AdminUserRouter.js";
app.use("/api/v1/admin-user", adminUserRouter);
import categoryRouter from "./src/routers/CategoryRouter.js";
import { authMiddleware } from "./src/middlewares/auth-middleware/AuthMiddleware.js";
app.use("/api/v1/category", authMiddleware, categoryRouter);
import paymentMethodRouter from "./src/routers/paymentMethodRouter.js";
app.use("/api/v1/payment-method", paymentMethodRouter);
import productRouter from "./src/routers/ProductRouter.js";
app.use("/api/v1/product", productRouter);
import orderRouter from "./src/routers/orderRouter.js";
app.use("/api/v1/order", orderRouter);

//Test
app.use("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "You have tested well.",
  });
});

//Global error handler
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

//PORT
app.listen(PORT, (error) => {
  error && console.log(error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
