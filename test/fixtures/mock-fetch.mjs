const fixturePairs = [
  {
    pairAddress: "pool111111111111111111111111111111111111111",
    baseToken: { address: "So11111111111111111111111111111111111111112", symbol: "SOL", name: "Wrapped SOL" },
    quoteToken: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", name: "USD Coin" },
    liquidity: { usd: 10000000 },
    dexId: "raydium",
    priceUsd: "200",
  },
];

const fixtureTrades = {
  data: [
    {
      id: "trade_1",
      type: "trade",
      attributes: {
        block_timestamp: "2026-11-20T12:00:00Z",
        tx_hash: "sig1111111111111111111111111111111111111111111111111111111111111111",
        tx_from_address: "wallet111111111111111111111111111111111111111",
        kind: "buy",
        from_token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        to_token_address: "So11111111111111111111111111111111111111112",
        from_token_amount: "2000",
        to_token_amount: "10",
        price_to_in_usd: "200",
        volume_in_usd: "2000",
      },
    },
    {
      id: "trade_2",
      type: "trade",
      attributes: {
        block_timestamp: "2026-11-20T12:05:00Z",
        tx_hash: "sig2222222222222222222222222222222222222222222222222222222222222222",
        tx_from_address: "wallet222222222222222222222222222222222222222",
        kind: "sell",
        from_token_address: "So11111111111111111111111111111111111111112",
        to_token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        from_token_amount: "5",
        to_token_amount: "1000",
        price_from_in_usd: "200",
        volume_in_usd: "1000",
      },
    },
  ],
};

globalThis.fetch = async (url) => {
  const urlStr = String(url);
  if (urlStr.includes("dexscreener.com")) {
    return {
      ok: true,
      status: 200,
      json: async () => fixturePairs,
      text: async () => JSON.stringify(fixturePairs),
    };
  }
  if (urlStr.includes("geckoterminal.com")) {
    return {
      ok: true,
      status: 200,
      json: async () => fixtureTrades,
      text: async () => JSON.stringify(fixtureTrades),
    };
  }
  return {
    ok: false,
    status: 404,
    json: async () => ({}),
    text: async () => "Not Found",
  };
};
