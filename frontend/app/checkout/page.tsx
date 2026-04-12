"use client";

import { useEffect, useState } from "react";
import Microform from "./Microform";

export default function CheckoutPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:4000/api/card/setup");
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  if (!data) return <div className="p-10 space-y-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-10">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg grid grid-cols-2 overflow-hidden">

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

            {/* Item 1 */}
            <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
              <img
                src="/products/hoodie-set.jpg"
                className="w-20 h-20 object-cover rounded"
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

              <div className="font-semibold">$46.00</div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
              <img
                src="/products/jeans.jpg"
                className="w-20 h-20 object-cover rounded"
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

              <div className="font-semibold">$23.00</div>
            </div>

          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>$72.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>$10.73</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>$82.73</span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 bg-gray-50 flex flex-col justify-center">

          <h2 className="text-xl font-semibold mb-6">
            Pay with Credit Card
          </h2>

          <Microform
            captureContext={data.captureContext}
            clientLibrary={data.clientLibrary}
            integrity={data.clientLibraryIntegrity}
          />

        </div>

      </div>
    </div>
  );
}