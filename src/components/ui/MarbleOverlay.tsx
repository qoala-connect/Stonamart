const GRAIN_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export type MarbleVariant = "white" | "cream" | "black" | "grey" | "light" | "dark";

interface MarbleOverlayProps {
  variant?: MarbleVariant;
  intensity?: number;
}

/**
 * Absolutely-positioned marble veining + grain overlay.
 * Place inside any `relative overflow-hidden` parent.
 *
 * white / light → Carrara (grey diagonal veins on cream-white)
 * cream         → Travertine (warm tan horizontal bands on sandy beige)
 * black / dark  → Nero Marquina (bold gold + white veins on jet black)
 * grey          → Silver Grey (white crystalline veins on silver)
 */
export function MarbleOverlay({ variant = "white", intensity = 1 }: MarbleOverlayProps) {
  const v = variant === "light" ? "white" : variant === "dark" ? "black" : variant;

  /* ── BLACK — Nero Marquina with dramatic gold veining ── */
  if (v === "black") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: intensity }}
        >
          {/* Bold gold primary veins */}
          <path d="M -80 220 C 160 162, 380 248, 640 180 S 960 258, 1240 188 C 1340 162, 1420 206, 1500 180" stroke="rgba(201,169,97,0.82)" strokeWidth="2.8" fill="none" />
          <path d="M -100 480 C 140 418, 360 505, 620 440 S 940 518, 1220 448 C 1320 422, 1400 465, 1500 440" stroke="rgba(201,169,97,0.60)" strokeWidth="2.0" fill="none" />
          {/* Gold secondary diagonal */}
          <path d="M 240 -12 C 258 148, 248 272, 265 428 S 285 562, 273 688" stroke="rgba(201,169,97,0.42)" strokeWidth="1.4" fill="none" />
          <path d="M 1080 50 C 1095 188, 1083 312, 1098 462 S 1115 598, 1103 722" stroke="rgba(201,169,97,0.30)" strokeWidth="1.0" fill="none" />
          {/* Gold fine hair veins */}
          <path d="M -40 680 C 180 652, 400 698, 660 668 S 960 705, 1220 675" stroke="rgba(201,169,97,0.22)" strokeWidth="0.8" fill="none" />
          <path d="M 780 50 C 795 188, 785 312, 800 462 S 818 595, 806 722" stroke="rgba(201,169,97,0.28)" strokeWidth="0.9" fill="none" />
          <path d="M -60 340 C 200 308, 460 355, 740 322 S 1060 365, 1340 332" stroke="rgba(201,169,97,0.18)" strokeWidth="0.65" fill="none" />
          {/* White accent veins */}
          <path d="M -60 140 C 300 100, 660 170, 1020 118 S 1320 160, 1500 128" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" fill="none" />
          <path d="M 80 360 C 340 328, 600 370, 880 338 S 1200 375, 1500 345" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />
          <path d="M 560 -15 C 575 130, 565 248, 580 390 S 600 510, 588 630" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRAIN_DATA_URL,
            backgroundSize: "180px 180px",
            opacity: 0.05 * intensity,
            mixBlendMode: "overlay",
          }}
        />
      </div>
    );
  }

  /* ── CREAM — Travertine with warm horizontal banding ── */
  if (v === "cream") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: intensity }}
        >
          {/* Horizontal travertine layers — warm amber-tan */}
          <path d="M -80 120 C 240 98, 520 145, 820 112 S 1180 155, 1500 120" stroke="rgba(155,125,85,0.28)" strokeWidth="2.2" fill="none" />
          <path d="M -60 265 C 260 242, 540 288, 840 255 S 1200 298, 1500 262" stroke="rgba(170,140,100,0.20)" strokeWidth="1.6" fill="none" />
          <path d="M -90 430 C 220 408, 500 452, 800 418 S 1160 460, 1500 428" stroke="rgba(155,125,85,0.16)" strokeWidth="1.2" fill="none" />
          <path d="M -70 590 C 240 568, 520 608, 820 575 S 1180 618, 1500 585" stroke="rgba(145,115,78,0.13)" strokeWidth="0.9" fill="none" />
          <path d="M -80 750 C 220 728, 500 768, 800 738 S 1160 775, 1500 748" stroke="rgba(165,135,95,0.10)" strokeWidth="0.7" fill="none" />
          {/* Cross/vertical veins for depth */}
          <path d="M 380 -20 C 395 180, 382 345, 398 530 S 415 688, 402 855" stroke="rgba(140,110,72,0.14)" strokeWidth="1.0" fill="none" />
          <path d="M 860 -10 C 873 178, 862 340, 876 522 S 892 682, 880 852" stroke="rgba(155,125,85,0.10)" strokeWidth="0.75" fill="none" />
          <path d="M 1240 40 C 1252 220, 1242 380, 1256 558 S 1270 720, 1260 880" stroke="rgba(140,110,72,0.08)" strokeWidth="0.6" fill="none" />
          {/* Fine undulation in between layers */}
          <path d="M -50 195 C 280 175, 560 218, 860 185 S 1220 228, 1500 195" stroke="rgba(160,130,90,0.10)" strokeWidth="0.65" fill="none" />
          <path d="M -40 350 C 250 330, 530 372, 830 340 S 1190 382, 1500 352" stroke="rgba(155,125,85,0.08)" strokeWidth="0.5" fill="none" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRAIN_DATA_URL,
            backgroundSize: "160px 160px",
            opacity: 0.040 * intensity,
            mixBlendMode: "multiply",
          }}
        />
      </div>
    );
  }

  /* ── GREY — Silver Grey with white crystalline veins ── */
  if (v === "grey") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: intensity }}
        >
          {/* White primary veins — crystalline and flowing */}
          <path d="M -80 230 C 200 188, 480 262, 780 212 S 1120 285, 1500 232" stroke="rgba(255,255,255,0.58)" strokeWidth="2.2" fill="none" />
          <path d="M -60 500 C 220 460, 500 535, 800 485 S 1140 555, 1500 500" stroke="rgba(255,255,255,0.42)" strokeWidth="1.6" fill="none" />
          {/* White secondary branching */}
          <path d="M 178 65 C 268 132, 358 98, 478 162 S 618 188, 720 255" stroke="rgba(255,255,255,0.30)" strokeWidth="1.1" fill="none" />
          <path d="M 980 345 C 1065 318, 1150 362, 1262 330 S 1382 368, 1500 342" stroke="rgba(255,255,255,0.28)" strokeWidth="1.0" fill="none" />
          <path d="M -50 690 C 180 665, 420 708, 680 675 S 980 715, 1240 682" stroke="rgba(255,255,255,0.22)" strokeWidth="0.85" fill="none" />
          {/* White fine hair veins */}
          <path d="M 440 -18 C 458 118, 446 228, 462 368 S 482 490, 470 612" stroke="rgba(255,255,255,0.20)" strokeWidth="0.65" fill="none" />
          <path d="M 1040 48 C 1055 178, 1044 292, 1058 432 S 1075 558, 1062 682" stroke="rgba(255,255,255,0.18)" strokeWidth="0.55" fill="none" />
          {/* Light grey secondary veins for depth */}
          <path d="M -50 368 C 200 342, 460 388, 740 355 S 1060 398, 1360 365" stroke="rgba(240,235,230,0.35)" strokeWidth="1.0" fill="none" />
          <path d="M 320 -15 C 335 108, 325 218, 340 355 S 358 475, 346 595" stroke="rgba(240,235,230,0.28)" strokeWidth="0.7" fill="none" />
          <path d="M 840 35 C 852 162, 842 278, 856 418 S 872 545, 860 668" stroke="rgba(235,230,225,0.22)" strokeWidth="0.55" fill="none" />
          {/* Subtle gold shimmer accent */}
          <path d="M 80 375 C 340 350, 600 392, 880 360 S 1200 398, 1500 368" stroke="rgba(201,169,97,0.12)" strokeWidth="0.8" fill="none" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRAIN_DATA_URL,
            backgroundSize: "175px 175px",
            opacity: 0.026 * intensity,
            mixBlendMode: "multiply",
          }}
        />
      </div>
    );
  }

  /* ── WHITE — Carrara / Calacatta with flowing grey veins ── */
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: intensity }}
      >
        {/* Primary diagonal veins — characteristic Carrara */}
        <path d="M -100 200 C 280 158, 580 242, 860 182 S 1200 265, 1500 200" stroke="rgba(140,130,120,0.32)" strokeWidth="2.5" fill="none" />
        <path d="M -130 455 C 220 412, 520 492, 800 435 S 1160 515, 1500 452" stroke="rgba(130,120,110,0.22)" strokeWidth="1.8" fill="none" />
        {/* Branches from primary veins */}
        <path d="M 580 242 C 598 292, 622 358, 658 425" stroke="rgba(140,130,120,0.18)" strokeWidth="1.0" fill="none" />
        <path d="M 800 435 C 820 492, 845 562, 882 632" stroke="rgba(130,120,110,0.15)" strokeWidth="0.85" fill="none" />
        <path d="M 280 158 C 295 215, 318 270, 345 335" stroke="rgba(145,135,125,0.14)" strokeWidth="0.75" fill="none" />
        {/* Secondary diagonal veins */}
        <path d="M 218 62 C 308 122, 398 88, 518 152 S 658 178, 748 238" stroke="rgba(150,140,130,0.16)" strokeWidth="1.05" fill="none" />
        <path d="M 1082 645 C 1162 618, 1252 660, 1362 632 S 1442 668, 1522 645" stroke="rgba(140,130,120,0.14)" strokeWidth="0.85" fill="none" />
        <path d="M -65 625 C 155 602, 338 642, 528 618 S 758 655, 972 630" stroke="rgba(130,120,110,0.11)" strokeWidth="0.72" fill="none" />
        {/* Fine hair veins */}
        <path d="M 462 -22 C 478 118, 466 228, 482 362 S 504 482, 492 602" stroke="rgba(140,130,120,0.10)" strokeWidth="0.6" fill="none" />
        <path d="M 1082 42 C 1096 162, 1084 275, 1098 412 S 1115 532, 1104 648" stroke="rgba(130,120,110,0.09)" strokeWidth="0.52" fill="none" />
        <path d="M 185 702 C 342 682, 522 722, 712 698 S 952 730, 1142 705" stroke="rgba(140,130,120,0.08)" strokeWidth="0.5" fill="none" />
        {/* Gold accent veins */}
        <path d="M 82 342 C 362 315, 642 360, 922 328 S 1262 372, 1500 342" stroke="rgba(201,169,97,0.09)" strokeWidth="1.18" fill="none" />
        <path d="M -28 562 C 205 538, 432 578, 672 548 S 932 585, 1212 555" stroke="rgba(201,169,97,0.07)" strokeWidth="0.80" fill="none" />
        <path d="M 342 -18 C 356 92, 346 198, 360 315 S 378 432, 368 548" stroke="rgba(201,169,97,0.06)" strokeWidth="0.68" fill="none" />
        <path d="M 882 50 C 894 162, 884 268, 898 388 S 912 508, 902 628" stroke="rgba(201,169,97,0.05)" strokeWidth="0.52" fill="none" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_DATA_URL,
          backgroundSize: "180px 180px",
          opacity: 0.032 * intensity,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
