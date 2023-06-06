import type { Loot, Transaction } from "../types";

/**
 * Split loot between players fairly and return a list of transactions.
 *
 * This algorithm favors larger transfers: the player with the largest negative
 * balance will receive the largest transfer from the player with the largest
 * positive balance first, then the balance will be recalculated and the
 * process will repeat until all balances are neutral.
 */
export const splitLoot = ({ balance, players }: Loot) => {
  const balancePerPlayer = Math.floor(balance / players.length);
  const state = players.map(({ name, balance }) => ({
    name,
    balance: balance - balancePerPlayer,
  }));

  const transactions: Transaction[] = [];

  state.sort((a, b) => a.balance - b.balance);
  while (state[0].balance < 0) {
    const amount = Math.min(-state[0].balance, state[state.length - 1].balance);

    state[0].balance += amount;
    state[state.length - 1].balance -= amount;

    transactions.push({
      from: state[state.length - 1].name,
      to: state[0].name,
      amount,
    });

    state.sort((a, b) => a.balance - b.balance);
  }

  return transactions;
};
