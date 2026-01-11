import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB connected sucessfully!");
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1); //if database connection filed app stops running immediately.
  }
};
export default connectDB;
