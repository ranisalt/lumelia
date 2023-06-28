import { server } from "@/mocks/server";
import { rest } from "msw";
import { afterAll, afterEach, beforeAll, describe, vi } from "vitest";
import { sendMessage } from "./send-message";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("@/constants");

describe("send-message", (it) => {
  it("should make a request to send a message", async ({ expect }) => {
    server.use(
      rest.post(
        "https://api.telegram.org/bot110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/sendMessage",
        async (req, res, ctx) => {
          await expect(req.json()).resolves.toEqual({
            chat_id: 123,
            text: "Hello world",
            reply_to_message_id: 456,
            parse_mode: "MarkdownV2",
          });

          return res(
            ctx.status(200),
            ctx.json({
              ok: true,
              result: {
                message_id: 123,
                date: 1664236800,
                chat: { id: 123, type: "group" },
              },
            })
          );
        }
      )
    );

    const response = await sendMessage({
      chat_id: 123,
      text: "Hello world",
      reply_to_message_id: 456,
    });

    expect(response).toEqual({
      message_id: 123,
      date: 1664236800,
      chat: { id: 123, type: "group" },
    });
  });

  it("should throw an error if the response is not ok", async ({ expect }) => {
    server.use(
      rest.post(
        "https://api.telegram.org/bot110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw/sendMessage",
        async (_, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              ok: false,
              error_code: 400,
              description: "Bad Request: message text is empty",
            })
          );
        }
      )
    );

    await expect(
      sendMessage({
        chat_id: 123,
        text: "Hello world",
        reply_to_message_id: 456,
      })
    ).rejects.toThrow("Bad Request: message text is empty");
  });
});
