import { SERVERLESSQ_API_TOKEN, VERCEL_URL } from "@/constants";
import type { ScheduledMessage } from "@/types";
import { createHmac } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendMessage } from "./send-message";

const expectedSignature = createHmac("sha256", SERVERLESSQ_API_TOKEN!)
  .update(JSON.stringify({ target: `https://${VERCEL_URL}/api/send-message` }))
  .digest("hex");

export const POST = async (req: Request) => {
  const headersList = headers();
  const signature = headersList.get("x-serverlessq-signature");
  if (signature !== expectedSignature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const message: ScheduledMessage = await req.json();

  const response = await sendMessage(message);

  return NextResponse.json(response);
};
