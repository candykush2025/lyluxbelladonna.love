// components/CurrencySelector.tsx
"use client";

import { useState } from "react";
import { useCurrency } from "@/lib/currency-context";

export default function CurrencySelector() {
  const { currentCurrency, currencyRates, setCurrentCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Use the currency rates from context (already includes IDR and all currencies)
  const allCurrencies = currencyRates;

  const currentCurrencyData = allCurrencies.find(
    (c) => c.code === currentCurrency
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:border-primary"
      >
        <span className="text-base">{currentCurrencyData?.flag || "🌐"}</span>
        <span>{currentCurrency}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-[#1a2332] rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {allCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrentCurrency(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currency.code === currentCurrency
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-lg">{currency.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-gray-500">
                      {currency.name}
                    </div>
                  </div>
                  <span className="text-gray-500">
                    {currency.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


