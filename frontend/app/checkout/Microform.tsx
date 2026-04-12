"use client";

import { useEffect, useRef, useState } from "react";

export default function Microform({
  captureContext,
  clientLibrary,
  integrity,
}: any) {
  const microformRef = useRef<any>(null);

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function init() {
      try {
        if (!(window as any).Flex) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");

            script.src = clientLibrary;

            if (integrity) {
              script.integrity = integrity;
              script.crossOrigin = "anonymous";
            }

            script.onload = () => resolve();
            script.onerror = () => reject("Microform failed");

            document.head.appendChild(script);
          });
        }

        const Flex = (window as any).Flex;
        const flex = new Flex(captureContext);
        const microform = flex.microform("card");

        microformRef.current = microform;

        setTimeout(() => {
          const number = microform.createField("number");
          const cvv = microform.createField("securityCode");

          number.load("#number-container");
          cvv.load("#cvv-container");

          console.log("✅ Fields mounted");
        }, 100);
      } catch (e) {
        console.error("Microform init error:", e);
      }
    }

    init();
  }, [captureContext, clientLibrary, integrity]);

const handlePay = () => {
  console.log("Pay clicked");

  if (!microformRef.current) {
    console.error("Microform not ready");
    return;
  }

  const expMonth = (document.getElementById("expMonth") as HTMLSelectElement).value;
  const expYear = (document.getElementById("expYear") as HTMLSelectElement).value;

  console.log("Attempting tokenization...");

  microformRef.current.createToken(
    {
      expirationMonth: expMonth,
      expirationYear: expYear,
    },
    async (err: any, token: any) => {
      console.log("🔥 TOKEN CALLBACK ENTERED");

      if (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage("Invalid card details");
        return;
      }

      try {
        setStatus("processing"); // ✅ MOVE HERE

        const res = await fetch("http://localhost:4000/api/card/pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transientToken: token,
          }),
        });

        const data = await res.json();

        if (data.status === "success") {
          setTransactionId(data.data.id);
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage("Payment failed");
        }
      } catch (e) {
        setStatus("error");
        setErrorMessage("Server error");
      }
    }
  );
};

  // ================= UI STATES =================

  if (status === "processing") {
    return <div className="text-lg">Processing payment...</div>;
  }

  if (status === "success") {
    const ebcUrl = `https://ebc2test.cybersource.com/ebc2/app/TransactionManagement/details?requestId=${transactionId}&merchantId=lilysboutique_sandbox001&dmTransaction=true&fromSimilarSearch=false&parentPage=transactions`;

    return (
        <div className="p-6 border rounded bg-green-50">
        <h2 className="text-xl font-semibold mb-2">Payment Successful ✅</h2>

        <p className="mb-2">Transaction ID:</p>

        <a
            href={ebcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-blue-600 underline hover:text-blue-800"
        >
            {transactionId}
        </a>

        <p className="text-xs text-gray-500 mt-3">
            Opens in Enterprise Business Center
        </p>
        </div>
    );
 }

  if (status === "error") {
    return (
      <div className="p-6 border rounded bg-red-50">
        <h2 className="text-xl font-semibold mb-2">Payment Failed ❌</h2>
        <p>{errorMessage}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 bg-black text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ================= DEFAULT FORM =================

    return (
    <div className="max-w-md bg-white border rounded-xl p-6 shadow-sm space-y-5">

        <div className="flex gap-2 mb-2">
            <img src="https://img.icons8.com/color/48/visa.png" className="w-8" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="w-8" />
            <img src="https://img.icons8.com/color/48/amex.png" className="w-8" />
        </div>

        {/* Card Number */}
        <div>
        <label className="block text-sm font-medium mb-1">
            Card Number
        </label>
        <div id="number-container" className="h-12 border border-gray-300 rounded-lg px-3 flex items-center bg-white focus-within:ring-2 focus-within:ring-black" />
        </div>

        {/* Exp + CVV */}
        <div className="flex gap-4">

        <div>
            <label className="block text-sm mb-1">MM</label>
            <select id="expMonth" className="border h-12 px-3 rounded-lg bg-white shadow-sm">
            {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <option key={m}>{m}</option>;
            })}
            </select>
        </div>

        <div>
            <label className="block text-sm mb-1">YY</label>
            <select id="expYear" className="border h-12 px-3 rounded-lg bg-white shadow-sm">
            {Array.from({ length: 10 }, (_, i) => {
                const y = new Date().getFullYear() + i;
                return <option key={y}>{y}</option>;
            })}
            </select>
        </div>

        <div className="flex-1">
            <label className="block text-sm mb-1">CVV</label>
            <div id="cvv-container" className="h-12 border border-gray-300 rounded-lg px-3 flex items-center bg-white focus-within:ring-2 focus-within:ring-black" />
        </div>
        </div>

        <button
        type="button"
        onClick={handlePay}
        className="w-full bg-black text-white py-4 rounded-lg mt-4 text-lg font-semibold hover:bg-gray-900 transition cursor-pointer"
        >
        Pay $82.73
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
        🔒 Secure payment powered by Visa Acceptance Solutions
        </p>

    </div>
    );
}