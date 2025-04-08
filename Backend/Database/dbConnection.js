import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/sem7_Project_DB");

    console.log("Connected to MonogoDB");
    //
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
