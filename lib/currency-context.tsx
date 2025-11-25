// lib/currency-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CurrencyRate,
  CurrencySettings,
  DEFAULT_CURRENCIES,
  getCurrencyForCountry,
} from "./currency";
import { getCurrencyRates } from "./firestore";
import { getUserLocation } from "./geolocation";

interface CurrencyContextType {
  currentCurrency: string;
  currencyRates: CurrencyRate[];
  setCurrentCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  // Initialize from localStorage if available
  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCurrency") || "IDR";
    }
    return "IDR";
  });
  const [currencyRates, setCurrencyRates] =
    useState<CurrencyRate[]>(DEFAULT_CURRENCIES);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency rates from database and auto-update if needed
  useEffect(() => {
    const loadCurrencyRates = async () => {
      try {
        // First try to get rates from our API which handles auto-updates
        const response = await fetch("/api/currency/update");
        const data = await response.json();

        if (data.success && data.rates) {
          const ratesData = data.rates as any;
          if (ratesData.rates) {
            // Ensure proper currency list with IDR first and USD
            let ratesArray = [...ratesData.rates];

            // Remove any broken USD entries
            ratesArray = ratesArray.filter((r: CurrencyRate) => {
              if (r.code === "USD" && (!r.flag || r.flag.includes("�"))) {
                return false;
              }
              return true;
            });

            // Ensure IDR is at the beginning
            const idrIndex = ratesArray.findIndex(
              (r: CurrencyRate) => r.code === "IDR"
            );
            if (idrIndex === -1) {
              // Add IDR at the beginning
              ratesArray.unshift({
                code: "IDR",
                name: "Indonesian Rupiah",
                symbol: "Rp",
                rate: 1,
                flag: "🇮🇩",
              });
            } else if (idrIndex > 0) {
              // Move IDR to the beginning
              const idrCurrency = ratesArray.splice(idrIndex, 1)[0];
              ratesArray.unshift(idrCurrency);
            }

            // Ensure USD exists
            const hasUSD = ratesArray.some(
              (r: CurrencyRate) => r.code === "USD"
            );
            if (!hasUSD) {
              // Add USD after IDR
              ratesArray.splice(1, 0, {
                code: "USD",
                name: "United States Dollar",
                symbol: "$",
                rate: 0.000064,
                flag: "🇺🇸",
              });
            }

            setCurrencyRates(ratesArray);
          }
        } else {
          // Fallback to direct database query
          const rates = await getCurrencyRates();
          if (rates && (rates as any).rates) {
            let ratesArray = [...(rates as any).rates];

            // Remove any broken USD entries
            ratesArray = ratesArray.filter((r: CurrencyRate) => {
              if (r.code === "USD" && (!r.flag || r.flag.includes("�"))) {
                return false;
              }
              return true;
            });

            // Ensure IDR is at the beginning
            const idrIndex = ratesArray.findIndex(
              (r: CurrencyRate) => r.code === "IDR"
            );
            if (idrIndex === -1) {
              // Add IDR at the beginning
              ratesArray.unshift({
                code: "IDR",
                name: "Indonesian Rupiah",
                symbol: "Rp",
                rate: 1,
                flag: "🇮🇩",
              });
            } else if (idrIndex > 0) {
              // Move IDR to the beginning
              const idrCurrency = ratesArray.splice(idrIndex, 1)[0];
              ratesArray.unshift(idrCurrency);
            }

            // Ensure USD exists
            const hasUSD = ratesArray.some(
              (r: CurrencyRate) => r.code === "USD"
            );
            if (!hasUSD) {
              // Add USD after IDR
              ratesArray.splice(1, 0, {
                code: "USD",
                name: "United States Dollar",
                symbol: "$",
                rate: 0.000064,
                flag: "🇺🇸",
              });
            }

            setCurrencyRates(ratesArray);
          }
        }
      } catch (error) {
        console.error("Failed to load currency rates:", error);
        // Fallback to default rates
        setCurrencyRates(DEFAULT_CURRENCIES);
      }
    };

    loadCurrencyRates();
  }, []);

  // Detect user location and set currency (only if no saved preference)
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        // Only auto-detect if user hasn't manually selected a currency
        const savedCurrency = localStorage.getItem("selectedCurrency");
        if (!savedCurrency) {
          const location = await getUserLocation();
          if (location && location.countryCode) {
            const detectedCurrency = getCurrencyForCountry(
              location.countryCode
            );
            if (
              detectedCurrency &&
              currencyRates.find((c) => c.code === detectedCurrency)
            ) {
              setCurrentCurrency(detectedCurrency);
              localStorage.setItem("selectedCurrency", detectedCurrency);
            }
          }
        }
      } catch (error) {
        console.error("Failed to detect user location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserCurrency();
  }, [currencyRates]);

  const formatPrice = (price: number): string => {
    // Handle IDR separately since it's the base currency
    if (currentCurrency === "IDR") {
      // Price is already in IDR, just format it
      const idrAmount = Math.round(price);
      return `Rp${idrAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }

    const currency = currencyRates.find((c) => c.code === currentCurrency);
    if (!currency) return `Rp${Math.round(price).toLocaleString("id-ID")}`;

    // Convert from IDR (base currency) to target currency
    const convertedAmount = price * currency.rate;

    // Format based on currency
    switch (currentCurrency) {
      case "USD":
        return `${currency.symbol}${convertedAmount.toFixed(2)}`;
      case "JPY":
        return `${currency.symbol}${Math.round(convertedAmount).toLocaleString(
          "ja-JP"
        )}`;
      case "EUR":
        return `${currency.symbol}${convertedAmount
          .toFixed(2)
          .replace(".", ",")}`;
      case "GBP":
        return `${currency.symbol}${convertedAmount.toFixed(2)}`;
      case "AUD":
        return `${currency.symbol}${convertedAmount.toFixed(2)}`;
      default:
        return `${currency.symbol}${convertedAmount.toFixed(2)}`;
    }
  };

  const convertPrice = (
    price: number,
    fromCurrency: string = "IDR"
  ): number => {
    // If converting to IDR, just return the price as-is
    if (currentCurrency === "IDR") {
      return fromCurrency === "IDR" ? price : price;
    }

    const fromRate =
      currencyRates.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate =
      currencyRates.find((c) => c.code === currentCurrency)?.rate || 1;

    // Convert to IDR first, then to target currency
    const idrAmount = price / fromRate;
    return idrAmount * toRate;
  };

  // Wrapper function to save currency selection to localStorage
  const handleSetCurrency = (currency: string) => {
    setCurrentCurrency(currency);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCurrency", currency);
    }
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencyRates,
    setCurrentCurrency: handleSetCurrency,
    formatPrice,
    convertPrice,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
