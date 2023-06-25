import { Loot } from "@/schema";
import { chunk, map } from "histar";

const parseDuration = (line: string): number => {
  const [, value] = line.split(":");
  const [hours, minutes] = value.substring(0, value.length - 2).split(":");
  return Number(hours) * 60 + Number(minutes);
};

const parseNumberLine = (line: string): number => {
  const [, value] = line.split(":");
  return Number(value.replaceAll(",", "").trim());
};

const parseLootType = (line: string): string => {
  const [, value] = line.split(":");
  return value.trim();
};

export const parseLoot = (text: string) => {
  const [, duration, lootType, loot, supplies, balance, ...lines] = text
    .trim()
    .split("\n");

  if (!lootType.trim().startsWith("Loot Type:")) {
    throw new Error("Invalid input");
  }

  return new Loot({
    duration: parseDuration(duration),
    lootType: parseLootType(lootType),
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
  });
};
