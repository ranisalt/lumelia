import { NextResponse } from "next/server";
import type { ScheduledMessage } from "../types";
import { sendMessage } from "./send-message";

export const POST = async (req: Request) => {
  const message: ScheduledMessage = await req.json();

  const response = await sendMessage(message);

  return NextResponse.json(response);
};
