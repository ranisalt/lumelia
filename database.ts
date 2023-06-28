import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

export const db = mongoose.connect(MONGODB_URI, { dbName: "lumelia" });
