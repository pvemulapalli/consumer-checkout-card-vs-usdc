'use client';

import { useEffect, useState } from "react";
import Microform from "./microform";

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

const MERCHANT_WALLET = `${process.env.NEXT_PUBLIC_MERCHANT_WALLET}`;
const CHECKOUT_TOTAL = 100;
const CARD_FEES = 1.5 + 0.7 + 0.3;
const USDC_FEES = 0.0001;

const savings = CARD_FEES - USDC_FEES;
const savingsPercent = (savings / CHECKOUT_TOTAL) * 100;


export default function CheckoutPage() {
  const [data, setData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'usdc'>('card');

  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  const [cardCompleted, setCardCompleted] = useState(false);
  const [usdcCompleted, setUsdcCompleted] = useState(false);

  const fetchUSDCBalance = async () => {
    if (!publicKey) return;

    try {
      const ata = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const balanceInfo = await connection.getTokenAccountBalance(ata);

      const raw = balanceInfo.value.amount;
      const decimals = balanceInfo.value.decimals;
      const formatted = Number(raw) / Math.pow(10, decimals);

      setUsdcBalance(formatted);
    } catch {
      setUsdcBalance(0);
    }
  };

  const sendUSDC = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);

      const recipient = new PublicKey(MERCHANT_WALLET);
      const latestBlockhash = await connection.getLatestBlockhash();

      const senderATA = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      const recipientATA = await getAssociatedTokenAddress(
        USDC_MINT,
        recipient
      );

      const instructions = [];

      const senderAccount = await connection.getAccountInfo(senderATA);
      if (!senderAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            senderATA,
            publicKey,
            USDC_MINT
          )
        );
      }

      const recipientAccount = await connection.getAccountInfo(recipientATA);
      if (!recipientAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientATA,
            recipient,
            USDC_MINT
          )
        );
      }

      const decimals = 6;
      const rawAmount = Math.round(CHECKOUT_TOTAL * Math.pow(10, decimals));

      instructions.push(
        createTransferInstruction(
          senderATA,
          recipientATA,
          publicKey,
          rawAmount
        )
      );

      const message = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      setTxSignature(signature);
      setUsdcCompleted(true);
      await fetchUSDCBalance();
    } catch (err) {
      console.error(err);
      alert("USDC payment failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/setup`);
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUSDCBalance();
    } else {
      setUsdcBalance(null);
    }
  }, [connected, publicKey]);

  if (!data) {
    return <div className="p-10 space-y-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-10">
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-lg grid grid-cols-2 gap-6 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="p-10 space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded">
              LB
            </div>
            <div>
              <div className="font-semibold text-lg">Lilly’s Boutique</div>
              <div className="text-sm text-gray-500">
                Boutique Apparel Shop
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 mb-6"></div>

          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <div className="text-sm font-semibold mb-1">Bill To</div>
              <div>April Summers</div>
              <div className="text-gray-600 text-sm">
                4812 Willow Creek Lane
              </div>
              <div className="text-gray-600 text-sm">
                Frisco, TX 75034
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <div className="text-sm font-semibold mb-1">Ship To</div>
              <div>April Summers</div>
              <div className="text-gray-600 text-sm">
                4812 Willow Creek Lane
              </div>
              <div className="text-gray-600 text-sm">
                Frisco, TX 75034
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
              <img
                src="/products/hoodie-set.jpg"
                className="w-20 h-20 object-cover rounded"
                alt="Hoodie and Sweatpants Set"
              />

              <div className="flex-1">
                <div className="font-medium">
                  Hoodie and Sweatpants Set
                </div>
                <div className="text-sm text-gray-500">
                  Gold / Size M
                </div>
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 inline-block">
                  Boutique Favorite
                </span>
              </div>

              <div className="font-semibold">$60.00</div>
            </div>

            <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
              <img
                src="/products/jeans.jpg"
                className="w-20 h-20 object-cover rounded"
                alt="Cropped Denim Jeans"
              />

              <div className="flex-1">
                <div className="font-medium">Cropped Denim Jeans</div>
                <div className="text-sm text-gray-500">
                  Light Wash / Size 26
                </div>
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 inline-block">
                  Boutique Favorite
                </span>
              </div>

              <div className="font-semibold">$32.00</div>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>$92.00</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>$8.00</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>$100.00</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 bg-gray-50 flex flex-col justify-start">
          <h2 className="text-xl font-semibold mb-6">
            {paymentMethod === 'card' ? 'Pay with Card' : 'Pay with USDC'}
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`px-4 py-2 rounded ${
                paymentMethod === 'card'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Card (Visa Acceptance)
            </button>

            <button
              onClick={() => setPaymentMethod('usdc')}
              className={`px-4 py-2 rounded ${
                paymentMethod === 'usdc'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              USDC (Solana)
            </button>
          </div>

          {paymentMethod === 'card' && (
            <Microform
              captureContext={data.captureContext}
              clientLibrary={data.clientLibrary}
              integrity={data.clientLibraryIntegrity}
              onSuccess={() => setCardCompleted(true)}
            />
          )}

          {paymentMethod === 'usdc' && (
            <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">

              <WalletMultiButton />

              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  Wallet Balance
                </div>

                <div
                  className={`text-lg font-semibold ${
                    !connected
                      ? "text-gray-400"
                      : usdcBalance !== null && usdcBalance < CHECKOUT_TOTAL
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {!connected
                    ? "Connect wallet"
                    : usdcBalance === null
                    ? "Loading..."
                    : `${usdcBalance.toFixed(2)} USDC`}
                </div>
              </div>

              {usdcCompleted ? (
                <div className="w-full bg-green-600 text-white px-4 py-2 rounded text-center font-medium">
                  Order placed with USDC
                </div>
              ) : (
                <button
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
                  disabled={
                    !connected ||
                    loading ||
                    (usdcBalance !== null && usdcBalance < CHECKOUT_TOTAL)
                  }
                  onClick={sendUSDC}
                >
                  {loading
                    ? "Processing..."
                    : !connected
                    ? "Connect wallet to pay"
                    : usdcBalance !== null && usdcBalance < CHECKOUT_TOTAL
                    ? "Not enough USDC to complete purchase."
                    : "Pay 100.00 USDC"}
                </button>
              )}

              {usdcCompleted && txSignature && (
                <div className="text-sm text-green-600 mt-2">
                  Payment Successful
                  <br />
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View Transaction
                  </a>
                </div>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                🔒 Secure payment via your Solana wallet with USDC (devnet)
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            Compare how funds move and what the merchant actually receives.
          </div>

          {/* Merchant Economics: only show after successful payments */}
          {(cardCompleted || usdcCompleted) && (
            <div className="mt-8 bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Merchant Economics
              </h3>

              {/* Highlight Banner (only after USDC) */}
              {usdcCompleted && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-green-700 font-semibold text-lg">
                    Merchant boosts margin by $2.50 per txn using USDC
                  </div>
                  <div className="text-green-600 text-sm mt-1">
                    ~2.5% improvement vs card payments
                  </div>
                </div>
              )}

              {/* ALWAYS SAME LAYOUT */}
              <div className="flex gap-6 w-full">

                {/* CARD */}
                {cardCompleted && (
                  <div className="flex-1 border rounded-xl p-6 flex flex-col">
                    <h4 className="font-semibold mb-4 text-lg">
                      Card (Visa Acceptance)
                    </h4>

                    <div className="flex justify-between">
                      <span>Customer Pays</span>
                      <span>$100.00</span>
                    </div>

                    <div className="flex justify-between text-gray-600 mt-2">
                      <span>Issuer (Interchange)</span>
                      <span>$1.50</span>
                    </div>

                    <div className="flex justify-between text-gray-600 mt-2">
                      <span>Acquirer</span>
                      <span>$0.70</span>
                    </div>

                    <div className="flex justify-between text-gray-600 mt-2">
                      <span>Network (Visa)</span>
                      <span>$0.30</span>
                    </div>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Merchant Receives</span>
                      <span>$97.50</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      Settlement: 1–2 days
                    </div>
                  </div>
                )}

                {/* USDC */}
                {usdcCompleted && (
                  <div className="flex-1 border rounded-xl p-6 flex flex-col">
                    <h4 className="font-semibold mb-4 text-lg">
                      USDC (Solana)
                    </h4>

                    <div className="flex justify-between">
                      <span>Customer Pays</span>
                      <span>100.00 USDC</span>
                    </div>

                    <div className="flex justify-between text-gray-600 mt-2">
                      <span>Network Fee</span>
                      <span>~$0.0001</span>
                    </div>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Merchant Receives</span>
                      <span className="text-green-600">$100.00</span>
                    </div>

                    <div className="text-green-600 text-sm mt-2">
                      +$2.50 vs card
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      Settlement: ~2–5 seconds
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Excludes conversion and custody costs
                    </div>
                  </div>
                )}

              </div>

              <div className="mt-6 text-sm text-gray-600">
                Card payments distribute fees across issuers, acquirers, and networks. Stablecoin payments settle directly between customer and merchant.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}