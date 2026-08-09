import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "AED", symbol: "AED ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "SAR", symbol: "SAR ", name: "Saudi Riyal", flag: "🇸🇦" },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.50,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  CAD: 1.35,
  AUD: 1.52,
  SGD: 1.34,
  JPY: 155.0,
  SAR: 3.75,
};

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  currencyInfo: CurrencyInfo;
  setCurrency: (code: string) => void;
  exchangeRates: Record<string, number>;
  isLoadingRates: boolean;
  detectedCountry: string;
  detectedCountryCode: string;
  convertPrice: (usdAmount: number, targetCode?: string) => { value: number; formatted: string; symbol: string; code: string };
  formatPrice: (usdAmount: number, targetCode?: string) => string;
  allCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

function detectDefaultCurrencyByLocale(): { currency: string; countryName: string; countryCode: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = navigator.language || "";

    if (tz.includes("Kolkata") || tz.includes("Calcutta") || lang.includes("en-IN") || lang.includes("hi-IN")) {
      return { currency: "INR", countryName: "India 🇮🇳", countryCode: "IN" };
    }
    if (tz.includes("London") || lang.includes("en-GB")) {
      return { currency: "GBP", countryName: "United Kingdom 🇬🇧", countryCode: "GB" };
    }
    if (tz.includes("Europe/Paris") || tz.includes("Europe/Berlin") || tz.includes("Europe/Rome") || tz.includes("Europe/Madrid")) {
      return { currency: "EUR", countryName: "European Union 🇪🇺", countryCode: "EU" };
    }
    if (tz.includes("Dubai") || tz.includes("Muscat")) {
      return { currency: "AED", countryName: "United Arab Emirates 🇦🇪", countryCode: "AE" };
    }
    if (tz.includes("Toronto") || tz.includes("Vancouver") || lang.includes("en-CA")) {
      return { currency: "CAD", countryName: "Canada 🇨🇦", countryCode: "CA" };
    }
    if (tz.includes("Sydney") || tz.includes("Melbourne") || lang.includes("en-AU")) {
      return { currency: "AUD", countryName: "Australia 🇦🇺", countryCode: "AU" };
    }
    if (tz.includes("Tokyo") || lang.includes("ja")) {
      return { currency: "JPY", countryName: "Japan 🇯🇵", countryCode: "JP" };
    }
    if (tz.includes("America/")) {
      return { currency: "USD", countryName: "United States 🇺🇸", countryCode: "US" };
    }
  } catch (e) {
    console.warn("Timezone detection exception:", e);
  }
  // Native Marketplace Base default: INR (India)
  return { currency: "INR", countryName: "India 🇮🇳", countryCode: "IN" };
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialDetection = detectDefaultCurrencyByLocale();
  
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem("chemlabs_user_currency");
    if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
      return saved;
    }
    return initialDetection.currency;
  });

  const [detectedCountry, setDetectedCountry] = useState<string>(initialDetection.countryName);
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>(initialDetection.countryCode);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);

  // 1. Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveRates() {
      // Check cached rates first
      try {
        const cachedStr = localStorage.getItem("chemlabs_exchange_rates");
        const cachedTime = localStorage.getItem("chemlabs_exchange_rates_time");
        if (cachedStr && cachedTime) {
          const ageHours = (Date.now() - parseInt(cachedTime, 10)) / (1000 * 60 * 60);
          if (ageHours < 12) {
            const parsed = JSON.parse(cachedStr);
            if (parsed && parsed.INR && parsed.EUR) {
              setExchangeRates(parsed);
              setIsLoadingRates(false);
            }
          }
        }
      } catch (err) {
        console.warn("Error reading cached rates:", err);
      }

      // Fetch fresh live exchange rates from open API
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && data.rates.INR) {
            if (isMounted) {
              const freshRates = { ...FALLBACK_RATES, ...data.rates };
              setExchangeRates(freshRates);
              localStorage.setItem("chemlabs_exchange_rates", JSON.stringify(freshRates));
              localStorage.setItem("chemlabs_exchange_rates_time", Date.now().toString());
            }
          }
        }
      } catch (e) {
        console.warn("Could not fetch open.er-api rates, using fallback rates:", e);
      } finally {
        if (isMounted) setIsLoadingRates(false);
      }
    }

    fetchLiveRates();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real Geolocation IP Lookup to detect exact country & native currency
  useEffect(() => {
    let isMounted = true;
    const hasManualSelection = localStorage.getItem("chemlabs_user_currency");

    async function detectGeo() {
      try {
        // Try fast IP geolocation API with 2.5s controller timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.currency && isMounted) {
            const country = data.country_name ? `${data.country_name} ${getFlagEmoji(data.country_code)}` : data.country_code;
            setDetectedCountry(country);
            setDetectedCountryCode(data.country_code || "IN");

            // Only auto-switch if user hasn't explicitly set a custom currency override
            if (!hasManualSelection) {
              const matchedCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === data.currency);
              if (matchedCurrency) {
                setCurrencyState(matchedCurrency.code);
              } else if (data.country_code === "IN") {
                setCurrencyState("INR");
              }
            }
          }
        }
      } catch (err) {
        // Fallback silently if blocked or timeout
      }
    }

    detectGeo();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem("chemlabs_user_currency", code);
  };

  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  const currencySymbol = currencyInfo.symbol;

  const convertPrice = useCallback(
    (usdAmount: number, targetCode?: string) => {
      const activeCode = targetCode || currency;
      const rate = exchangeRates[activeCode] || FALLBACK_RATES[activeCode] || 1.0;
      const convertedValue = usdAmount * rate;
      const info = SUPPORTED_CURRENCIES.find((c) => c.code === activeCode) || SUPPORTED_CURRENCIES[0];

      // Format with appropriate decimal precision
      let formatted: string;
      if (activeCode === "JPY") {
        formatted = `${info.symbol}${Math.round(convertedValue).toLocaleString()}`;
      } else if (activeCode === "INR") {
        formatted = `${info.symbol}${convertedValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        formatted = `${info.symbol}${convertedValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      return {
        value: convertedValue,
        formatted,
        symbol: info.symbol,
        code: activeCode,
      };
    },
    [currency, exchangeRates]
  );

  const formatPrice = useCallback(
    (usdAmount: number, targetCode?: string) => {
      return convertPrice(usdAmount, targetCode).formatted;
    },
    [convertPrice]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        currencyInfo,
        setCurrency,
        exchangeRates,
        isLoadingRates,
        detectedCountry,
        detectedCountryCode,
        convertPrice,
        formatPrice,
        allCurrencies: SUPPORTED_CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
