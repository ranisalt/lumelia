import { TELEGRAM_BOT_TOKEN } from "@/constants";
import type { TelegramMessage } from "@/types";

type TelegramResponse<T> =
  | { ok: true; result: T }
  | { ok: false; description: string; error_code: number };

export const sendMessage = async ({
  chat_id,
  text,
  reply_to_message_id,
}: {
  chat_id: number;
  text: string;
  reply_to_message_id: number;
}): Promise<TelegramMessage> => {
  const url = new URL(
    `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    "https://api.telegram.org"
  );

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text,
      reply_to_message_id,
      parse_mode: "MarkdownV2",
    }),
  });

  const body: TelegramResponse<TelegramMessage> = await response.json();
  if (body.ok) return body.result;
  throw new Error(body.description);
};
