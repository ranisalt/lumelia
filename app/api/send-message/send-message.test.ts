import { afterAll, afterEach, beforeAll, describe, vi } from "vitest";
import { rest } from "msw";
import { sendMessage } from "./send-message";
import { server } from "@/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("@/constants");

describe("send-message", (it) => {
  it("should make a request to send a message", async ({ expect }) => {
    const cb = vi.fn();
    server.use(
      rest.post(
        "https://api.telegram.org/bot110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/sendMessage",
        async (req, res, ctx) => {
          cb(await req.json());
          return res(ctx.status(200), ctx.json({ success: true }));
        }
      )
    );

    const response = await sendMessage({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });

    expect(response).toEqual({ success: true });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({
      chat_id: 123,
      text: "Hello world",
      reply_to_message_id: 456,
      parse_mode: "MarkdownV2",
    });
  });
});
