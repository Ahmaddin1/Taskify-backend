import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function connectDatabase() {
  try {


    const connection = await mongoose.connect(
      process.env.MONGOOSE_KEY + "/taskmanager",
    );
    console.log(" ======================= \ndatabase connected :)\n =======================");
  } catch (error) {
    console.log("======================= \ndatabase connection failed :(\n =======================", error);
    process.exit(1);
  }
}

export default connectDatabase;