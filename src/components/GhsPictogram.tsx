import React from "react";
import { 
  Flame, 
  Skull, 
  Ban, 
  Trash2, 
  CheckCircle, 
  Info,
  Waves,
  ShieldAlert
} from "lucide-react";

interface GhsPictogramProps {
  key?: string | number;
  type: "corrosive" | "toxic" | "irritant" | "environment" | "flammable" | "safe";
  size?: "sm" | "md";
}

export default function GhsPictogram({ type, size = "md" }: GhsPictogramProps) {
  const isSm = size === "sm";

  // Configuration for hazard categories
  const config = {
    corrosive: {
      title: "Corrosive",
      description: "Severe corrosive skin, eye, or material damage.",
      icon: <Waves className={`text-zinc-950 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-red-600 bg-white"
    },
    toxic: {
      title: "Acute Toxic",
      description: "Severe acute exposure hazard, poison risk.",
      icon: <Skull className={`text-zinc-950 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-red-600 bg-white"
    },
    irritant: {
      title: "Harmful / Irritant",
      description: "Respiratory tract irritant or acute skin irritation.",
      icon: <ShieldAlert className={`text-zinc-950 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-red-600 bg-white"
    },
    environment: {
      title: "Aquatic Hazard",
      description: "Very toxic to aquatic life with long-lasting damages.",
      icon: <Trash2 className={`text-zinc-950 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-red-600 bg-white"
    },
    flammable: {
      title: "Flammable",
      description: "Keep away from sparks, open flames, and heat sources.",
      icon: <Flame className={`text-zinc-950 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-red-600 bg-white"
    },
    safe: {
      title: "General Non-Hazardous",
      description: "Standard handling, no severe chemical warnings apply.",
      icon: <CheckCircle className={`text-emerald-600 ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`} />,
      color: "border-emerald-600 bg-zinc-50"
    }
  };

  const active = config[type] || config.safe;

  return (
    <div 
      className="group relative flex flex-col items-center"
      id={`ghs-${type}`}
    >
      <div 
        className={`
          flex items-center justify-center 
          border-3 
          rotate-45 
          transition-transform duration-200 group-hover:scale-105 
          box-border shadow-md
          ${active.color}
          ${isSm ? "w-[36px] h-[36px] rounded-sm" : "w-[56px] h-[56px] rounded-md"}
        `}
      >
        <div className="-rotate-45 flex items-center justify-center">
          {active.icon}
        </div>
      </div>
      
      {/* Tooltip for safety learning */}
      {!isSm && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg text-[11px] leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-20 font-sans">
          <div className="font-bold text-zinc-50 border-b border-zinc-800 pb-1 mb-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            GHS: {active.title}
          </div>
          <div>{active.description}</div>
        </div>
      )}
    </div>
  );
}
