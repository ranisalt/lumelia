import { db } from "@/database";
import { headers } from "next/headers";
import { afterAll, describe, vi } from "vitest";
import { POST } from "./route";
import { scheduleMessage } from "./schedule-message";

vi.mock("@/constants");
vi.mock("@/database");
vi.mock("next/headers");
vi.mock("./schedule-message");

afterAll(async () => {
  await db.connection.dropDatabase();
  await db.connection.close();
});

const payload = {
  json: async () => ({
    message: {
      message_id: 123,
      chat: { id: 123 },
      entities: [{ length: 10, offset: 0, type: "bot_command" }],
      text: `/splitloot Session data: From 2023-05-30, 19:45:04 to 2023-05-30, 20:52:15
        Session: 01:07h
        Loot Type: Leader
        Loot: 952,548
        Supplies: 397,771
        Balance: 554,777
        Knight Orion
            Loot: 946,698
            Supplies: 102,412
            Balance: 844,286
            Damage: 1,404,336
            Healing: 189,838
        Mistee Shadowforge
            Loot: 200
            Supplies: 80,570
            Balance: -80,370
            Damage: 1,126,931
            Healing: 136,154
        Raagendazss (Leader)
            Loot: 5,650
            Supplies: 214,789
            Balance: -209,139
            Damage: 1,916,587
            Healing: 945,679`,
    },
  }),
} as Request;

describe.concurrent("POST /api/telegram", (it) => {
  it("should return 401 if the secret token is invalid", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(new Headers());

    const response = await POST(payload);

    expect(response.status).toEqual(401);
  });

  it("should schedule a message", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(
      new Headers({
        "x-telegram-bot-api-secret-token":
          "-l6Lf4QuzfMR6ZNww30Zi9C0TAm-0XDGMBSoniYDBfQ",
      })
    );

    const response = await POST(payload);

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({ success: true });

    expect(scheduleMessage).toHaveBeenCalledWith({
      chatId: 123,
      text: `*Knight Orion*
\\- transfer 265295 to Mistee Shadowforge
\\- transfer 394064 to Raagendazss`,
      replyToMessageId: 123,
    });
  });

  it("should ignore if the input is invalid", async ({ expect }) => {
    vi.mocked(headers).mockReturnValue(
      new Headers({
        "x-telegram-bot-api-secret-token":
          "-l6Lf4QuzfMR6ZNww30Zi9C0TAm-0XDGMBSoniYDBfQ",
      })
    );

    vi.mocked(scheduleMessage).mockClear();

    const response = await POST({
      json: async () => ({
        message: {
          message_id: 123,
          chat: { id: 123 },
          entities: [{ length: 10, offset: 0, type: "bot_command" }],
          text: `/splitloot Session data: From 2023-06-19, 19:37:41 to 2023-06-19, 20:17:10
            Session: 00:39h
            Raw XP Gain: 1,468,389
            XP Gain: 2,202,474
            Raw XP/h: 1,098,207
            XP/h: 1,647,221
            Loot: 929,758
            Supplies: 93,369
            Balance: 836,389
            Damage: 885,803
            Damage/h: 885,803
            Healing: 240,251
            Healing/h: 240,251
            Killed Monsters:
              41x arachnophobica
            Looted Items:
              16x a small enchanted sapphire`,
        },
      }),
    } as Request);

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({ success: false });

    expect(scheduleMessage).not.toHaveBeenCalled();
  });
});
