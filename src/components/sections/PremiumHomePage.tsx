"use client";

import { HeroSlideshow } from "./HeroSlideshow";
import { CategoryGrid } from "./CategoryGrid";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { TestimonialsCarousel } from "./TestimonialsCarousel";


export function PremiumHomePage() {
  return (
    <>
      <HeroSlideshow />
      <CategoryGrid />
      <FeaturedProductsSection />
      <TestimonialsCarousel />
     
    </>
  );
}
