import { parseLoot } from "./parse-loot";

const input = `Session data: From 2023-05-30, 19:45:04 to 2023-05-30, 20:52:15
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
        Healing: 945,679`;

describe("parseLoot", () => {
  it("should parse loot", () => {
    expect(parseLoot(input)).toMatchObject({
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
});
