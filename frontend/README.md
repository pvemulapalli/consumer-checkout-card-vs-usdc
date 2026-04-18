# 🛍️ Frontend – Checkout UI

This is a Next.js frontend that renders a dual checkout experience using:

- **Visa Acceptance Flex Microform v2 (Card Payments)**
- **USDC on Solana (Stablecoin Payments)**

---

## 🖼 Checkout Experience

![Checkout Demo](../checkout-card-vs-usdc.png)

---

## 🚀 What this does

### 💳 Card Payments (Visa Acceptance – Flex Microform v2)

- Renders secure card input fields using Microform hosted iframes  
- Tokenizes card data directly in the browser  
- Generates a transient token (card data never touches your servers)  
- Sends token to backend for authorization via Visa Acceptance APIs  
- Displays transaction result to the user  

👉 Mirrors real-world enterprise card payment integrations

---

### 🪙 Stablecoin Payments (USDC on Solana)

- Connects to wallet via Solana Wallet Adapter  
- Fetches real-time USDC balance  
- Executes on-chain transfer using SPL Token Program  
- Confirms transaction and updates UI  

---

## 🔐 Why Flex Microform v2 matters

This implementation uses **Visa Acceptance Flex Microform v2**, which ensures:

- PCI DSS **SAQ-A compliance scope**  
- Sensitive card data is isolated in secure iframes  
- Your application never handles raw PAN data  
- Tokenization replaces card data with a secure transient token  

👉 This is the same pattern used in production-grade payment systems

---

## 🔄 Payment Flow (Card)

1. Customer enters card details into Microform fields  
2. Microform generates a transient token  
3. Frontend sends token to backend  
4. Backend calls Visa Acceptance authorization APIs  
5. Result is returned and displayed in UI  

---

## ▶️ Run locally

```bash
npm install
npm run dev

Runs at:
http://localhost:3000

---

## 🌐 Access the Application

Open in your browser:

http://localhost:3000/checkout

---

## 🔗 Backend dependency

This frontend expects the backend to be running at:
http://localhost:4000

---

## 🔐 Environment Variables

Create frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MERCHANT_WALLET=YOUR_DEVNET_WALLET

---

## ⚠️ Notes

* No raw card data is handled by the frontend
* Microform securely manages PCI-sensitive fields
* Uses Visa Acceptance sandbox environment
* Uses Solana Devnet (not mainnet)
* This is a demo project for learning and showcasing payment architectures