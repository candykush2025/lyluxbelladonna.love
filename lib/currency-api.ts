// lib/currency-api.ts
export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: ExchangeRates;
}

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXCHANGE_RATE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;

export const fetchExchangeRates = async (): Promise<ExchangeRates | null> => {
  try {
    if (!EXCHANGE_RATE_API_KEY) {
      console.error("Exchange Rate API key not found in environment variables");
      return null;
    }

    const response = await fetch(EXCHANGE_RATE_API_URL);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: CurrencyApiResponse = await response.json();

    if (data.result === "success") {
      return data.conversion_rates;
    }

    console.error("ExchangeRate API error:", data);
    return null;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
};

export const shouldUpdateRates = (lastUpdated: Date | null): boolean => {
  if (!lastUpdated) return true;

  const now = new Date();
  const timeDiff = now.getTime() - lastUpdated.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  // Update if more than 6 hours old
  return hoursDiff > 6;
};
