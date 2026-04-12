'use client';

import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function USDCTestPage() {
  const { publicKey, connected } = useWallet();

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
            {connected && publicKey
              ? publicKey.toBase58()
              : 'Not connected'}
          </p>
        </div>

        {/* Connect Wallet */}
        <WalletMultiButton />

        {/* Pay Button */}
        <button
          className="bg-black text-white px-4 py-2 rounded w-full"
          disabled={!connected}
          onClick={() => alert('USDC payment coming next')}
        >
          {connected ? 'Pay with USDC' : 'Connect wallet first'}
        </button>

        <p className="text-sm text-gray-500">
          Transaction status will appear here
        </p>

      </div>
    </div>
  );
}