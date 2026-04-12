# 💳 Backend – Payment API

This is an Express backend that handles payment processing using Visa Acceptance APIs.

## 🚀 What it does

* Generates capture context for Microform
* Receives transient token from frontend
* Sends authorization request to Visa APIs
* Returns transaction result

## ▶️ Run locally

```bash
npm install
npm start
```

Runs at:
http://localhost:4000

## 🌐 API Endpoint

The backend exposes the following endpoint:

GET http://localhost:4000/api/card/setup

This endpoint generates the capture context used by the frontend to initialize Microform.

Note: This endpoint is intended to be called by the frontend application.


## 🔐 Configuration

Update the following file with your sandbox credentials:

```
backend/config/Configuration.js
```

Place your `.p12` certificate in:

```
backend/resource/
```

## ⚠️ Authentication

This project uses JWT-based authentication.

Key + Shared Secret authentication is being deprecated and is expected to reach end-of-life by September 2026.


## ⚠️ Notes

* This is a sample implementation for educational purposes only
* Not production-ready
* Do not commit credentials or certificates to source control
