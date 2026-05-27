import router from "./src/routes/routes.mjs";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/tasks", router);

app.get("/", (req, res) => {
    res.status(200).send({ msg: "Hello I'm MERN Intern" });
});

const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes("127.0.0.1") || mongoUri.includes("localhost")) {
    try {
      console.log("Starting MongoMemoryServer...");
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`MongoMemoryServer started at: ${mongoUri}`);
    } catch (err) {
      console.error("Could not start MongoMemoryServer, falling back to .env MONGO_URI", err);
    }
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to database successfully");

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});