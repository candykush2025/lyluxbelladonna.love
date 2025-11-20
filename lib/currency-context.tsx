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
  const [currentCurrency, setCurrentCurrency] = useState<string>("USD");
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
            setCurrencyRates(ratesData.rates);
          }
        } else {
          // Fallback to direct database query
          const rates = await getCurrencyRates();
          if (rates && (rates as any).rates) {
            setCurrencyRates((rates as any).rates);
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

  // Detect user location and set currency
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const location = await getUserLocation();
        if (location && location.countryCode) {
          const detectedCurrency = getCurrencyForCountry(location.countryCode);
          if (
            detectedCurrency &&
            currencyRates.find((c) => c.code === detectedCurrency)
          ) {
            setCurrentCurrency(detectedCurrency);
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
    // Handle USD separately since it's the base currency
    if (currentCurrency === "USD") {
      return `$${price.toFixed(2)}`;
    }

    const currency = currencyRates.find((c) => c.code === currentCurrency);
    if (!currency) return `$${price.toFixed(2)}`;

    const convertedAmount = price * currency.rate;

    // Format based on currency
    switch (currentCurrency) {
      case "IDR":
        // Indonesian Rupiah: integer only, use dots as thousand separators
        const idrAmount = Math.round(convertedAmount);
        return `${currency.symbol}${idrAmount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
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
    fromCurrency: string = "USD"
  ): number => {
    // If converting to USD, just return the price as-is
    if (currentCurrency === "USD") {
      return fromCurrency === "USD" ? price : price;
    }

    const fromRate =
      currencyRates.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate =
      currencyRates.find((c) => c.code === currentCurrency)?.rate || 1;

    // Convert to USD first, then to target currency
    const usdAmount = price / fromRate;
    return usdAmount * toRate;
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencyRates,
    setCurrentCurrency,
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
