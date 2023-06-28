import { TELEGRAM_BOT_API_SECRET_TOKEN } from "@/constants";
import { db } from "@/database";
import type { TelegramMessage } from "@/types";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { parseLoot } from "./parse-loot";
import { scheduleMessage } from "./schedule-message";

type TelegramRequestBody = {
  update_id: number;
  message: TelegramMessage;
};

export const POST = async (req: Request) => {
  const headersList = headers();
  const secretToken = headersList.get("x-telegram-bot-api-secret-token");
  if (secretToken !== TELEGRAM_BOT_API_SECRET_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message }: TelegramRequestBody = await req.json();
  const {
    message_id,
    chat: { id: chat_id },
    entities,
    text,
  } = message;

  if (!message_id || !entities || entities.length === 0) {
    return NextResponse.json({ success: false });
  }

  const [{ length, offset, type }] = entities;
  if (type !== "bot_command" || offset !== 0) {
    return NextResponse.json({ success: false });
  }

  if (text.substring(0, length) !== "/splitloot") {
    return NextResponse.json({ success: false });
  }

  let loot;
  try {
    loot = parseLoot(text.substring(length + 1, text.length));
  } catch {
    return NextResponse.json({ success: false });
  }

  loot.chat_id = chat_id;
  loot.message_id = message_id;

  await db;
  await loot.save();
  await scheduleMessage({ chat_id, message_id });

  return NextResponse.json({ success: true });
};
