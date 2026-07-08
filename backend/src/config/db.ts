import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB connected : ${connection.connection.host}`);
  } catch (error) {
    console.error("Mongo DB Connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
