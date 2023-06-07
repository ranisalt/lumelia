import { headers } from "next/headers";
import { POST } from "./route";
import { sendMessage } from "./send-message";

jest.mock("next/headers");
jest.mock("./send-message");

const payload = {
  json: async () => ({
    chatId: 123,
    text: "Hello world",
    replyToMessageId: 456,
  }),
} as Request;

describe("POST /api/send-message", () => {
  it("should return 401 if the secret token is invalid", async () => {
    (headers as jest.Mock).mockReturnValue(new Headers());

    const response = await POST(payload);

    expect(response.status).toEqual(401);
  });

  it("should send a message", async () => {
    (headers as jest.Mock).mockReturnValue(
      new Headers({
        "x-serverlessq-signature":
          "b52a8db960cd0a1e2ecee6202d0aabee548ff69148ec8e51f27291888fddb3db",
      })
    );

    (sendMessage as jest.Mock).mockResolvedValue({
      success: true,
    });

    const response = await POST(payload);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });
  });
});
