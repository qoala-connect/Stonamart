"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Camera, ArrowRight, X } from "lucide-react";

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// ── Gray Marble Kitchen Scene ─────────────────────────────────────────────────
function GrayKitchenRoom() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Pearl-gray marble wall background */}
      <div className="absolute inset-0" style={{
        background: [
          "radial-gradient(ellipse at 20% 30%, rgba(220,220,225,0.55) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 70%, rgba(200,202,210,0.40) 0%, transparent 48%)",
          "linear-gradient(168deg, #f4f4f6 0%, #eaeaed 30%, #efefef 58%, #f2f2f4 100%)",
        ].join(", "),
      }} />

      {/* Gray marble veining — wall */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice">
        {/* Bold diagonal veins */}
        <path d="M -20 140 C 210 100, 540 162, 840 118 S 1200 178, 1465 142"
          stroke="rgba(148,148,158,0.48)" strokeWidth="2.6" fill="none" />
        <path d="M 838 118 C 855 168, 865 240, 875 322"
          stroke="rgba(148,148,158,0.22)" strokeWidth="1.2" fill="none" />
        <path d="M -20 310 C 245 265, 590 342, 918 298 S 1295 355, 1465 312"
          stroke="rgba(155,155,165,0.32)" strokeWidth="1.8" fill="none" />
        {/* Silver accent vein */}
        <path d="M -20 220 C 285 192, 648 238, 1008 210 S 1315 242, 1465 222"
          stroke="rgba(180,180,192,0.38)" strokeWidth="1.4" fill="none" />
        {/* Fine veins */}
        <path d="M -20 488 C 260 445, 628 512, 968 472 S 1338 518, 1465 488"
          stroke="rgba(140,140,150,0.20)" strokeWidth="1.0" fill="none" />
        <path d="M 545 -10 C 558 118, 542 278, 555 435 S 545 582, 558 720"
          stroke="rgba(148,148,158,0.14)" strokeWidth="0.8" fill="none" />
        <path d="M 1048 -10 C 1062 145, 1045 315, 1058 488 S 1048 652, 1062 810"
          stroke="rgba(155,155,165,0.12)" strokeWidth="0.7" fill="none" />
        <path d="M 268 -10 C 280 98, 264 228, 278 382 S 268 545, 282 698"
          stroke="rgba(160,160,172,0.09)" strokeWidth="0.55" fill="none" />
        <path d="M -20 655 C 238 628, 588 668, 938 638 S 1302 668, 1465 652"
          stroke="rgba(145,145,155,0.15)" strokeWidth="0.85" fill="none" />
        {/* Hair-fine */}
        <path d="M -20 412 C 205 388, 525 422, 842 400 S 1205 428, 1465 412"
          stroke="rgba(148,148,158,0.10)" strokeWidth="0.55" fill="none" />
      </svg>

      {/* ── Kitchen cabinets — upper row ── */}
      {/* Left upper cabinets */}
      <div className="absolute" style={{ left: "3%", top: "4%", width: "30%", height: "38%", display: "flex", gap: "3px" }}>
        {[1,2,3].map(i => (
          <div key={i} className="flex-1" style={{
            background: "linear-gradient(180deg, #f8f8f9 0%, #f0f0f2 100%)",
            borderRadius: "2px 2px 0 0",
            border: "1px solid rgba(185,185,195,0.55)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 2px 3px 12px rgba(0,0,0,0.06)",
          }}>
            {/* Cabinet door handle */}
            <div style={{
              margin: "auto", marginTop: "62%", width: "32%", height: "5px",
              background: "linear-gradient(90deg, rgba(190,190,200,0.6) 0%, rgba(210,210,220,0.9) 50%, rgba(190,190,200,0.6) 100%)",
              borderRadius: "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
            }} />
          </div>
        ))}
      </div>

      {/* Right upper cabinets */}
      <div className="absolute" style={{ right: "3%", top: "4%", width: "30%", height: "38%", display: "flex", gap: "3px" }}>
        {[1,2,3].map(i => (
          <div key={i} className="flex-1" style={{
            background: "linear-gradient(180deg, #f8f8f9 0%, #f0f0f2 100%)",
            borderRadius: "2px 2px 0 0",
            border: "1px solid rgba(185,185,195,0.55)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), -2px 3px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              margin: "auto", marginTop: "62%", width: "32%", height: "5px",
              background: "linear-gradient(90deg, rgba(190,190,200,0.6) 0%, rgba(210,210,220,0.9) 50%, rgba(190,190,200,0.6) 100%)",
              borderRadius: "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
            }} />
          </div>
        ))}
      </div>

      {/* ── Range hood / extractor — centre top ── */}
      <div className="absolute" style={{
        left: "33%", right: "33%", top: "0%", height: "28%",
        background: "linear-gradient(180deg, #d8d8dc 0%, #c8c8ce 60%, #b8b8c0 100%)",
        clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      }} />
      {/* Hood grill */}
      <div className="absolute" style={{
        left: "36%", right: "36%", top: "22%", height: "4px",
        background: "rgba(168,168,178,0.7)", borderRadius: "2px",
      }} />
      {/* Hood LEDs */}
      <div className="absolute" style={{
        left: "37%", right: "37%", top: "26%", height: "3px",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,220,0.85) 30%, rgba(255,255,220,0.95) 50%, rgba(255,255,220,0.85) 70%, transparent 100%)",
        borderRadius: "2px", boxShadow: "0 0 12px rgba(255,255,180,0.4)",
      }} />

      {/* ── Gray marble backsplash — behind cooktop ── */}
      <div className="absolute" style={{
        left: "33%", right: "33%", top: "28%", height: "30%",
        background: "linear-gradient(168deg, #e8e8ec 0%, #e0e0e5 40%, #e5e5ea 100%)",
        borderLeft: "2px solid rgba(185,185,195,0.4)",
        borderRight: "2px solid rgba(185,185,195,0.4)",
      }}>
        {/* Backsplash marble veining */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 248" preserveAspectRatio="xMidYMid slice">
          <path d="M -5 55 C 58 40, 155 62, 258 48 S 360 68, 420 55"
            stroke="rgba(148,148,160,0.55)" strokeWidth="2.2" fill="none" />
          <path d="M -5 118 C 72 102, 175 128, 280 110 S 375 130, 420 118"
            stroke="rgba(148,148,160,0.35)" strokeWidth="1.6" fill="none" />
          <path d="M -5 182 C 62 165, 162 190, 268 172 S 365 192, 420 182"
            stroke="rgba(148,148,160,0.25)" strokeWidth="1.0" fill="none" />
          <path d="M 138 -5 C 145 42, 135 102, 142 165 S 136 215, 144 260"
            stroke="rgba(155,155,168,0.20)" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* ── Kitchen island / lower counter ── */}
      <div className="absolute" style={{
        left: "20%", right: "20%", bottom: "18%", height: "12%",
        background: "linear-gradient(178deg, #ececf0 0%, #e4e4e8 40%, #e8e8ec 100%)",
        borderRadius: "6px 6px 0 0",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.10), 0 -1px 6px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,0.85)",
        border: "1px solid rgba(185,185,195,0.45)", borderBottom: "none",
      }}>
        {/* Counter marble veining */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 98" preserveAspectRatio="xMidYMid slice">
          <path d="M -5 28 C 122 18, 298 35, 488 24 S 688 38, 810 28"
            stroke="rgba(148,148,160,0.52)" strokeWidth="2.0" fill="none" />
          <path d="M -5 58 C 105 48, 285 65, 472 55 S 672 68, 810 58"
            stroke="rgba(148,148,160,0.28)" strokeWidth="1.2" fill="none" />
          <path d="M -5 82 C 92 74, 272 88, 452 78 S 655 90, 810 82"
            stroke="rgba(148,148,160,0.18)" strokeWidth="0.8" fill="none" />
        </svg>
        {/* Sink cutout */}
        <div style={{
          position: "absolute", left: "38%", right: "38%", top: "15%", bottom: "0%",
          background: "linear-gradient(180deg, rgba(168,168,178,0.7) 0%, rgba(148,148,158,0.85) 100%)",
          borderRadius: "4px 4px 0 0", border: "1px solid rgba(158,158,168,0.6)", borderBottom: "none",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.12)",
        }} />
        {/* Faucet */}
        <div style={{
          position: "absolute", left: "49%", top: "-55%", width: "2%", height: "55%",
          background: "linear-gradient(to bottom, rgba(195,195,208,0.9) 0%, rgba(172,172,185,0.8) 100%)",
          borderRadius: "6px 6px 2px 2px", boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
        }} />
      </div>

      {/* ── Island base / cabinet below ── */}
      <div className="absolute" style={{
        left: "22%", right: "22%", bottom: "0", height: "18%",
        background: "linear-gradient(180deg, #e2e2e6 0%, #d8d8dc 100%)",
        boxShadow: "2px 0 18px rgba(0,0,0,0.08), -2px 0 18px rgba(0,0,0,0.06)",
      }}>
        {/* Base cabinet doors */}
        <div style={{ display: "flex", height: "100%", gap: "3px", padding: "0 3px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              flex: 1, background: "linear-gradient(180deg, #e5e5e9 0%, #dadade 100%)",
              border: "1px solid rgba(185,185,195,0.50)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
            }}>
              <div style={{
                margin: "auto", marginTop: "42%", width: "30%", height: "4px",
                background: "linear-gradient(90deg, rgba(188,188,200,0.5) 0%, rgba(208,208,222,0.85) 50%, rgba(188,188,200,0.5) 100%)",
                borderRadius: "2px",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Left lower cabinets ── */}
      <div className="absolute" style={{ left: "3%", bottom: "0", width: "18%", height: "34%", display: "flex", gap: "3px" }}>
        {[1,2].map(i => (
          <div key={i} className="flex-1" style={{
            background: "linear-gradient(180deg, #e5e5e9 0%, #dadade 100%)",
            border: "1px solid rgba(185,185,195,0.50)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
          }}>
            <div style={{
              margin: "auto", marginTop: "44%", width: "28%", height: "4px",
              background: "rgba(208,208,222,0.85)", borderRadius: "2px",
            }} />
          </div>
        ))}
      </div>

      {/* ── Right lower cabinets ── */}
      <div className="absolute" style={{ right: "3%", bottom: "0", width: "18%", height: "34%", display: "flex", gap: "3px" }}>
        {[1,2].map(i => (
          <div key={i} className="flex-1" style={{
            background: "linear-gradient(180deg, #e5e5e9 0%, #dadade 100%)",
            border: "1px solid rgba(185,185,195,0.50)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
          }}>
            <div style={{
              margin: "auto", marginTop: "44%", width: "28%", height: "4px",
              background: "rgba(208,208,222,0.85)", borderRadius: "2px",
            }} />
          </div>
        ))}
      </div>

      {/* ── Gray marble floor ── */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: "18%",
        background: "linear-gradient(to top, #d8d8dc 0%, #e0e0e4 60%, transparent 100%)",
      }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 148" preserveAspectRatio="xMidYMid slice">
          {/* Floor tile lines */}
          <line x1="0" y1="48" x2="1440" y2="48" stroke="rgba(185,185,195,0.40)" strokeWidth="1" />
          <line x1="0" y1="98" x2="1440" y2="98" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          <line x1="240" y1="0" x2="240" y2="148" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          <line x1="480" y1="0" x2="480" y2="148" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          <line x1="720" y1="0" x2="720" y2="148" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          <line x1="960" y1="0" x2="960" y2="148" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          <line x1="1200" y1="0" x2="1200" y2="148" stroke="rgba(185,185,195,0.30)" strokeWidth="0.8" />
          {/* Floor veining */}
          <path d="M -10 22 C 185 15, 452 28, 720 20 S 1005 30, 1455 22"
            stroke="rgba(148,148,160,0.38)" strokeWidth="1.5" fill="none" />
          <path d="M -10 72 C 205 62, 488 78, 775 68 S 1082 80, 1455 72"
            stroke="rgba(148,148,160,0.22)" strokeWidth="1.0" fill="none" />
        </svg>
      </div>

      {/* Floor/wall junction */}
      <div className="absolute inset-x-0" style={{
        top: "82%", height: "1.5px",
        background: "linear-gradient(to right, transparent 0%, rgba(168,168,180,0.35) 8%, rgba(168,168,180,0.60) 50%, rgba(168,168,180,0.35) 92%, transparent 100%)",
      }} />

      {/* ── Natural light from window (centre top) ── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 2%, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.30) 18%, transparent 42%)",
      }} />
      {/* Side ambient glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 8% 28%, rgba(255,255,255,0.50) 0%, rgba(240,240,248,0.18) 28%, transparent 50%)",
      }} />

      {/* ── Polished marble surface highlight ── */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 38%)",
      }} />

      {/* Grain texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: GRAIN, backgroundSize: "200px", opacity: 0.035, mixBlendMode: "multiply" as const,
      }} />
    </div>
  );
}

// ── Gray Marble Living Room / Home Interior Scene ─────────────────────────────
function GrayHomeRoom() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft gray marble wall */}
      <div className="absolute inset-0" style={{
        background: [
          "radial-gradient(ellipse at 18% 22%, rgba(210,212,220,0.48) 0%, transparent 52%)",
          "radial-gradient(ellipse at 82% 75%, rgba(198,200,210,0.38) 0%, transparent 46%)",
          "linear-gradient(165deg, #f1f1f4 0%, #e8e8ed 28%, #eeeef2 58%, #f3f3f6 100%)",
        ].join(", "),
      }} />

      {/* Marble wall veining */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice">
        {/* Bold primary veins */}
        <path d="M -20 165 C 228 115, 572 188, 892 142 S 1252 205, 1465 165"
          stroke="rgba(145,145,158,0.52)" strokeWidth="2.8" fill="none" />
        <path d="M 890 142 C 908 195, 920 265, 930 355"
          stroke="rgba(145,145,158,0.24)" strokeWidth="1.3" fill="none" />
        <path d="M -20 355 C 255 305, 618 378, 958 330 S 1318 392, 1465 355"
          stroke="rgba(152,152,165,0.36)" strokeWidth="2.0" fill="none" />
        {/* Silver shimmer vein */}
        <path d="M -20 245 C 295 215, 668 252, 1022 225 S 1322 258, 1465 245"
          stroke="rgba(175,175,190,0.42)" strokeWidth="1.5" fill="none" />
        {/* Secondary veins */}
        <path d="M -20 528 C 272 482, 645 548, 1002 508 S 1352 558, 1465 528"
          stroke="rgba(142,142,155,0.22)" strokeWidth="1.1" fill="none" />
        <path d="M 568 -10 C 582 138, 565 305, 578 468 S 568 618, 582 762"
          stroke="rgba(148,148,162,0.15)" strokeWidth="0.85" fill="none" />
        <path d="M 1058 -10 C 1072 162, 1055 342, 1068 522 S 1058 688, 1072 820"
          stroke="rgba(155,155,168,0.13)" strokeWidth="0.7" fill="none" />
        <path d="M 282 -10 C 295 112, 278 258, 292 418 S 282 578, 295 722"
          stroke="rgba(160,160,175,0.10)" strokeWidth="0.55" fill="none" />
        <path d="M -20 698 C 248 668, 608 712, 968 682 S 1328 718, 1465 698"
          stroke="rgba(148,148,162,0.17)" strokeWidth="0.9" fill="none" />
        {/* Hair-fine */}
        <path d="M -20 448 C 215 422, 548 458, 878 432 S 1228 465, 1465 448"
          stroke="rgba(145,145,158,0.11)" strokeWidth="0.55" fill="none" />
      </svg>

      {/* ── Large floor-to-ceiling window — left ── */}
      <div className="absolute" style={{
        left: "4%", top: "3%",
        width: "22%", height: "72%",
        background: "linear-gradient(178deg, rgba(248,252,255,0.92) 0%, rgba(238,244,252,0.86) 100%)",
        borderLeft: "6px solid rgba(185,185,198,0.55)",
        borderRight: "6px solid rgba(185,185,198,0.55)",
        borderTop: "6px solid rgba(185,185,198,0.55)",
        boxShadow: "inset 0 0 48px rgba(235,242,255,0.38), 15px 0 55px rgba(215,228,248,0.32), -2px 0 12px rgba(180,180,198,0.22)",
      }}>
        {/* Horizontal frame */}
        <div className="absolute inset-x-0" style={{ top: "50%", height: "6px", background: "rgba(185,185,198,0.55)" }} />
        {/* Vertical divider */}
        <div className="absolute inset-y-0" style={{ left: "50%", width: "6px", background: "rgba(185,185,198,0.55)" }} />
        {/* Window inner reflection */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)" }} />
      </div>

      {/* Second window — partial right */}
      <div className="absolute" style={{
        right: "4%", top: "3%",
        width: "16%", height: "62%",
        background: "linear-gradient(178deg, rgba(248,252,255,0.88) 0%, rgba(238,244,252,0.82) 100%)",
        borderLeft: "6px solid rgba(185,185,198,0.50)",
        borderRight: "6px solid rgba(185,185,198,0.50)",
        borderTop: "6px solid rgba(185,185,198,0.50)",
        boxShadow: "inset 0 0 42px rgba(235,242,255,0.32), -12px 0 45px rgba(215,228,248,0.25)",
      }}>
        <div className="absolute inset-x-0" style={{ top: "48%", height: "6px", background: "rgba(185,185,198,0.50)" }} />
        <div className="absolute inset-y-0" style={{ left: "50%", width: "6px", background: "rgba(185,185,198,0.50)" }} />
      </div>

      {/* ── Soft light beams from windows ── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 10% 32%, rgba(245,248,255,0.65) 0%, rgba(230,238,252,0.22) 28%, transparent 52%)",
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 92% 26%, rgba(245,248,255,0.55) 0%, rgba(230,238,252,0.16) 22%, transparent 44%)",
      }} />

      {/* ── Sofa silhouette ── */}
      {/* Sofa body */}
      <div className="absolute" style={{
        bottom: "18%", left: "28%", right: "28%", height: "16%",
        background: "linear-gradient(175deg, #dcdce2 0%, #d2d2d8 40%, #d8d8de 100%)",
        borderRadius: "12px 12px 0 0",
        boxShadow: "0 -4px 28px rgba(0,0,0,0.09), 0 -1px 5px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,0.70)",
        border: "1px solid rgba(188,188,200,0.45)", borderBottom: "none",
      }}>
        {/* Sofa seat cushion line */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1.5px", background: "rgba(175,175,188,0.40)" }} />
        {/* Cushion indent left */}
        <div style={{
          position: "absolute", left: "12%", right: "55%", top: "25%", bottom: "0",
          background: "linear-gradient(180deg, rgba(175,175,188,0.22) 0%, transparent 100%)",
          borderRadius: "8px 8px 0 0",
        }} />
        {/* Cushion indent right */}
        <div style={{
          position: "absolute", left: "55%", right: "12%", top: "25%", bottom: "0",
          background: "linear-gradient(180deg, rgba(175,175,188,0.22) 0%, transparent 100%)",
          borderRadius: "8px 8px 0 0",
        }} />
      </div>
      {/* Sofa back */}
      <div className="absolute" style={{
        bottom: "34%", left: "26%", right: "26%", height: "8%",
        background: "linear-gradient(175deg, #e0e0e6 0%, #d6d6dc 100%)",
        borderRadius: "14px 14px 0 0",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.07), inset 0 2px 0 rgba(255,255,255,0.65)",
        border: "1px solid rgba(188,188,200,0.40)", borderBottom: "none",
      }} />
      {/* Left armrest */}
      <div className="absolute" style={{
        bottom: "18%", left: "24%", width: "5%", height: "20%",
        background: "linear-gradient(90deg, #d5d5db 0%, #dcdce2 100%)",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.07), inset 0 2px 0 rgba(255,255,255,0.65)",
      }} />
      {/* Right armrest */}
      <div className="absolute" style={{
        bottom: "18%", right: "24%", width: "5%", height: "20%",
        background: "linear-gradient(90deg, #dcdce2 0%, #d5d5db 100%)",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.07), inset 0 2px 0 rgba(255,255,255,0.65)",
      }} />

      {/* ── Coffee table ── */}
      <div className="absolute" style={{
        bottom: "12%", left: "36%", right: "36%", height: "6%",
        background: "linear-gradient(178deg, #eaeaee 0%, #e2e2e8 40%, #e8e8ec 100%)",
        borderRadius: "6px",
        boxShadow: "0 4px 22px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.80)",
        border: "1px solid rgba(190,190,204,0.45)",
      }}>
        {/* Table marble veins */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 540 48" preserveAspectRatio="xMidYMid slice">
          <path d="M -5 16 C 85 10, 212 20, 342 14 S 458 22, 548 16" stroke="rgba(145,145,158,0.5)" strokeWidth="1.5" fill="none" />
          <path d="M -5 32 C 72 26, 195 36, 318 28 S 432 38, 548 32" stroke="rgba(145,145,158,0.3)" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* ── Gray marble floor ── */}
      <div className="absolute inset-x-0 bottom-0" style={{
        height: "18%",
        background: "linear-gradient(to top, #d5d5da 0%, #dcdce2 55%, transparent 100%)",
      }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 148" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="50" x2="1440" y2="50" stroke="rgba(180,180,192,0.38)" strokeWidth="1" />
          <line x1="0" y1="100" x2="1440" y2="100" stroke="rgba(180,180,192,0.28)" strokeWidth="0.8" />
          <line x1="288" y1="0" x2="288" y2="148" stroke="rgba(180,180,192,0.28)" strokeWidth="0.8" />
          <line x1="576" y1="0" x2="576" y2="148" stroke="rgba(180,180,192,0.28)" strokeWidth="0.8" />
          <line x1="864" y1="0" x2="864" y2="148" stroke="rgba(180,180,192,0.28)" strokeWidth="0.8" />
          <line x1="1152" y1="0" x2="1152" y2="148" stroke="rgba(180,180,192,0.28)" strokeWidth="0.8" />
          <path d="M -10 28 C 200 18, 488 35, 780 22 S 1095 38, 1455 28"
            stroke="rgba(145,145,160,0.42)" strokeWidth="1.5" fill="none" />
          <path d="M -10 75 C 228 62, 538 80, 848 68 S 1168 82, 1455 75"
            stroke="rgba(145,145,160,0.25)" strokeWidth="1.0" fill="none" />
        </svg>
      </div>

      {/* Wall/floor junction */}
      <div className="absolute inset-x-0" style={{
        top: "82%", height: "1.5px",
        background: "linear-gradient(to right, transparent 0%, rgba(162,162,178,0.32) 8%, rgba(162,162,178,0.58) 50%, rgba(162,162,178,0.32) 92%, transparent 100%)",
      }} />

      {/* Room corner lines */}
      <div className="absolute inset-y-0" style={{
        left: "4%", width: "1px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(160,160,175,0.28) 20%, rgba(160,160,175,0.42) 62%, rgba(160,160,175,0.14) 92%, transparent 100%)",
      }} />
      <div className="absolute inset-y-0" style={{
        right: "4%", width: "1px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(160,160,175,0.22) 20%, rgba(160,160,175,0.35) 62%, rgba(160,160,175,0.10) 92%, transparent 100%)",
      }} />

      {/* Polished surface highlight */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(148deg, rgba(255,255,255,0.24) 0%, transparent 40%)",
      }} />

      {/* Grain texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: GRAIN, backgroundSize: "200px", opacity: 0.035, mixBlendMode: "multiply" as const,
      }} />
    </div>
  );
}

// ── Slides config ─────────────────────────────────────────────────────────────

interface Slide {
  id: number;
  eyebrow: string;
  title: [string, string];
  subtitle: string;
  cta: string;
  ctaHref: string;
  secondaryCta: string;
  secondaryHref: string;
  Room: React.FC;
  dark: boolean;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: "Premium Kitchen Marble",
    title: ["Elevate Your", "Kitchen & Home"],
    subtitle: "Pearl-gray marble countertops, backsplash, and flooring — timeless beauty crafted for modern Indian kitchens.",
    cta: "Explore Collection",
    ctaHref: "#categories",
    secondaryCta: "Get a Quote",
    secondaryHref: "/vendor/register",
    Room: GrayKitchenRoom,
    dark: false,
  },
  {
    id: 2,
    eyebrow: "Luxury Home Interiors",
    title: ["Gray Marble", "For Every Space"],
    subtitle: "From living rooms to hallways — our curated gray marble selection transforms any interior into a statement of refined elegance.",
    cta: "Browse Collection",
    ctaHref: "#categories",
    secondaryCta: "Enquire Now",
    secondaryHref: "/vendor/register",
    Room: GrayHomeRoom,
    dark: false,
  },
];

// ── Search bar ────────────────────────────────────────────────────────────────

function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    },
    [imagePreview]
  );

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-xl"
    >
      <div
        className="flex items-center rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(185,185,200,0.50)",
          borderLeft: "3px solid #c9a961",
          boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        <Search size={16} className="ml-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search marble, granite, finish, city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-3.5 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-sans text-sm"
          autoComplete="off"
        />
        {imagePreview && (
          <div className="relative flex-shrink-0 mr-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="" className="w-7 h-7 rounded-lg object-cover border border-gray-200" />
            <button onClick={clearImage} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gray-700 rounded-full flex items-center justify-center">
              <X size={7} className="text-white" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-1 pr-2 flex-shrink-0">
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
          <motion.button onClick={() => fileRef.current?.click()} className="p-2 rounded-xl hover:bg-amber-gold/10 transition-colors" whileTap={{ scale: 0.95 }} title="AI Image Search">
            <Camera size={15} className="text-amber-gold" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-gray-800 text-white font-sans text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors mr-1"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Slideshow ────────────────────────────────────────────────────────────

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "calc(100vh - 80px)", minHeight: 580, maxHeight: 980 }}
    >
      {/* Background room scene */}
      <AnimatePresence>
        <motion.div
          key={`room-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <slide.Room />
        </motion.div>
      </AnimatePresence>

      {/* Centre vignette scrim for text readability */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 38%, transparent 65%)",
      }} />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 100%)" }} />

      {/* Centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${current}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <span className="h-px w-8 bg-amber-gold flex-shrink-0" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-amber-gold">
                {slide.eyebrow}
              </span>
              <span className="h-px w-8 bg-amber-gold flex-shrink-0" />
            </motion.div>

            {/* Main title */}
            <h1
              className="font-serif font-bold leading-[1.06] mb-2 text-gray-900"
              style={{
                fontSize: "clamp(3rem, 6.5vw, 5.4rem)",
                textShadow: "0 2px 24px rgba(255,255,255,0.55), 0 1px 8px rgba(255,255,255,0.40)",
              }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {slide.title[0]}
              </motion.span>
              <motion.span
                className="block text-amber-gold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {slide.title[1]}
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="font-sans text-sm md:text-base leading-relaxed mb-8 max-w-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.55 }}
              style={{ textShadow: "0 1px 6px rgba(255,255,255,0.80)" }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.55 }}
            >
              <motion.a
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-gold text-white font-sans font-bold text-sm rounded-full shadow-[0_4px_28px_rgba(201,169,97,0.40)] hover:bg-amber-gold/90 transition-all"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {slide.cta}
                <ArrowRight size={15} />
              </motion.a>
              <motion.a
                href={slide.secondaryHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-sans text-sm font-semibold border border-gray-400/40 text-gray-700 hover:border-gray-500/60 hover:text-gray-900 hover:bg-white/40 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {slide.secondaryCta}
              </motion.a>
            </motion.div>

            {/* Search bar */}
            <GlobalSearchBar />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide nav — right side vertical */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex flex-col items-end gap-1.5 group"
          >
            <span className="font-sans transition-all duration-300" style={{
              fontSize: 10, letterSpacing: "0.12em",
              color: i === current ? "rgba(201,169,97,0.90)" : "rgba(80,80,100,0.45)",
            }}>
              0{i + 1}
            </span>
            <div
              className="relative overflow-hidden rounded-full transition-all duration-400"
              style={{
                width: 3,
                height: i === current ? 40 : 22,
                background: i === current ? "rgba(201,169,97,0.30)" : "rgba(130,130,150,0.28)",
              }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-x-0 top-0 bg-amber-gold rounded-full"
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 7.0, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#categories"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer z-20"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-gray-500 group-hover:text-amber-gold transition-colors">
          Scroll
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowRight size={11} className="text-amber-gold rotate-90" />
        </motion.div>
      </motion.a>

      {/* Gold bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(201,169,97,0.5) 25%, rgba(201,169,97,0.8) 50%, rgba(201,169,97,0.5) 75%, transparent 100%)",
      }} />
    </section>
  );
}
