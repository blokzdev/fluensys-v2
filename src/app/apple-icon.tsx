import { ImageResponse } from "next/og";

import {
  VOLUTE_CASING_PATH,
  VOLUTE_CASING_STROKE,
  VOLUTE_CORE_PATH,
  VOLUTE_CORE_STROKE,
  VOLUTE_EYE,
} from "@/components/ui/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Solid tile, no transparency or corner radius — iOS applies its own mask.
export default function AppleIcon() {
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
        }}
      >
        <svg viewBox="0 0 64 64" width={124} height={124} fill="none">
          <path
            d={VOLUTE_CASING_PATH}
            stroke="#72BF44"
            strokeWidth={VOLUTE_CASING_STROKE}
            strokeLinecap="round"
          />
          <path
            d={VOLUTE_CORE_PATH}
            stroke="#2584C5"
            strokeWidth={VOLUTE_CORE_STROKE}
            strokeLinecap="round"
          />
          <circle cx={VOLUTE_EYE.cx} cy={VOLUTE_EYE.cy} r={VOLUTE_EYE.r} fill="#2584C5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
