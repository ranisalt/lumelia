import mongoose, { Schema } from "mongoose";

type ILoot = {
  chat_id: number;
  message_id: number;
  loot: number;
  supplies: number;
  balance: number;
  players: {
    name: string;
    loot: number;
    supplies: number;
    balance: number;
    damage: number;
    healing: number;
  }[];
};

const lootSchema = () =>
  mongoose.model(
    "Loot",
    new Schema<ILoot>({
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

export const Loot: ReturnType<typeof lootSchema> =
  mongoose.models.Loot || lootSchema();
