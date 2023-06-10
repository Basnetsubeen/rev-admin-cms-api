import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());

//database connection
import { dbConnection } from "./src/config/dbconfig.js";
dbConnection();

//routers
import adminUserRouter from "./src/routers/AdminUserRouter.js";
app.use("/api/v1/admin-user", adminUserRouter);
import categoryRouter from "./src/routers/CategoryRouter.js";
app.use("/api/v1/category", categoryRouter);

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
