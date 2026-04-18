# 💳 Backend – Payment API (Visa Acceptance)

This is an Express backend that handles card payment processing using Visa Acceptance APIs.

It supports the full Microform-based payment lifecycle:
- Capture context generation
- Token-based authorization
- Transaction response handling

---

## 🚀 What this does

- Generates capture context for Flex Microform v2  
- Receives transient token from frontend  
- Sends authorization request to Visa Acceptance APIs  
- Returns transaction result to the frontend  

---

## 🔄 Payment Flow

1. Frontend requests capture context (`/api/card/setup`)  
2. Visa returns capture context + Microform config  
3. Customer enters card details securely via Microform  
4. Microform generates a transient token  
5. Frontend sends token to backend (`/api/card/pay`)  
6. Backend calls Visa Acceptance authorization APIs  
7. Response is returned to frontend  

---

## 🌐 API Endpoints

### 1. Generate Capture Context

GET /api/card/setup

Returns:
- captureContext  
- clientLibrary  
- clientLibraryIntegrity  

Used by the frontend to initialize Microform.

---

### 2. Authorize Payment

POST /api/card/pay

Request body:
{
  "transientToken": "string"
}

Returns:
- Authorization result  
- Transaction status  

---

## ▶️ Run locally

npm install  
npm start  

Runs at:  
http://localhost:4000

---

## 🔐 Configuration

Create a local configuration file:

backend/config/configuration.local.js

This file should contain your Visa Acceptance sandbox credentials.

This file is excluded from version control.

A sample configuration file is provided:

backend/config/configuration.js

---

## 📄 Certificate Setup

Place your .p12 certificate in:

backend/resource/

This is required for MLE-based authentication.

---

## 🔐 Authentication

This project uses:

- JWT-based authentication  
- MLE (.p12 certificate) for secure communication  

Key + Shared Secret authentication is deprecated and will be retired.

---

## ⚠️ Notes

- Uses Visa Acceptance sandbox environment  
- This is a demo implementation (not production-ready)  
- Do not commit credentials or certificates to source control  