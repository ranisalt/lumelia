import { describe } from "vitest";
import { parseLoot } from "./parse-loot";

describe.concurrent("parseLoot", (it) => {
  it("should parse loot", ({ expect }) => {
    expect(
      parseLoot(`Session data: From 2023-05-30, 19:45:04 to 2023-05-30, 20:52:15
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
            Healing: 945,679`)
    ).toMatchObject({
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
  });

  it("should throw on invalid input", ({ expect }) => {
    expect(() => parseLoot("")).toThrow();

    expect(() =>
      parseLoot(`/splitloot Session data: From 2023-06-19, 19:37:41 to 2023-06-19, 20:17:10
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
          16x a small enchanted sapphire`)
    ).toThrow();
  });
});
