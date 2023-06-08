import mongoose from "mongoose";

export const dbConnection = () => {
  try {
    const connection = mongoose.connect(process.env.FNL_MONGO_DB);
    connection && console.log("MongoDB Connected");
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};
