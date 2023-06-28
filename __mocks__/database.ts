import { MONGODB_URI } from "@/constants";
import mongoose from "mongoose";
import { afterAll, beforeAll } from "vitest";

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI, { dbName: "test_lumelia" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
