import { TELEGRAM_BOT_TOKEN } from "@/constants";
import type { ScheduledMessage, TelegramMessage } from "../types";

export const sendMessage = async ({
  chatId,
  text,
  replyToMessageId,
}: ScheduledMessage): Promise<TelegramMessage> => {
  const url = new URL(
    `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    "https://api.telegram.org"
  );

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyToMessageId,
      parse_mode: "MarkdownV2",
    }),
  });

  return response.json();
};
