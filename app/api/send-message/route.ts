import { SERVERLESSQ_API_TOKEN, VERCEL_URL } from "@/constants";
import { db } from "@/database";
import { Loot } from "@/schema";
import { createHmac } from "crypto";
import { groupBy } from "histar";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendMessage } from "./send-message";
import { splitLoot } from "./split-loot";

const buildMessage = (transactions: ReturnType<typeof splitLoot>) => {
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

const expectedSignature = createHmac("sha256", SERVERLESSQ_API_TOKEN!)
  .update(JSON.stringify({ target: `https://${VERCEL_URL}/api/send-message` }))
  .digest("hex");

export const POST = async (req: Request) => {
  const headersList = headers();
  const signature = headersList.get("x-serverlessq-signature");
  if (signature !== expectedSignature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const key: { chat_id: number; message_id: number } = await req.json();

  await db;
  const loot = await Loot.findOne(key);
  if (!loot) {
    return NextResponse.json({ error: "Loot not found" }, { status: 404 });
  }

  const transactions = splitLoot(loot);

  try {
    const response = await sendMessage({
      chat_id: key.chat_id,
      reply_to_message_id: key.message_id,
      text: buildMessage(transactions),
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Message could not be sent" },
      { status: 400 }
    );
  }
};
