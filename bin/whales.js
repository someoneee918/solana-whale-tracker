#!/usr/bin/env node
import { age, c, compact, footer, isAddress, main, pad, parseArgs, short, sleep, table, usd } from "../lib/core.js";
import { findPools, loadTrades, summarize, trendingPools, watchSeconds } from "../lib/whales.js";

const HELP = `solana-whale-tracker: big buys and sells on any Solana token

Usage:
  whales <mint> [options]        Whale trades on one token
  whales --trending [options]    Whale trades across the trending pools

Options:
  --min-usd <n>     Smallest trade to count, in USD (default 1000)
  --pools <n>       Pools to read: the token's deepest (default 3), or trending pools (default 5)
  --limit <n>       Trades to list (default 20)
  --wallets <n>     Wallets in each leaderboard (default 5)
  --watch <sec>     Keep running and print new whale trades (default 30, minimum 20)
  --json            Print trades and summary as JSON (one trade per line with --watch)
  --help            Show this help

Each pool returns its 300 most recent matching trades from the last 24 hours,
so on a busy token raise --min-usd to see further back.
`;

main(async () => {
  const args = parseArgs(process.argv.slice(2), { booleans: ["trending", "json", "help"] });
  const mint = args._[0];
  if (args.help || (!mint && !args.trending)) { console.log(HELP); process.exit(args.help ? 0 : 1); }
  if (mint && !isAddress(mint)) throw new Error(`"${mint}" is not a Solana address.`);
  const minUsd = Math.max(1, Number(args["min-usd"]) || 1000);
  const limit = Number(args.limit) || 20;
  const walletCount = Number(args.wallets) || 5;
  const watch = watchSeconds(args.watch);

  let pools, title, single = null;
  if (mint) {
    single = await findPools(mint, Math.max(1, Math.min(5, Number(args.pools) || 3)));
    pools = single.pools;
    title = `${single.name} (${single.symbol})`;
  } else {
    pools = await trendingPools(Math.max(1, Math.min(10, Number(args.pools) || 5)));
    title = `Trending pools: ${pools.map((p) => p.symbol).join(", ")}`;
  }

  const line = (t) => {
    const side = t.side === "buy" ? c.green("BUY ") : c.red("SELL");
    const size = t.usd >= minUsd * 10 ? c.bold(usd(t.usd)) : usd(t.usd);
    return `${pad(age(Date.now() - t.time) + " ago", 9, true)}  ${side}  ${pad(size, 9, true)}  ${pad(compact(t.tokens), 9, true)} ${pad(t.symbol || single?.symbol || "", 10)}  ${pad(short(t.wallet, 5), 12)}  ${c.dim("solscan.io/tx/" + t.signature)}`;
  };

  const trades = await loadTrades(pools, minUsd, mint);
  const summary = summarize(trades);
  if (args.json && !watch) { console.log(JSON.stringify({ token: single, pools, minUsd, summary, trades }, null, 2)); return; }

  if (!args.json) {
    console.log(`\n${c.bold(title)}${mint ? "  " + c.dim(mint) : ""}`);
    const span = trades.length ? `covering the last ${age(Date.now() - trades.at(-1).time)}` : "last 24h";
    console.log(c.dim(`Trades of ${usd(minUsd)} or more, ${span}, ${pools.length} pool${pools.length > 1 ? "s" : ""}\n`));
    if (!trades.length) console.log(`No trades of ${usd(minUsd)} or more. Try a lower --min-usd.`);
    else {
      const net = summary.netUsd;
      console.log(`${c.green(`${summary.buys} buys ${usd(summary.buyUsd)}`)}  ·  ${c.red(`${summary.sells} sells ${usd(summary.sellUsd)}`)}  ·  net ${(net >= 0 ? c.green : c.red)((net >= 0 ? "+" : "-") + usd(Math.abs(net)))}  ·  ${summary.wallets} wallets\n`);
      for (const t of trades.slice(0, limit)) console.log(line(t));
      if (trades.length > limit) console.log(c.dim(`… ${trades.length - limit} more (use --limit).`));
      const board = (name, list, colour) => {
        if (!list.length) return;
        console.log(`\n${c.bold(name)}`);
        table(
          [{ title: "Wallet", width: 44 }, { title: "Net", width: 10, right: true }, { title: "Bought", width: 9, right: true }, { title: "Sold", width: 9, right: true }, { title: "Trades", width: 6, right: true }, { title: "Last", width: 8, right: true }],
          list.slice(0, walletCount).map((w) => [w.wallet, colour((w.netUsd >= 0 ? "+" : "-") + usd(Math.abs(w.netUsd))), usd(w.buyUsd), usd(w.sellUsd), w.buys + w.sells, age(Date.now() - w.last)]),
        );
      };
      board("Biggest net buyers", summary.topBuyers, c.green);
      board("Biggest net sellers", summary.topSellers, c.red);
    }
  }

  if (!watch) { footer("/solana-whale-tracker", "Whale and smart-money tracking with wallet labels, live"); return; }

  const seen = new Set(trades.map((t) => t.id));
  if (args.json) {
    for (const t of trades.slice().reverse()) console.log(JSON.stringify(t));
  } else {
    console.error(c.dim(`\nWatching for new trades every ${watch}s. Ctrl+C to stop.`));
  }
  process.on("SIGINT", () => { if (!args.json) footer("/solana-whale-tracker", "Whale and smart-money tracking with wallet labels, live"); process.exit(0); });
  for (;;) {
    await sleep(watch * 1000);
    try {
      const fresh = (await loadTrades(pools, minUsd, mint)).filter((t) => !seen.has(t.id)).reverse();
      for (const t of fresh) { seen.add(t.id); console.log(args.json ? JSON.stringify(t) : line(t)); }
    } catch (err) {
      if (!args.json) console.error(c.dim(`[refresh failed] ${err.message}`));
    }
  }
});
