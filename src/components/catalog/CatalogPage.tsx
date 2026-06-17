"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Camera, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui";
import { FilterSidebar } from "./FilterSidebar";
import { SortingHeader } from "./SortingHeader";
import { CatalogProductCard } from "./CatalogProductCard";
import { CatalogProductListItem } from "./CatalogProductListItem";
import { AIImageSearchModal } from "./AIImageSearchModal";
import { CATALOG_PRODUCTS } from "./data";
import { EMPTY_FILTERS } from "./types";
import type { CatalogProduct, FilterState, ViewMode, SortOption } from "./types";

function toggleFilter(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function countActiveFilters(filters: FilterState): number {
  return Object.values(filters).reduce((n, arr) => n + arr.length, 0);
}

// ─── Visually Similar Banner ───────────────────────────────────────────────────
function VisuallySimilarBanner({
  imagePreview,
  count,
  onClear,
}: {
  imagePreview: string | null;
  count: number;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 mb-6 p-4 bg-stone-950 text-stone-light rounded-2xl border border-amber-gold/20"
    >
      {imagePreview && (
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-gold/30 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="AI search" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-amber-gold" />
          <p className="font-sans text-sm font-semibold text-stone-light">
            Showing {count} Visually Similar Stones
          </p>
        </div>
        <p className="text-[10px] font-sans text-stone-light/45 mt-0.5">
          Matched on color palette, texture, and veining pattern
        </p>
      </div>
      <motion.button
        onClick={onClear}
        className="flex items-center gap-1 text-xs font-sans font-medium text-stone-light/50 hover:text-stone-light transition-colors flex-shrink-0"
        whileTap={{ scale: 0.95 }}
      >
        <X size={12} />
        Clear
      </motion.button>
    </motion.div>
  );
}

// ─── Alternative Materials Section ────────────────────────────────────────────
function AlternativeMaterialsSection({
  products,
  viewMode,
}: {
  products: CatalogProduct[];
  viewMode: ViewMode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mt-10 pt-8 border-t border-stone-dark/8"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.15em] mb-1">
            You May Also Like
          </p>
          <h3 className="font-serif text-xl font-semibold text-stone-950">
            Alternative Materials
          </h3>
        </div>
        <motion.button
          className="flex items-center gap-1 text-xs font-sans font-medium text-stone-dark/55 hover:text-amber-gold transition-colors"
          whileHover={{ x: 2 }}
        >
          View all <ArrowRight size={12} />
        </motion.button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <CatalogProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <CatalogProductListItem key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ─── Main Catalog Page ─────────────────────────────────────────────────────────
export function CatalogPage({ dbProducts = [] }: { dbProducts?: CatalogProduct[] }) {
  const ALL_PRODUCTS = useMemo(
    () => [...dbProducts, ...CATALOG_PRODUCTS],
    [dbProducts]
  );
  const searchParams = useSearchParams();

  // ── State ──
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [userCity, setUserCity] = useState("mumbai");

  // AI Search state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiImagePreview, setAiImagePreview] = useState<string | null>(null);
  const [visuallySimilarIds, setVisuallySimilarIds] = useState<string[]>([]);

  // Read city from cookie
  useEffect(() => {
    const fromCookie = document.cookie
      .split("; ")
      .find((r) => r.startsWith("selectedCity="))
      ?.split("=")[1];
    if (fromCookie) setUserCity(fromCookie);
  }, []);

  // Activate AI search if navigated here with ?aiIds= (from header modal)
  useEffect(() => {
    const aiIds = searchParams.get("aiIds");
    if (aiIds) {
      const ids = aiIds.split(",").filter(Boolean);
      if (ids.length > 0) {
        setVisuallySimilarIds(ids);
        setAiSearchActive(true);
      }
    }
  }, [searchParams]);

  // ── Filter logic ──
  const handleToggleFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: toggleFilter(prev[key], value),
      }));
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // ── Computed: filtered products ──
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      if (
        filters.materialType.length > 0 &&
        !filters.materialType.includes(p.materialType)
      )
        return false;
      if (filters.color.length > 0 && !filters.color.includes(p.color))
        return false;
      if (filters.finish.length > 0 && !filters.finish.includes(p.finish))
        return false;
      if (
        filters.thickness.length > 0 &&
        !filters.thickness.includes(p.thickness)
      )
        return false;
      if (
        filters.availability.length > 0 &&
        !filters.availability.includes(p.status)
      )
        return false;
      if (filters.city.length > 0 && !filters.city.includes(p.location))
        return false;
      if (
        filters.category.length > 0 &&
        !filters.category.includes(p.category)
      )
        return false;
      return true;
    });
  }, [filters, ALL_PRODUCTS]);

  // ── Computed: sorted products (with city boosting) ──
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    const cityCapitalized =
      userCity.charAt(0).toUpperCase() + userCity.slice(1);

    list.sort((a, b) => {
      if (sortBy === "recommended") {
        // City-matched products first
        const aCity = a.location === cityCapitalized ? 0 : 1;
        const bCity = b.location === cityCapitalized ? 0 : 1;
        if (aCity !== bCity) return aCity - bCity;
        return b.popularity - a.popularity;
      }
      if (sortBy === "popular") return b.popularity - a.popularity;
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      if (sortBy === "price-asc") return a.priceMin - b.priceMin;
      if (sortBy === "price-desc") return b.priceMax - a.priceMax;
      return 0;
    });

    return list;
  }, [filteredProducts, sortBy, userCity]);

  // ── AI Search handlers ──
  const handleAISearchComplete = useCallback(
    (ids: string[]) => {
      setVisuallySimilarIds(ids);
      setAiSearchActive(true);
      // Store a reference image (use first matched product bg as a proxy)
      // In a real app this would be the actual uploaded image URL
      setAiImagePreview(null); // cleared since modal is closing
    },
    []
  );

  const handleClearAISearch = useCallback(() => {
    setAiSearchActive(false);
    setVisuallySimilarIds([]);
    if (aiImagePreview) URL.revokeObjectURL(aiImagePreview);
    setAiImagePreview(null);
  }, [aiImagePreview]);

  // ── Display products: AI search overrides normal view ──
  const displayProducts = useMemo(() => {
    if (aiSearchActive) {
      return sortedProducts.filter((p) => visuallySimilarIds.includes(p.id));
    }
    return sortedProducts;
  }, [aiSearchActive, sortedProducts, visuallySimilarIds]);

  const alternativeProducts = useMemo(() => {
    if (!aiSearchActive || visuallySimilarIds.length === 0) return [];
    const similarSet = new Set(visuallySimilarIds);
    const similarMaterials = new Set(
      ALL_PRODUCTS.filter((p) => similarSet.has(p.id)).map((p) => p.materialType)
    );
    return ALL_PRODUCTS.filter(
      (p) => !similarSet.has(p.id) && similarMaterials.has(p.materialType)
    ).slice(0, 6);
  }, [aiSearchActive, visuallySimilarIds, ALL_PRODUCTS]);

  const cityCapitalized = userCity.charAt(0).toUpperCase() + userCity.slice(1);

  return (
    <>
      {/* Page header */}
      <div
        className="py-12 md:py-16"
        style={{
          background: "linear-gradient(135deg, #1e2330 0%, #252d3d 40%, #1a2035 70%, #1e2330 100%)",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.18em] mb-3">
              Full Collection
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              Premium Stone Catalog
            </h1>
            <p className="font-sans text-gray-400 text-base mt-3 max-w-xl">
              Browse {ALL_PRODUCTS.length}+ verified stones from India&apos;s
              finest suppliers — filtered for {cityCapitalized}.
            </p>

            {/* Quick actions */}
            <div className="flex items-center gap-3 mt-5">
              <motion.button
                onClick={() => setAiModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold border transition-all duration-200 ${
                  aiSearchActive
                    ? "bg-amber-gold text-white border-amber-gold"
                    : "bg-white/8 border-white/15 text-white/80 hover:bg-white/14 hover:border-white/25"
                }`}
              >
                <Camera size={14} />
                {aiSearchActive ? "AI Search Active" : "Search by Image"}
              </motion.button>
              {aiSearchActive && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleClearAISearch}
                  className="text-xs font-sans text-white/45 hover:text-white transition-colors"
                >
                  Clear AI results
                </motion.button>
              )}
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Main catalog area */}
      <div className="bg-gray-50 min-h-screen">
        <Container>
          <div className="py-8 flex gap-7">
            {/* ── Sidebar ── */}
            <FilterSidebar
              filters={filters}
              onToggle={handleToggleFilter}
              onClearAll={handleClearAll}
              activeCount={activeFilterCount}
              isMobileOpen={isMobileFilterOpen}
              onMobileClose={() => setIsMobileFilterOpen(false)}
            />

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0">
              {/* Sorting header */}
              <SortingHeader
                resultCount={displayProducts.length}
                viewMode={viewMode}
                onViewChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                activeFilterCount={activeFilterCount}
                onOpenFilters={() => setIsMobileFilterOpen(true)}
                onOpenAISearch={() => setAiModalOpen(true)}
                userCity={cityCapitalized}
                isAISearchActive={aiSearchActive}
              />

              {/* AI Search banner */}
              <AnimatePresence>
                {aiSearchActive && (
                  <VisuallySimilarBanner
                    imagePreview={aiImagePreview}
                    count={displayProducts.length}
                    onClear={handleClearAISearch}
                  />
                )}
              </AnimatePresence>

              {/* ── Products grid / list ── */}
              <AnimatePresence mode="wait">
                {displayProducts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-14 h-14 bg-stone-dark/5 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="font-serif text-xl font-semibold text-stone-950 mb-2">
                      No stones match your filters
                    </p>
                    <p className="font-sans text-sm text-stone-dark/50 mb-5">
                      Try clearing some filters to broaden your search
                    </p>
                    <motion.button
                      onClick={handleClearAll}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-luxury text-sm font-medium rounded-xl px-5 py-2.5"
                    >
                      Clear All Filters
                    </motion.button>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {displayProducts.map((product, i) => (
                      <CatalogProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        isVisuallySimilar={
                          aiSearchActive &&
                          visuallySimilarIds.includes(product.id)
                        }
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {displayProducts.map((product, i) => (
                      <CatalogProductListItem
                        key={product.id}
                        product={product}
                        index={i}
                        isVisuallySimilar={
                          aiSearchActive &&
                          visuallySimilarIds.includes(product.id)
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Alternative Materials section (AI search only) ── */}
              <AnimatePresence>
                {aiSearchActive && alternativeProducts.length > 0 && (
                  <AlternativeMaterialsSection
                    products={alternativeProducts}
                    viewMode={viewMode}
                  />
                )}
              </AnimatePresence>
            </main>
          </div>
        </Container>
      </div>

      {/* AI Image Search Modal */}
      <AIImageSearchModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSearchComplete={handleAISearchComplete}
      />
    </>
  );
}
