import React from "react";

interface NfpaDiamondProps {
  health: number;
  flammability: number;
  instability: number;
  special?: string;
  size?: number;
}

export default function NfpaDiamond({
  health,
  flammability,
  instability,
  special = "",
  size = 120,
}: NfpaDiamondProps) {
  // NFPA 704 standard hazard diamond drawn in an beautiful SVG box
  return (
    <div className="flex flex-col items-center p-3 bg-white border border-slate-200 rounded-2xl max-w-[200px] shadow-xs" id="nfpa-container">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2 font-heading">NFPA 704 Rating</div>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="drop-shadow-lg"
        aria-label={`NFPA 704 Hazard Diamond. Health: ${health}, Flammability: ${flammability}, Instability: ${instability}, Special: ${special || "None"}`}
      >
        {/* Diamond frame rotated 45 degrees or composed of 4 colored polygons */}
        
        {/* Flammability (Red) - Top */}
        <polygon
          points="50,5 72.5,27.5 50,50 27.5,27.5"
          fill="#ef4444"
          className="transition-colors duration-200 cursor-help"
        >
          <title>{`Flammability: ${flammability}`}</title>
        </polygon>
        {/* Health (Blue) - Left */}
        <polygon
          points="27.5,27.5 50,50 27.5,72.5 5,50"
          fill="#3b82f6"
          className="transition-colors duration-200 cursor-help"
        >
          <title>{`Health Hazard: ${health}`}</title>
        </polygon>
        {/* Instability (Yellow) - Right */}
        <polygon
          points="72.5,27.5 95,50 72.5,72.5 50,50"
          fill="#eab308"
          className="transition-colors duration-200 cursor-help"
        >
          <title>{`Instability: ${instability}`}</title>
        </polygon>
        {/* Special (White) - Bottom */}
        <polygon
          points="50,50 72.5,72.5 50,95 27.5,72.5"
          fill="#f4f4f5"
          className="transition-colors duration-200 cursor-help"
        >
          <title>{`Special Hazard: ${special || "None"}`}</title>
        </polygon>

        {/* Text values */}
        {/* Flammability Rating */}
        <text
          x="50"
          y="28"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {flammability}
        </text>

        {/* Health Rating */}
        <text
          x="28"
          y="51"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {health}
        </text>

        {/* Instability Rating */}
        <text
          x="72"
          y="51"
          textAnchor="middle"
          fill="#1e293b"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {instability}
        </text>

        {/* Special Code */}
        <text
          x="50"
          y="74"
          textAnchor="middle"
          fill="#18181b"
          fontSize="12"
          fontWeight="extrabold"
          fontFamily="monospace"
        >
          {special || "W"}
        </text>
      </svg>
      <div className="flex gap-2.5 mt-2.5 text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-blue-500" />
          H:{health}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-red-500" />
          F:{flammability}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-yellow-500" />
          I:{instability}
        </span>
      </div>
    </div>
  );
}
