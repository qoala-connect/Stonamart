import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stonamart - Premium Stone Procurement",
  description:
    "Luxury stone procurement platform for marble, granite, and quartz materials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="text-stone-dark antialiased"
        style={{
          background: [
            "radial-gradient(ellipse at 18% 12%, rgba(201,169,97,0.07) 0%, transparent 52%)",
            "radial-gradient(ellipse at 82% 88%, rgba(139,115,85,0.06) 0%, transparent 48%)",
            "radial-gradient(ellipse at 55% 45%, rgba(160,148,136,0.04) 0%, transparent 40%)",
            "linear-gradient(158deg, #f9f7f4 0%, #f2ede6 30%, #f6f2ec 60%, #f9f6f2 100%)",
          ].join(", "),
        }}
        suppressHydrationWarning
      >
        {/* Global fixed Carrara marble base — underlies every section */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Primary diagonal Carrara veins */}
            <path d="M -100 200 C 280 158, 580 240, 860 182 S 1200 262, 1500 200" stroke="rgba(140,130,120,0.09)" strokeWidth="2.5" fill="none" />
            <path d="M -130 455 C 220 412, 520 490, 800 432 S 1160 512, 1500 450" stroke="rgba(130,120,110,0.07)" strokeWidth="1.8" fill="none" />
            {/* Branches */}
            <path d="M 580 240 C 598 290, 622 355, 658 422" stroke="rgba(140,130,120,0.06)" strokeWidth="1.0" fill="none" />
            <path d="M 800 432 C 820 490, 845 558, 882 628" stroke="rgba(130,120,110,0.05)" strokeWidth="0.85" fill="none" />
            {/* Secondary veins */}
            <path d="M 218 62 C 308 122, 398 88, 518 150 S 658 178, 748 238" stroke="rgba(150,140,130,0.055)" strokeWidth="1.0" fill="none" />
            <path d="M -65 622 C 155 600, 338 640, 528 615 S 758 652, 972 628" stroke="rgba(130,120,110,0.045)" strokeWidth="0.70" fill="none" />
            {/* Hair veins */}
            <path d="M 462 -22 C 478 118, 466 228, 482 362 S 504 480, 492 598" stroke="rgba(140,130,120,0.038)" strokeWidth="0.58" fill="none" />
            <path d="M 1082 42 C 1096 162, 1084 275, 1098 412 S 1115 530, 1104 645" stroke="rgba(130,120,110,0.035)" strokeWidth="0.50" fill="none" />
            <path d="M 185 700 C 342 680, 522 720, 712 695 S 952 728, 1142 702" stroke="rgba(140,130,120,0.032)" strokeWidth="0.48" fill="none" />
            {/* Gold accent veins */}
            <path d="M 82 342 C 362 315, 642 358, 922 326 S 1262 370, 1500 340" stroke="rgba(201,169,97,0.07)" strokeWidth="1.15" fill="none" />
            <path d="M -28 562 C 205 538, 432 575, 672 545 S 932 582, 1212 552" stroke="rgba(201,169,97,0.055)" strokeWidth="0.78" fill="none" />
            <path d="M 342 -18 C 356 92, 346 198, 360 315 S 378 430, 368 545" stroke="rgba(201,169,97,0.045)" strokeWidth="0.65" fill="none" />
            <path d="M 882 50 C 894 162, 884 268, 898 388 S 912 505, 902 625" stroke="rgba(201,169,97,0.038)" strokeWidth="0.52" fill="none" />
          </svg>
          {/* Global stone grain */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
              opacity: 0.018,
              mixBlendMode: "multiply",
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
