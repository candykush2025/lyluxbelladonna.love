// lib/currency.ts
import { getCurrencyRates, updateCurrencyRates } from "./firestore";

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD
  flag: string;
}

export interface CurrencySettings {
  baseCurrency: string; // USD
  rates: CurrencyRate[];
  lastUpdated: Date;
}

// Default currency rates (top 5 international currencies + IDR) - Updated November 2025
export const DEFAULT_CURRENCIES: CurrencyRate[] = [
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.78, flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 152, flag: "🇯🇵" },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: 1.52,
    flag: "🇦🇺",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    rate: 15500,
    flag: "🇮🇩",
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
  if (!currency) return `$${amount.toFixed(2)}`;

  const convertedAmount = amount * currency.rate;

  // Format based on currency
  switch (currencyCode) {
    case "IDR":
      return `${currency.symbol}${convertedAmount.toLocaleString("id-ID")}`;
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

export const convertPrice = (
  usdPrice: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRate[]
): number => {
  const fromRate = rates.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = rates.find((c) => c.code === toCurrency)?.rate || 1;

  // Convert to USD first, then to target currency
  const usdAmount = usdPrice / fromRate;
  return usdAmount * toRate;
};
