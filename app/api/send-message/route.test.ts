import { headers } from "next/headers";
import { describe, vi } from "vitest";
import { POST } from "./route";
import { sendMessage } from "./send-message";

vi.mock("@/constants");
vi.mock("next/headers");
vi.mock("./send-message");

const payload = {
  json: async () => ({
    chatId: 123,
    text: "Hello world",
    replyToMessageId: 456,
  }),
} as Request;

describe("POST /api/send-message", (it) => {
  it("should return 401 if the secret token is invalid", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(new Headers());

    const response = await POST(payload);

    expect(response.status).toEqual(401);
  });

  it("should send a message", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(
      new Headers({
        "x-serverlessq-signature":
          "b52a8db960cd0a1e2ecee6202d0aabee548ff69148ec8e51f27291888fddb3db",
      })
    );

    vi.mocked(sendMessage).mockResolvedValue({
      message_id: 123,
      chat: { id: 123, type: "group" },
      from: { id: 123, first_name: "Lumelia", is_bot: true },
      text: "Hello world",
    });

    const response = await POST(payload);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({ text: "Hello world" })
    );

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });
  });
});
