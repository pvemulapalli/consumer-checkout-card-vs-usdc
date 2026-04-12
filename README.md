# 💳 Visa Flex Microform v2 Demo (End-to-End)

This project demonstrates a working end-to-end payment flow using Visa Acceptance Flex Microform v2.

It includes a simple checkout UI, secure card tokenization using Microform, backend authorization, and transaction visibility in Enterprise Business Center.

---

## 🧠 Why I Built This

I spent time implementing Visa Flex Microform end-to-end and realized that most of the friction does not come from APIs.

It comes from understanding how frontend tokenization, backend processing, and gateway validation all connect.

Small mistakes in that flow can result in:

- Token not being passed correctly  
- Silent validation failures  
- Payments failing without clear errors  

This project is a working reference designed to help developers avoid that friction and get to a successful transaction faster.


## ⚠️ Disclaimer

This project is based on personal work and is not affiliated with or supported by Visa.

The code is provided for educational purposes only and is not production-ready.

---

## 🧱 Project Structure

frontend/   → Next.js checkout UI  
backend/    → Express API for capture context + payment  

---

## 🚀 Quick Start

1. Clone repo

git clone <your-repo-url>  
cd visa-flex-microform-demo  

---

2. Start backend

cd backend  
npm install  
npm start  

Runs at:  
http://localhost:4000  

---

3. Start frontend

cd frontend  
npm install  
npm run dev  

Runs at:  
http://localhost:3000  

---

## 🌐 Application URLs

Once both services are running:

Frontend (Checkout UI):
http://localhost:3000/checkout

Backend API (Capture Context):
http://localhost:4000/api/card/setup

Note: The backend endpoint is called automatically by the frontend and does not need to be accessed directly.


## 🧪 Test Card

4111 1111 1111 1111  
Any future expiration date  
Any CVV  

---

## 🧠 How the Flow Works

1. Backend generates capture context  
2. Frontend initializes Flex Microform  
3. User enters card details securely  
4. Microform returns a transient token  
5. Frontend sends token to backend  
6. Backend creates payment authorization  
7. Transaction appears in Enterprise Business Center  

---

## 🛠️ Visa Acceptance Sandbox Setup

1. Create a sandbox account  

Go to: https://developer.visaacceptance.com  

- Sign up  
- Create a sandbox project  
- Enable Payments / Flex Microform APIs  

---

2. Generate credentials  

From the dashboard:  

- Merchant ID  
- Key Alias  
- Key Password  

---

## 🔐 Generating a .p12 Certificate

1. In Visa Acceptance portal:  

- Go to Key Management  
- Create a key  
- Download the .p12 file  

---

2. Place file in project  

backend/resource/  

---

3. Update configuration  

Edit backend/config/Configuration.js  

Update values:

MerchantId  
KeyAlias  
KeyPass  

---

## ⚠️ Important Note on Authentication

Visa is moving away from Key + Shared Secret authentication.

This method is expected to reach end-of-life by September 2026.

This project uses JWT-based authentication, which is the recommended approach going forward.

---

## ⚠️ Common Issues

Token undefined → frontend payload mismatch  
Processing stuck → React state issue with Microform  
Missing card number → backend not receiving token  
Expiration errors → invalid date  

---

## 🧠 Key Learning

The main challenge is not rendering UI.

It is correctly handling:

- Tokenization flow  
- React lifecycle interactions  
- Backend request structure  
- Gateway validation  

---

## 📸 Demo

Below is a sample checkout experience using Flex Microform:

![Checkout Demo](./checkout-demo.png)

---

## 🚀 Final Thought

Payments integrations are rarely just about APIs.

They require understanding how frontend security, backend processing, and network responses all work together.

This project is meant to help bridge that gap.