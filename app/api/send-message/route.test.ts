import { POST } from "./route";
import { sendMessage } from "./send-message";

jest.mock("./send-message");

describe("POST /api/send-message", () => {
  it("should send a message", async () => {
    (sendMessage as jest.Mock).mockResolvedValue({
      success: true,
    });

    const response = await POST({
      json: async () => ({
        chatId: 123,
        text: "Hello world",
        replyToMessageId: 456,
      }),
    } as Request);

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
