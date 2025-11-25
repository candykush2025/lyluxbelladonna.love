// lib/currency.ts
import { getCurrencyRates, updateCurrencyRates } from "./firestore";

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to IDR
  flag: string;
}

export interface CurrencySettings {
  baseCurrency: string; // IDR
  rates: CurrencyRate[];
  lastUpdated: Date;
}

// Default currency rates (IDR is base currency) - Updated November 2025
export const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 1, flag: "🇮🇩" },
  {
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
    rate: 0.000064,
    flag: "🇺🇸",
  },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.00006, flag: "🇪🇺" },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    rate: 0.000051,
    flag: "🇬🇧",
  },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 0.0097, flag: "🇯🇵" },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: 0.000098,
    flag: "🇦�",
  },
];

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
  ID: "IDR", // Indonesia
  US: "USD", // United States
  GB: "GBP", // United Kingdom
  UK: "GBP", // United Kingdom (alternative)
  DE: "EUR", // Germany
  FR: "EUR", // France
  IT: "EUR", // Italy
  ES: "EUR", // Spain
  NL: "EUR", // Netherlands
  BE: "EUR", // Belgium
  AT: "EUR", // Austria
  PT: "EUR", // Portugal
  FI: "EUR", // Finland
  IE: "EUR", // Ireland
  GR: "EUR", // Greece
  JP: "JPY", // Japan
  AU: "AUD", // Australia
  CA: "USD", // Canada (uses USD)
  MX: "USD", // Mexico (uses USD)
};

export const getCurrencyForCountry = (countryCode: string): string => {
  return COUNTRY_CURRENCY_MAP[countryCode] || "USD";
};

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  rates: CurrencyRate[]
): string => {
  const currency = rates.find((c) => c.code === currencyCode);
  if (!currency) return `Rp${amount.toLocaleString("id-ID")}`;

  // Since rates are relative to IDR, amount is in IDR
  // For IDR, return as is; for others, convert using the rate
  let displayAmount: number;
  if (currencyCode === "IDR") {
    displayAmount = amount;
  } else {
    displayAmount = amount * currency.rate;
  }

  // Format based on currency
  switch (currencyCode) {
    case "IDR":
      return `${currency.symbol}${displayAmount.toLocaleString("id-ID")}`;
    case "JPY":
      return `${currency.symbol}${Math.round(displayAmount).toLocaleString(
        "ja-JP"
      )}`;
    case "EUR":
      return `${currency.symbol}${displayAmount.toFixed(2).replace(".", ",")}`;
    case "GBP":
      return `${currency.symbol}${displayAmount.toFixed(2)}`;
    case "AUD":
      return `${currency.symbol}${displayAmount.toFixed(2)}`;
    case "USD":
      return `${currency.symbol}${displayAmount.toFixed(2)}`;
    default:
      return `${currency.symbol}${displayAmount.toFixed(2)}`;
  }
};

export const convertPrice = (
  idrPrice: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRate[]
): number => {
  const fromRate = rates.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = rates.find((c) => c.code === toCurrency)?.rate || 1;

  // Convert to IDR first, then to target currency
  const idrAmount = idrPrice / fromRate;
  return idrAmount * toRate;
};
