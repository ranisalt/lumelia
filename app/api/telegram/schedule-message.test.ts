import { server } from "@/mocks/server";
import { rest } from "msw";
import { afterAll, afterEach, beforeAll, describe, vi } from "vitest";
import { scheduleMessage } from "./schedule-message";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("@/constants");

describe("scheduleMessage", (it) => {
  it("should make a request to schedule a message", async ({ expect }) => {
    const cb = vi.fn();

    server.use(
      rest.post("https://api.serverlessq.com/", async (req, res, ctx) => {
        expect(req.headers.get("x-api-key")).toEqual(
          "b37e50cedcd3e3f1ff64f4afc0422084ae694253cf399326868e07a35f4a45fb"
        );

        expect(req.url.searchParams.get("id")).toEqual(
          "486e361b-ae30-4b7e-8b20-beb8fd81a371"
        );

        expect(req.url.searchParams.get("target")).toEqual(
          "https://lumelia.vercel.app/api/send-message"
        );

        cb(await req.json());
        return res(ctx.status(200), ctx.json({ success: true }));
      })
    );

    const response = await scheduleMessage({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });

    expect(response).toEqual({ success: true });

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({
      chatId: 123,
      text: "Hello world",
      replyToMessageId: 456,
    });
  });
});
