import { MainLayout } from "@/components/common";
import { PremiumHomePage } from "@/components/sections/PremiumHomePage";

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-[#FBF7F1]">
        <PremiumHomePage />
      </div>
    </MainLayout>
  );
}
