import type { Loot } from "@/types";
import { chunk, map } from "histar";

const parseNumberLine = (line: string) => {
  const [_, value] = line.split(":");
  return Number(value.replaceAll(",", "").trim());
};

export const parseLoot = (text: string): Loot => {
  const [, _duration, _lootType, loot, supplies, balance, ...lines] = text
    .trim()
    .split("\n");

  return {
    loot: parseNumberLine(loot),
    supplies: parseNumberLine(supplies),
    balance: parseNumberLine(balance),
    players: [
      ...map(
        chunk(lines, 6),
        ([name, loot, supplies, balance, damage, healing]) => ({
          name: name.replace("(Leader)", "").trim(),
          loot: parseNumberLine(loot),
          supplies: parseNumberLine(supplies),
          balance: parseNumberLine(balance),
          damage: parseNumberLine(damage),
          healing: parseNumberLine(healing),
        })
      ),
    ],
  };
};
