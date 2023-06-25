import mongoose, { Schema } from "mongoose";

export const Loot = mongoose.model(
  "Loot",
  new Schema({
    chat_id: { type: Number, required: true, index: { sparse: true } },
    message_id: {
      type: Number,
      required: true,
      index: { unique: true, sparse: true },
    },
    loot: { type: Number, required: true },
    supplies: { type: Number, required: true },
    balance: { type: Number, required: true },
    players: [
      {
        name: { type: String, required: true },
        loot: { type: Number, required: true },
        supplies: { type: Number, required: true },
        balance: { type: Number, required: true },
        damage: { type: Number, required: true },
        healing: { type: Number, required: true },
      },
    ],
  })
);
