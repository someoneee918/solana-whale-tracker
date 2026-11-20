# Solana Whale Tracker

Big buys and sells on any Solana token: net whale flow, every large trade with a Solscan link, and leaderboards of the wallets buying and dumping the most. Or watch the trending pools all at once.

![Node 22+](https://img.shields.io/badge/node-%E2%89%A522-5FA04E?logo=node.js&logoColor=white) ![Dependencies: 0](https://img.shields.io/badge/dependencies-0-2ea44f) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Website](https://img.shields.io/badge/website-blixtrade.github.io-8b5cf6)](https://blixtrade.github.io/solana-whale-tracker/)

> Free and open source, part of the [Blix Trade](https://github.com/blixtrade) toolkit. For the live version with AI ratings on every coin, wallet tracking and one-click trading at 0% fees, see **[BLIX, the Solana memecoin terminal](https://blixvip.com/solana-whale-tracker?utm_source=github&utm_medium=readme&utm_campaign=solana-whale-tracker)**.

## What it does

- Every trade above your size threshold across the token's deepest pools, newest first.
- Net flow: total whale buys against whale sells.
- Leaderboards of the biggest net buyers and net sellers, with trade counts and when they last traded.
- `--trending` scans the top trending Solana pools instead of one token.
- `--watch` keeps running and prints new whale trades as they land.

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer. There is nothing else to install: no dependencies, no API keys.

Run it straight from GitHub:

```bash
npx -y github:blixtrade/solana-whale-tracker <mint> --min-usd 5000
```

Or clone it:

```bash
git clone https://github.com/blixtrade/solana-whale-tracker.git
cd solana-whale-tracker
node bin/whales.js <mint> --min-usd 5000
```

To get a `whales` command on your PATH, run `npm link` inside the folder.

## Example output

Real output from a run on 18 November 2026:

```text
DacityCoin (DCTY)  9hjBLBrc7WZW2H8UQvBAvG5WiTZotXUv2Bdcn4f4pump
Trades of $5.0K or more, covering the last 6.6h, 3 pools

201 buys $1.56M  ·  231 sells $1.98M  ·  net -$422.2K  ·  145 wallets

   3m ago  BUY       $7.2K     554.0K DCTY        Mriya…PQu7X   solscan.io/tx/54RnFi4qrsJL9edLN897bSQipCA1cfeC1kFb5U4hoNuMLhsJisZsRkNqcL8zCX82ipMR6ocajHEztKwbp97xgVUs
   3m ago  SELL     $14.5K      1.03M DCTY        HGvNQ…PFk8p   solscan.io/tx/4zw3TRmhpr4SCeKHxjgL6343gg14dfchZQFxp4EbePmoL5txcmQ6zi9XwcJzf7F3E69K5Ccd7R76wRt1Eb1UQb9o
   3m ago  SELL      $7.6K     554.0K DCTY        Mriya…PQu7X   solscan.io/tx/54RnFi4qrsJL9edLN897bSQipCA1cfeC1kFb5U4hoNuMLhsJisZsRkNqcL8zCX82ipMR6ocajHEztKwbp97xgVUs
   9m ago  BUY       $6.1K     435.1K DCTY        AgmLJ…JzN51   solscan.io/tx/Eqehme2ZLVJnLGD1zMrKr5qBNXP9st2pu8ryDrP6QGbMMTdif7So479MKShAeQYPtN9s8JBgcRUyQNA1biJXZtL
  11m ago  SELL      $6.5K     496.3K DCTY        4zp8g…vrju4   solscan.io/tx/4VxALd4G9Np2RLJrJfdpgvZ6ApwUqmKnLs6sPjd9Ex1DHqN7EKHWNgHiMWyKp3qViHAsqZPDM64tP86VTuPDQSiV
… 427 more (use --limit).

Biggest net buyers
Wallet                                               Net     Bought       Sold  Trades      Last
6AhYEPh4bbVQDigodesyzrwq2BXMNQtMeS9q695Qo6v8     +$68.9K     $68.9K         $0       9       55m
9CNyLECt2j8tnDhqxtjYk5HUhZ2b8Nwnyb7sfYN7vND2     +$61.1K     $73.9K     $12.8K      12      5.2h
BDZnR7hLaU4GXJ4h2WYZG4qZ7Go9uRYsAmSStsmN6Fs2     +$49.7K     $49.7K         $0       6      5.7h

Biggest net sellers
Wallet                                               Net     Bought       Sold  Trades      Last
4VvdcB1Bde2qCPdbxkFcy79qk3cT1nMXFoGuhfhCa7gr    -$184.0K         $0    $184.0K      17      6.5h
23cKMyD5BLnSyy7riTCjgbNj4sTbPQrC1Ei69X6HuAea    -$167.6K         $0    $167.6K      11      2.9h
9SbpRzApy9ruStXLPXNsAqEHKrF3jPKLxSEyQ9monnsB     -$69.8K         $0     $69.8K       1      5.4h
```

## Options

```text
solana-whale-tracker: big buys and sells on any Solana token

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
```

## How it works

- Pools come from DexScreener; trades from GeckoTerminal's pool trades API, deduplicated across pools.
- Each trade is read from the token's side, so pools that list the token second are still labelled correctly.

## Limits

- GeckoTerminal returns the 300 most recent matching trades per pool from the last 24 hours. On busy tokens, raise `--min-usd` to see further back; the header shows the real time span.
- An arbitrage bot that buys in one pool and sells in another shows as both a buy and a sell, because it is both.

## Development

```bash
npm test
```

Tests run offline against fixtures, so they never depend on a live API.

## Contributing

Pull requests are welcome, and first-timers are too. Pick an issue labelled [good first issue](https://github.com/blixtrade/solana-whale-tracker/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) or [help wanted](https://github.com/blixtrade/solana-whale-tracker/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22), comment that you are taking it, and read [CONTRIBUTING.md](CONTRIBUTING.md). No API keys needed: the tests run offline.

[![Contributors](https://contrib.rocks/image?repo=blixtrade/solana-whale-tracker)](https://github.com/blixtrade/solana-whale-tracker/graphs/contributors)

## More free Solana tools from Blix Trade

| Tool | What it does |
|---|---|
| [solana-bubble-map](https://github.com/blixtrade/solana-bubble-map) | Holder bubble map for any Solana or pump.fun token. |
| [pump-fun-tracker](https://github.com/blixtrade/pump-fun-tracker) | Every new pump.fun launch on Solana, live in your terminal, the moment it is created. |
| [solana-rug-checker](https://github.com/blixtrade/solana-rug-checker) | Rug pull scanner for Solana and pump.fun tokens. |
| [solana-memecoin-screener](https://github.com/blixtrade/solana-memecoin-screener) | Screen trending, new and boosted Solana memecoins from the terminal. |
| [solana-wallet-tracker](https://github.com/blixtrade/solana-wallet-tracker) | Follow any Solana wallets and see every memecoin buy and sell they make: token, size in SOL and USD, and a Solscan link. |
| [solana-pnl-tracker](https://github.com/blixtrade/solana-pnl-tracker) | Profit and loss for any Solana wallet's memecoin trades, worked out from its on-chain transactions. |
| [memecoin-paper-trading](https://github.com/blixtrade/memecoin-paper-trading) | Practise Solana memecoin trading with fake SOL at real prices. |
| [memecoin-alert-bot](https://github.com/blixtrade/memecoin-alert-bot) | pump.fun alerts in Telegram and Discord. |
| [pump-fun-mcp](https://github.com/blixtrade/pump-fun-mcp) | An MCP server that gives Claude, Cursor and other AI assistants six Solana memecoin research tools: token info, rug check, top holders, a screener, whale trades and wallet trades. |

Want all of this in one place, live, with AI on every coin? **[Open BLIX](https://blixvip.com/?utm_source=github&utm_medium=readme&utm_campaign=solana-whale-tracker)**: the Solana memecoin terminal with 0% trading fees.

## Disclaimer

This is research software, not financial advice. Memecoins are extremely volatile and most go to zero. Never trade more than you can afford to lose. The data comes from free third-party APIs that can be wrong, late or unavailable.

## License

[MIT](LICENSE)
