'use client';

import { useState } from 'react';

export default function USDCTestPage() {
  const [wallet, setWallet] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">

        <h1 className="text-2xl font-semibold">
          USDC Payment Test (Solana)
        </h1>

        {/* Wallet Status */}
        <div>
          <p className="text-sm text-gray-600">Wallet Status:</p>
          <p className="font-medium">
            {wallet ? wallet : 'Not connected'}
          </p>
        </div>

        {/* Connect Wallet */}
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => alert('Wallet connection coming next')}
        >
          Connect Wallet
        </button>

        {/* Pay Button */}
        <button
          className="bg-black text-white px-4 py-2 rounded w-full"
          onClick={() => alert('USDC payment coming next')}
        >
          Pay with USDC
        </button>

        <p className="text-sm text-gray-500">
          Transaction status will appear here
        </p>

      </div>
    </div>
  );
}