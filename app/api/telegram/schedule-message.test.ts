import { describe, vi } from "vitest";
import { scheduleMessage } from "./schedule-message";

vi.mock("@/constants");

describe("scheduleMessage", (it) => {
  it("should make a request to schedule a message", async ({ expect }) => {
    const spyFetch = vi.spyOn(global, "fetch");

    spyFetch.mockResolvedValue({
      json: async () => ({ success: true }),
    } as Response);

    const response = await scheduleMessage({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });

    const url = new URL("https://api.serverlessq.com/");
    url.searchParams.append("id", "486e361b-ae30-4b7e-8b20-beb8fd81a371");
    url.searchParams.append(
      "target",
      "https://lumelia.vercel.app/api/send-message"
    );

    expect(response).toEqual({ success: true });

    expect(spyFetch).toHaveBeenCalledTimes(1);
    expect(spyFetch).toHaveBeenCalledWith(url, {
      body: JSON.stringify({
        chatId: 123,
        text: "Hello world",
        replyToMessageId: 456,
      }),
      headers: {
        "content-type": "application/json",
        "x-api-key":
          "b37e50cedcd3e3f1ff64f4afc0422084ae694253cf399326868e07a35f4a45fb",
      },
      method: "POST",
    });

    spyFetch.mockRestore();
  });
});
