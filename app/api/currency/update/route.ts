// app/api/currency/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchExchangeRates } from "@/lib/currency-api";
import { updateCurrencyRates, getCurrencyRates } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    // Fetch latest rates from API
    const rates = await fetchExchangeRates();

    if (!rates) {
      return NextResponse.json(
        { error: "Failed to fetch exchange rates from API" },
        { status: 500 }
      );
    }

    // Extract the rates we need
    const updatedRates = {
      baseCurrency: "USD",
      rates: [
        {
          code: "EUR",
          name: "Euro",
          symbol: "€",
          rate: rates.EUR || 0.92,
          flag: "🇪🇺",
        },
        {
          code: "GBP",
          name: "British Pound",
          symbol: "£",
          rate: rates.GBP || 0.78,
          flag: "🇬🇧",
        },
        {
          code: "JPY",
          name: "Japanese Yen",
          symbol: "¥",
          rate: rates.JPY || 152,
          flag: "🇯🇵",
        },
        {
          code: "AUD",
          name: "Australian Dollar",
          symbol: "A$",
          rate: rates.AUD || 1.52,
          flag: "🇦🇺",
        },
        {
          code: "IDR",
          name: "Indonesian Rupiah",
          symbol: "Rp",
          rate: rates.IDR || 15500,
          flag: "🇮🇩",
        },
      ],
      lastUpdated: new Date(),
    };

    // Update rates in Firestore
    await updateCurrencyRates(updatedRates);

    return NextResponse.json({
      success: true,
      rates: updatedRates,
      message: "Currency rates updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating currency rates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current rates from database
    const currentRates = await getCurrencyRates();

    if (!currentRates) {
      // If no rates exist, fetch and update
      const rates = await fetchExchangeRates();

      if (!rates) {
        return NextResponse.json(
          { error: "Failed to fetch exchange rates" },
          { status: 500 }
        );
      }

      const newRates = {
        baseCurrency: "USD",
        rates: [
          {
            code: "EUR",
            name: "Euro",
            symbol: "€",
            rate: rates.EUR || 0.92,
            flag: "🇪🇺",
          },
          {
            code: "GBP",
            name: "British Pound",
            symbol: "£",
            rate: rates.GBP || 0.78,
            flag: "🇬🇧",
          },
          {
            code: "JPY",
            name: "Japanese Yen",
            symbol: "¥",
            rate: rates.JPY || 152,
            flag: "🇯🇵",
          },
          {
            code: "AUD",
            name: "Australian Dollar",
            symbol: "A$",
            rate: rates.AUD || 1.52,
            flag: "🇦🇺",
          },
          {
            code: "IDR",
            name: "Indonesian Rupiah",
            symbol: "Rp",
            rate: rates.IDR || 15500,
            flag: "🇮🇩",
          },
        ],
        lastUpdated: new Date(),
      };

      await updateCurrencyRates(newRates);

      return NextResponse.json({
        success: true,
        rates: newRates,
        message: "Currency rates fetched and updated",
        timestamp: new Date().toISOString(),
      });
    }

    // Check if rates need updating (more than 6 hours old)
    const ratesData = currentRates as any;
    const lastUpdated =
      ratesData.lastUpdated?.toDate?.() || new Date(ratesData.lastUpdated);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff > 6) {
      // Auto-update rates
      const rates = await fetchExchangeRates();

      if (rates) {
        const updatedRates = {
          baseCurrency: "USD",
          rates: [
            {
              code: "EUR",
              name: "Euro",
              symbol: "€",
              rate:
                rates.EUR ||
                ratesData.rates?.find((r: any) => r.code === "EUR")?.rate ||
                0.92,
              flag: "🇪🇺",
            },
            {
              code: "GBP",
              name: "British Pound",
              symbol: "£",
              rate:
                rates.GBP ||
                ratesData.rates?.find((r: any) => r.code === "GBP")?.rate ||
                0.78,
              flag: "🇬🇧",
            },
            {
              code: "JPY",
              name: "Japanese Yen",
              symbol: "¥",
              rate:
                rates.JPY ||
                ratesData.rates?.find((r: any) => r.code === "JPY")?.rate ||
                152,
              flag: "🇯🇵",
            },
            {
              code: "AUD",
              name: "Australian Dollar",
              symbol: "A$",
              rate:
                rates.AUD ||
                ratesData.rates?.find((r: any) => r.code === "AUD")?.rate ||
                1.52,
              flag: "🇦🇺",
            },
            {
              code: "IDR",
              name: "Indonesian Rupiah",
              symbol: "Rp",
              rate:
                rates.IDR ||
                ratesData.rates?.find((r: any) => r.code === "IDR")?.rate ||
                15500,
              flag: "🇮🇩",
            },
          ],
          lastUpdated: new Date(),
        };

        await updateCurrencyRates(updatedRates);

        return NextResponse.json({
          success: true,
          rates: updatedRates,
          message: "Currency rates auto-updated",
          timestamp: new Date().toISOString(),
          wasAutoUpdated: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      rates: currentRates,
      message: "Current currency rates retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving currency rates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
