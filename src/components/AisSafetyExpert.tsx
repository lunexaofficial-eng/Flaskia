import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, RefreshCw, CheckCircle, ShieldAlert } from "lucide-react";
import { Product } from "../data";

interface AisSafetyExpertProps {
  product: Product;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AisSafetyExpert({ product }: AisSafetyExpertProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on academic and chemical compliance standards
  const SUGGESTED_QS = [
    {
      label: "Required PPE Gear",
      text: `What full Personal Protective Equipment (PPE) is strictly required when pouring or handling ${product.name}?`
    },
    {
      label: "First Aid Protocol",
      text: `What are the exact GHS Section 4 First Aid measures if ${product.name} contacts skin or eyes?`
    },
    {
      label: "Storage & Incompatibles",
      text: `How should I store ${product.name} and what substances present violent/unsafe reaction triggers?`
    },
    {
      label: "Spill & Waste Disposal",
      text: `What is the certified laboratory waste disposal protocol for spill cleanup of ${product.name}?`
    }
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: "initial-welcome",
        sender: "ai",
        text: `Greetings! I am the **Rexvora SDS Safety Assistant**, trained on international GHS compliance and physical-chemical storage regulations. Let me assist you with proper handling guidelines for **${product.name} (CAS: ${product.cas})**. What safety or storage concern can I help clarify?`,
        timestamp: new Date()
      }
    ]);
  }, [product]);

  useEffect(() => {
    // Scroll safety feed to bottom ONLY within its own container, avoiding window jumping
    if (messages.length > 1 && feedContainerRef.current) {
      feedContainerRef.current.scrollTo({
        top: feedContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/safety-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          question: textToSend,
          physicalProperties: {
            formula: product.formula,
            cas: product.cas,
            purity: product.purity,
            grade: product.grade,
            meltingPoint: product.meltingPoint,
            boilingPoint: product.boilingPoint,
            weight: product.molecularWeight
          }
        })
      });

      if (!response.ok) {
        throw new Error("Safety network response compromised.");
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.answer || "Standard safety handling procedures are recommended. If exposure occurs, refer to GHS guidelines.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error communicating with safety assistant:", error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "🚨 **System Note:** Unable to securely verify AI safety data right now. Please execute local guidelines, wear recommended safety goggles/gloves, or inspect the printed Material Safety Data Sheet (MSDS) down below.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative" id="assistant-expert-box">
      
      {/* Assistant Header */}
      <div className="flex items-center gap-3 bg-slate-50 px-4.5 py-3.5 border-b border-slate-200">
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <Bot className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 leading-none">
            GHS Safety Assistant
            <span className="text-[10px] bg-blue-50 text-blue-600 active:scale-95 transition-all outline-hidden px-2 py-0.5 rounded-full border border-blue-100 font-semibold font-mono">
              COMPLY-AI
            </span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Educational Material Handling Consult</p>
        </div>
      </div>

      {/* Safety Message Feed */}
      <div 
        ref={feedContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/20"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${
              m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 border ${
                m.sender === "user"
                  ? "bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-100 text-slate-800 rounded-tr-none"
                  : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-3xs"
              }`}
            >
              {/* Highlight formatting codes like headings, bold keys, bullet points */}
              <div className="prose prose-xs max-w-none text-slate-700">
                {m.text.split("\n").map((line, idx) => {
                  let formatted = line;
                  // Handle bold markers (such as **text**)
                  if (formatted.includes("**")) {
                    const parts = formatted.split("**");
                    return (
                      <p key={idx} className="my-1.5 first:mt-0 last:mb-0">
                        {parts.map((p, pIdx) => 
                          pIdx % 2 !== 0 ? <strong key={pIdx} className="text-slate-900 font-bold font-heading">{p}</strong> : p
                        )}
                      </p>
                    );
                  }
                  
                  // Handle list items
                  if (formatted.startsWith("- ") || formatted.startsWith("* ")) {
                    return (
                      <li key={idx} className="list-disc list-inside ml-2 text-slate-500 my-0.5">
                        {line.substring(2)}
                      </li>
                    );
                  }

                  return <p key={idx} className="my-1.5 first:mt-0 last:mb-0">{formatted}</p>;
                })}
              </div>
              <span className="block mt-2 text-[9px] text-slate-400 font-mono text-right scale-95 opacity-80">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center text-slate-400 text-xs">
            <div className="w-7.5 h-7.5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Analyzing GHS registry database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Academic Inquiries */}
      <div className="p-2 border-t border-slate-200 bg-slate-50/50 shrink-0 select-none">
        <div className="text-[10px] text-slate-400 font-medium px-2 mb-1.5">Standard Safety Inquiries:</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none scrollbar-thin scrollbar-thumb-slate-200">
          {SUGGESTED_QS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              disabled={isLoading}
              className="shrink-0 text-[10.5px] bg-white hover:bg-slate-50 active:scale-95 disabled:scale-100 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-full px-3 py-1 cursor-pointer transition-colors font-medium shadow-3xs"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Inputs */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0 select-none"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Inquire about handling ${product.name}...`}
          disabled={isLoading}
          className="flex-1 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none font-sans transition-all shadow-3xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white disabled:bg-slate-100 disabled:text-slate-300 disabled:scale-100 p-2.5 rounded-xl cursor-pointer shadow-3xs"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
