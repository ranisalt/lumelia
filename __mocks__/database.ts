import mongoose from "mongoose";

export const db = await mongoose.connect("mongodb://localhost:27017/test", {
  dbName: "test",
});
