export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF7F1] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-gold/30 border-t-amber-gold rounded-full animate-spin" />
        <p className="font-sans text-sm text-gray-400 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
