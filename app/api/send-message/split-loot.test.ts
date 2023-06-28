import { describe } from "vitest";
import { parseLoot } from "../telegram/parse-loot";
import { splitLoot } from "./split-loot";

describe.concurrent("splitLoot", (it) => {
  it("should split loot evenly", ({ expect }) => {
    const input = `Session data: From 2023-06-04, 19:10:01 to 2023-06-04, 20:15:31
      Session: 01:05h
      Loot Type: Leader
      Loot: 3,061,755
      Supplies: 815,991
      Balance: 2,245,764
      Drexi
          Loot: 2,667,039
          Supplies: 469,496
          Balance: 2,197,543
          Damage: 3,060,813
          Healing: 1,024,567
      Swampy Gas (Leader)
          Loot: 394,716
          Supplies: 346,495
          Balance: 48,221
          Damage: 2,559,726
          Healing: 1,391,731
      `;

    const loot = parseLoot(input);

    expect(splitLoot(loot)).toEqual([
      { from: "Drexi", to: "Swampy Gas", amount: 1074661 },
    ]);
  });

  it("should split loot for more than two players", ({ expect }) => {
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
          Healing: 945,679
      `;

    const loot = parseLoot(input);

    expect(splitLoot(loot)).toEqual([
      { from: "Knight Orion", to: "Raagendazss", amount: 394064 },
      { from: "Knight Orion", to: "Mistee Shadowforge", amount: 265295 },
    ]);
  });

  it("should split loot when two players have to transfer", ({ expect }) => {
    const input = `Session data: From 2023-06-04, 12:28:53 to 2023-06-04, 14:36:56
      Session: 02:08h
      Loot Type: Leader
      Loot: 11,704,202
      Supplies: 2,461,207
      Balance: 9,242,995
      Acelime
          Loot: 14,620
          Supplies: 712,576
          Balance: -697,956
          Damage: 6,565,155
          Healing: 823,271
      Bezdech (Leader)
          Loot: 3,524,414
          Supplies: 432,867
          Balance: 3,091,547
          Damage: 5,353,480
          Healing: 571,329
      Drexi
          Loot: 7,586,471
          Supplies: 547,371
          Balance: 7,039,100
          Damage: 6,862,706
          Healing: 1,013,681
      Swampy Gas
          Loot: 578,697
          Supplies: 768,393
          Balance: -189,696
          Damage: 7,334,817
          Healing: 4,333,825
      `;

    const loot = parseLoot(input);

    expect(splitLoot(loot)).toEqual([
      { from: "Drexi", to: "Acelime", amount: 3008704 },
      { from: "Drexi", to: "Swampy Gas", amount: 1719648 },
      { from: "Bezdech", to: "Swampy Gas", amount: 780796 },
    ]);
  });

  it("should split loot with a negative balance", ({ expect }) => {
    const input = `Session data: From 2023-06-05, 18:17:05 to 2023-06-05, 19:16:01
      Session: 00:58h
      Loot Type: Market
      Loot: 358,549
      Supplies: 486,370
      Balance: -127,821
      Dangerous Fred
          Loot: 0
          Supplies: 231,259
          Balance: -231,259
          Damage: 1,272,719
          Healing: 892,093
      Killer Hick (Leader)
          Loot: 358,549
          Supplies: 77,276
          Balance: 281,273
          Damage: 959,356
          Healing: 25,853
      Yutha Ed
          Loot: 0
          Supplies: 177,835
          Balance: -177,835
          Damage: 962,528
          Healing: 207,184
      `;

    const loot = parseLoot(input);

    expect(splitLoot(loot)).toEqual([
      { from: "Killer Hick", to: "Dangerous Fred", amount: 188652 },
      { from: "Killer Hick", to: "Yutha Ed", amount: 135228 },
    ]);
  });
});
