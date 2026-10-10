import React, { useState, useRef, useEffect } from "react";
import { useCurrency, SUPPORTED_CURRENCIES } from "../context/CurrencyContext";
import { ChevronDown, Check } from "lucide-react";

interface CurrencySelectorProps {
  align?: "left" | "right";
}

export default function CurrencySelector({ align = "left" }: CurrencySelectorProps) {
  const { currency, currencyInfo, setCurrency, exchangeRates } = useCurrency();
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
        className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
      >
        <span className="text-sm leading-none">{currencyInfo.flag}</span>
        <span className="font-mono font-semibold text-slate-900">{currencyInfo.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0 left-auto" : "left-0 right-auto"
          } mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-[120] overflow-hidden animate-fade-in`}
        >
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-medium text-slate-500">
            Select Currency
          </div>

          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
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
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#0052cc] text-white font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{c.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1 font-mono font-semibold">
                        <span>{c.code}</span>
                        <span className={isSelected ? "text-blue-100" : "text-slate-400"}>
                          ({c.symbol.trim()})
                        </span>
                      </div>
                      <div className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                        {c.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {rate !== 1 ? `${rate < 10 ? rate.toFixed(2) : Math.round(rate)}` : "1.00"}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
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
