import { sendMessage } from "./send-message";

describe("send-message", () => {
  it("should make a request to send a message", async () => {
    const spyFetch = jest.spyOn(global, "fetch");

    spyFetch.mockResolvedValue({
      json: async () => ({ success: true }),
    } as Response);

    const response = await sendMessage({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });

    const url = new URL(
      `/bot110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/sendMessage`,
      "https://api.telegram.org"
    );

    expect(response).toEqual({ success: true });

    expect(spyFetch).toHaveBeenCalledTimes(1);
    expect(spyFetch).toHaveBeenCalledWith(url, {
      body: JSON.stringify({
        chat_id: 123,
        text: "Hello world",
        reply_to_message_id: 456,
        parse_mode: "MarkdownV2",
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    spyFetch.mockRestore();
  });
});
