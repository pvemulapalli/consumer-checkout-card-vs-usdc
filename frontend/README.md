# 🛍️ Frontend – Checkout UI

This is a Next.js frontend that renders a checkout experience using Visa Flex Microform v2.

## 🚀 What it does

* Renders secure card fields using Microform
* Tokenizes card data in the browser
* Sends transient token to backend for processing
* Displays transaction result

## ▶️ Run locally

```bash
npm install
npm run dev
```

Runs at:
http://localhost:3000

## 🔗 Backend dependency

This frontend expects the backend to be running at:
http://localhost:4000

## 🌐 Access the Application

Open in your browser:

http://localhost:3000/checkout

This is the main checkout experience where you can test the payment flow.

## ⚠️ Notes

* No raw card data is handled by the frontend
* Microform securely handles PCI-sensitive fields
* This is a demo implementation for learning purposes only
