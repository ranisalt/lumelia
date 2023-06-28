import { Loot } from "@/schema";
import { headers } from "next/headers";
import { afterEach, beforeEach, describe, vi } from "vitest";
import { POST } from "./route";
import { sendMessage } from "./send-message";

vi.mock("@/constants");
vi.mock("@/database");
vi.mock("next/headers");
vi.mock("./send-message");

beforeEach(async () => {
  const loot = new Loot({
    chat_id: 123,
    message_id: 456,
    loot: 952548,
    supplies: 397771,
    balance: 554777,
    players: [
      {
        name: "Knight Orion",
        loot: 946698,
        supplies: 102412,
        balance: 844286,
        damage: 1404336,
        healing: 189838,
      },
      {
        name: "Mistee Shadowforge",
        loot: 200,
        supplies: 80570,
        balance: -80370,
        damage: 1126931,
        healing: 136154,
      },
      {
        name: "Raagendazss",
        loot: 5650,
        supplies: 214789,
        balance: -209139,
        damage: 1916587,
        healing: 945679,
      },
    ],
  });
  await loot.save();
});

afterEach(async () => {
  await Loot.deleteOne({ chat_id: 123, message_id: 456 });
});

describe("POST /api/send-message", (it) => {
  it("should return 401 if the secret token is invalid", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(new Headers());

    const response = await POST({
      json: async () => ({ chat_id: 123, message_id: 456 }),
    } as Request);
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

    const response = await POST({
      json: async () => ({ chat_id: 123, message_id: 456 }),
    } as Request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ text: "Hello world" })
    );

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith({
      chat_id: 123,
      reply_to_message_id: 456,
      text: `*Knight Orion*
\\- transfer 265295 to Mistee Shadowforge
\\- transfer 394064 to Raagendazss`,
    });
  });

  it("should return 400 if the message could not be sent", async ({
    expect,
  }) => {
    vi.mocked(headers).mockReturnValue(
      new Headers({
        "x-serverlessq-signature":
          "b52a8db960cd0a1e2ecee6202d0aabee548ff69148ec8e51f27291888fddb3db",
      })
    );

    vi.mocked(sendMessage).mockRejectedValue(
      new Error("Bad Request: message text is empty")
    );

    const response = await POST({
      json: async () => ({ chat_id: 123, message_id: 456 }),
    } as Request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Message could not be sent",
    });
  });
});
