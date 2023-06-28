import {
  SERVERLESSQ_API_TOKEN,
  SERVERLESSQ_QUEUE_ID,
  VERCEL_URL,
} from "@/constants";

const target = `https://${VERCEL_URL}/api/send-message`;

export const scheduleMessage = async ({
  chat_id,
  message_id,
}: {
  chat_id: number;
  message_id: number;
}) => {
  const url = new URL("https://api.serverlessq.com");
  url.searchParams.set("id", SERVERLESSQ_QUEUE_ID);
  url.searchParams.set("target", target);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": SERVERLESSQ_API_TOKEN,
    },
    body: JSON.stringify({ chat_id, message_id }),
  });

  return response.json();
};
