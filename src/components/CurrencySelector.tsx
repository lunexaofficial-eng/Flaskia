import React, { useState, useRef, useEffect } from "react";
import { useCurrency, SUPPORTED_CURRENCIES } from "../context/CurrencyContext";
import { Globe, ChevronDown, Check, RefreshCw } from "lucide-react";

interface CurrencySelectorProps {
  align?: "left" | "right";
}

export default function CurrencySelector({ align = "left" }: CurrencySelectorProps) {
  const { currency, currencyInfo, setCurrency, detectedCountry, exchangeRates, isLoadingRates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-extrabold text-xs px-2.5 py-1.5 rounded-xl cursor-pointer transition shadow-2xs group"
        title={`Detected Location: ${detectedCountry}. Click to change currency.`}
      >
        <span className="text-sm leading-none">{currencyInfo.flag}</span>
        <span className="font-mono font-black">{currencyInfo.code}</span>
        <span className="text-slate-500 font-mono font-bold">({currencyInfo.symbol.trim()})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${align === "right" ? "right-0 left-auto" : "left-0 right-auto"} mt-1.5 w-64 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-fade-in divide-y divide-slate-100`}>
          {/* Header Info */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600" /> Location Detected
              </span>
              {isLoadingRates && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />}
            </div>
            <div className="text-xs font-black text-slate-900 mt-0.5 truncate">
              {detectedCountry}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Base: <strong>1 USD = ₹{(exchangeRates["INR"] || 83.5).toFixed(2)} INR</strong>
            </div>
          </div>

          {/* Currency List Options */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {SUPPORTED_CURRENCIES.map((c) => {
              const isSelected = c.code === currency;
              const rate = exchangeRates[c.code] || 1;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{c.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1 font-mono font-extrabold">
                        <span>{c.code}</span>
                        <span className={isSelected ? "text-emerald-100" : "text-slate-400"}>({c.symbol.trim()})</span>
                      </div>
                      <div className={`text-[10px] ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>
                        {c.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                      {rate !== 1 ? `1$=${rate < 10 ? rate.toFixed(2) : Math.round(rate)}` : "1.00"}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
