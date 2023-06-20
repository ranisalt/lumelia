import { TELEGRAM_BOT_API_SECRET_TOKEN } from "@/constants";
import type { TelegramMessage, Transaction } from "@/types";
import { groupBy } from "histar";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { parseLoot } from "./parse-loot";
import { scheduleMessage } from "./schedule-message";
import { splitLoot } from "./split-loot";

type TelegramRequestBody = {
  update_id: number;
  message: TelegramMessage;
};

const buildMessage = (transactions: Transaction[]) => {
  transactions.sort(
    (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)
  );

  const lines: string[] = [];
  for (const [name, ts] of groupBy(transactions, (t) => t.from)) {
    lines.push(`*${name}*`);
    for (const t of ts) {
      lines.push(`\\- transfer ${t.amount} to ${t.to}`);
    }
  }
  return lines.join("\n");
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
    chat: { id },
    entities,
    text,
  } = message;

  if (!entities || entities.length === 0) {
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

  const transactions = splitLoot(loot);

  const reply = buildMessage(transactions);
  await scheduleMessage({
    chatId: id,
    text: reply,
    replyToMessageId: message_id,
  });

  return NextResponse.json({ success: true });
};
