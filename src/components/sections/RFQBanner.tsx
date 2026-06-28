<<<<<<< HEAD
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Globe, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui";
import Link from "next/link";

const METRICS = [
  { value: "50K+",  label: "sq ft Delivered"  },
  { value: "500+",  label: "Projects Completed"},
  { value: "40+",   label: "Verified Vendors"  },
  { value: "4.9★",  label: "Customer Rating"   },
];

const FEATURES = [
  { icon: Zap,           title: "24-Hour Quotes",   desc: "Fast RFQ responses within one business day" },
  { icon: ShieldCheck,   title: "Verified Quality", desc: "Every supplier audited — no compromises"    },
  { icon: Globe,         title: "PAN India Delivery",desc: "Quarry to site across all major cities"    },
  { icon: MessageSquare, title: "Dedicated Support", desc: "Expert team to guide every order"           },
];

export function RFQBanner() {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(145deg, #1c1712 0%, #2b231c 50%, #221c16 100%)" }}
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-3">
              Get Started Today
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
              India&apos;s Most Trusted<br />Stone Marketplace
            </h2>
            <p className="font-sans text-[14.5px] text-white/45 leading-relaxed mb-8 max-w-md">
              Connect directly with verified stone suppliers. Get quotes, compare prices, and order with confidence. No middlemen, no guesswork.
            </p>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {METRICS.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="font-serif text-2xl font-bold text-amber-gold">{m.value}</p>
                  <p className="font-sans text-[10px] text-white/40 uppercase tracking-wide mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-gold text-white font-sans font-bold text-sm hover:bg-[#A6754A] transition-colors"
              >
                Browse Catalog <ArrowRight size={15} />
              </Link>
              <Link
                href="/vendor/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white/70 font-sans font-semibold text-sm hover:border-white/40 hover:text-white transition-all"
              >
                Become a Vendor
              </Link>
            </div>
          </motion.div>

          {/* Right: feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-xl border border-white/8 bg-white/5 p-5 hover:bg-white/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-gold/15 border border-amber-gold/20 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-amber-gold" />
                </div>
                <h3 className="font-sans text-[13px] font-bold text-white mb-1">{title}</h3>
                <p className="font-sans text-[11.5px] text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
=======
// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { ArrowRight, Zap, ShieldCheck, Globe, MessageSquare } from "lucide-react";
// import { Container } from "@/components/ui";
// import Link from "next/link";

// const METRICS = [
//   { value: "50K+",  label: "sq ft Delivered"  },
//   { value: "500+",  label: "Projects Completed"},
//   { value: "40+",   label: "Verified Vendors"  },
//   { value: "4.9★",  label: "Customer Rating"   },
// ];

// const FEATURES = [
//   { icon: Zap,           title: "24-Hour Quotes",   desc: "Fast RFQ responses within one business day" },
//   { icon: ShieldCheck,   title: "Verified Quality", desc: "Every supplier audited — no compromises"    },
//   { icon: Globe,         title: "PAN India Delivery",desc: "Quarry to site across all major cities"    },
//   { icon: MessageSquare, title: "Dedicated Support", desc: "Expert team to guide every order"           },
// ];

// export function RFQBanner() {
//   return (
//     <section
//       className="py-20"
//       style={{ background: "linear-gradient(145deg, #1c1712 0%, #2b231c 50%, #221c16 100%)" }}
//     >
//       <Container>
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.55 }}
//           >
//             <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-3">
//               Get Started Today
//             </p>
//             <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
//               India&apos;s Most Trusted<br />Stone Marketplace
//             </h2>
//             <p className="font-sans text-[14.5px] text-white/45 leading-relaxed mb-8 max-w-md">
//               Connect directly with verified stone suppliers. Get quotes, compare prices, and order with confidence. No middlemen, no guesswork.
//             </p>

//             {/* Metrics grid */}
//             <div className="grid grid-cols-4 gap-4 mb-8">
//               {METRICS.map((m) => (
//                 <div key={m.label} className="text-center">
//                   <p className="font-serif text-2xl font-bold text-amber-gold">{m.value}</p>
//                   <p className="font-sans text-[10px] text-white/40 uppercase tracking-wide mt-1">{m.label}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-gold text-white font-sans font-bold text-sm hover:bg-[#A6754A] transition-colors"
//               >
//                 Browse Catalog <ArrowRight size={15} />
//               </Link>
//               <Link
//                 href="/vendor/register"
//                 className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white/70 font-sans font-semibold text-sm hover:border-white/40 hover:text-white transition-all"
//               >
//                 Become a Vendor
//               </Link>
//             </div>
//           </motion.div>

//           {/* Right: feature cards */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.55, delay: 0.1 }}
//             className="grid grid-cols-2 gap-4"
//           >
//             {FEATURES.map(({ icon: Icon, title, desc }, i) => (
//               <motion.div
//                 key={title}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1, duration: 0.4 }}
//                 className="rounded-xl border border-white/8 bg-white/5 p-5 hover:bg-white/8 transition-colors"
//               >
//                 <div className="w-9 h-9 rounded-lg bg-amber-gold/15 border border-amber-gold/20 flex items-center justify-center mb-3">
//                   <Icon size={16} className="text-amber-gold" />
//                 </div>
//                 <h3 className="font-sans text-[13px] font-bold text-white mb-1">{title}</h3>
//                 <p className="font-sans text-[11.5px] text-white/40 leading-relaxed">{desc}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </Container>
//     </section>
//   );
// }
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
