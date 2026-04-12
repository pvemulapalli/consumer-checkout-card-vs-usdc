# Consumer Checkout: Card vs USDC (Solana)

Consumers today have more payment choices than ever before.

This project simulates a real checkout experience where a shopper can choose between:

- Paying with a traditional credit card (Visa Flex Microform)
- Paying with USDC using a Solana wallet

## What this project demonstrates

This is not just a payment integration demo.

It highlights the differences between card-based payments and blockchain-based stablecoin payments across:

- Shopper experience
- Payment flow
- Settlement speed
- Merchant fees (illustrative)
- Chargeback risk

## Project structure

- Card payments are powered by an existing Visa Flex Microform integration
- USDC payments are implemented using Solana tooling and wallet interactions
- A comparison layer shows side-by-side tradeoffs for merchants and consumers

## Important notes

- This is a demo project for educational and exploratory purposes
- Merchant fees and settlement timing are illustrative, not production-grade
- No real funds should be used in this demo (devnet only for Solana)

## Solana integration

The Solana payment flow is being built using guidance and scaffolding from Solana.new, and extended into a real checkout experience.

## Status

🚧 In Progress:
- Card checkout (working)
- USDC checkout (in progress)
- Comparison view (planned)

---

If you are exploring the future of payments, this project aims to make those tradeoffs visible in a practical way.