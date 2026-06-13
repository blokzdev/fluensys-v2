import { ImageResponse } from "next/og";

import { VOLUTE_CASING_PATH, VOLUTE_CORE_PATH, VOLUTE_EYE } from "@/components/ui/Logo";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Strokes run heavier than the canonical mark so the icon stays legible at
// browser-tab size.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#04070d",
          borderRadius: 7,
        }}
      >
        <svg viewBox="0 0 64 64" width={32} height={32} fill="none">
          <path
            d={VOLUTE_CASING_PATH}
            stroke="#72BF44"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path d={VOLUTE_CORE_PATH} stroke="#2584C5" strokeWidth={6} strokeLinecap="round" />
          <circle cx={VOLUTE_EYE.cx} cy={VOLUTE_EYE.cy} r={3.5} fill="#2584C5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
