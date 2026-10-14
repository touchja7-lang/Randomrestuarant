import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SpinButton } from '../components/SpinButton';
import { FilterChips } from '../components/FilterChips';
import { RandomResultCard } from '../components/RandomResultCard';
import { useSpinRandom, useHistory } from '../hooks/useRandom';
import { Restaurant, PriceRange, RandomFilters } from '../types';

const SLOT_TICKER_ITEMS = [
  '🍜 ราเมนซุปเข้มข้น',
  '🥗 ส้มตำไก่ย่างปลาร้าแซ่บ',
  '🍣 แซลมอนซาชิมิสด',
  '🍕 พิซซ่าเตาฟืนชีสเยิ้ม',
  '☕ ลาเต้อาร์ต & บรันช์คาเฟ่',
  '🥩 สเต็กเนื้อวากิวย่างฉ่ำ',
  '🍲 สุกี้หม้อไฟโบราณ',
  '🍚 ข้าวมันไก่ตอนตอนนุ่ม',
  '🥟 ติ่มซำนึ่งสดเข่งร้อน',
  '🍔 เบอร์เกอร์เนื้อบดทรัฟเฟิล',
];

export const RandomPage = () => {
  const [filters, setFilters] = useState<RandomFilters>({
    tags: [],
    priceRange: null,
    onlyOpenNow: false,
    excludeRestaurantIds: [],
  });

  const [result, setResult] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Roulette Slot Animation State
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [slotDisplayText, setSlotDisplayText] = useState('พร้อมสุ่มร้านอาหาร!');
  const slotIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const spinMutation = useSpinRandom();
  const { data: historyData } = useHistory(1, 5);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (slotIntervalRef.current) clearInterval(slotIntervalRef.current);
    };
  }, []);

  const handleSpin = async () => {
    setError(null);
    setResult(null);
    setIsSlotSpinning(true);

    // Start slot text shuffling animation
    let counter = 0;
    slotIntervalRef.current = setInterval(() => {
      setSlotDisplayText(SLOT_TICKER_ITEMS[counter % SLOT_TICKER_ITEMS.length]);
      counter++;
    }, 80);

    try {
      const pickedRestaurant = await spinMutation.mutateAsync(filters);

      // 1.1s tactile anticipation, then reveal
      setTimeout(() => {
        if (slotIntervalRef.current) clearInterval(slotIntervalRef.current);
        setSlotDisplayText(`🎉 ได้ร้าน: ${pickedRestaurant.name}!`);
        setIsSlotSpinning(false);
        setResult(pickedRestaurant);
      }, 1100);
    } catch (err: unknown) {
      if (slotIntervalRef.current) clearInterval(slotIntervalRef.current);
      setIsSlotSpinning(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'ไม่พบร้านอาหารที่ตรงกับตัวกรองของคุณ ลองปรับเงื่อนไขแล้วสุ่มใหม่อีกครั้ง';
      setError(msg);
      setSlotDisplayText('ลองปรับฟิลเตอร์แล้วสุ่มใหม่');
    }
  };

  const handleTagToggle = (tag: string) => {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleClearTags = () => {
    setFilters((f) => ({ ...f, tags: [] }));
  };

  const handlePriceChange = (price: PriceRange | null) => {
    setFilters((f) => ({ ...f, priceRange: price }));
  };

  const handleOpenToggle = () => {
    setFilters((f) => ({ ...f, onlyOpenNow: !f.onlyOpenNow }));
  };

  const handleResetFilters = () => {
    setFilters({
      tags: [],
      priceRange: null,
      onlyOpenNow: false,
      excludeRestaurantIds: [],
    });
  };

  const handleSpinAgain = () => {
    setResult(null);
    handleSpin();
  };

  const activeFiltersCount =
    (filters.priceRange ? 1 : 0) +
    filters.tags.length +
    (filters.onlyOpenNow ? 1 : 0);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <span>🎰</span> Restaurant Randomizer
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          สุ่มร้านอาหารประจำมื้อ
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto px-2">
          ตั้งค่าเงื่อนไขที่ต้องการ แล้วกดปุ่มสุ่มเพื่อปลดล็อกมื้ออาหารที่คุณถูกใจ
        </p>
      </div>

      {/* Roulette Slot Ticker Screen */}
      <div className="card-surface p-4 sm:p-8 text-center border-2 border-zinc-200/90 shadow-card relative overflow-hidden bg-gradient-to-b from-zinc-50/50 to-white">
        <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          {isSlotSpinning ? 'ระบบกำลังวิเคราะห์และสุ่มร้าน...' : 'หน้าจอผลการสุ่ม (Roulette Display)'}
        </div>

        <div
          className={`py-3.5 sm:py-4 px-3 sm:px-6 rounded-2xl bg-zinc-950 text-white font-extrabold text-base sm:text-2xl tracking-tight shadow-inner flex items-center justify-center min-h-[64px] sm:min-h-[72px] transition-all duration-150 ${
            isSlotSpinning ? 'animate-slot-shake ring-2 ring-brand-500' : ''
          }`}
        >
          <span className="truncate">{slotDisplayText}</span>
        </div>

        {/* Spin trigger button */}
        <div className="mt-5 sm:mt-6 flex justify-center">
          <SpinButton onClick={handleSpin} isSpinning={isSlotSpinning || spinMutation.isPending} />
        </div>
      </div>

      {/* Result Section */}
      {result && !isSlotSpinning && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping" />
              ร้านที่คุณสุ่มได้
            </h2>
            <button
              onClick={handleSpinAgain}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              🔄 สุ่มใหม่อีกครั้ง
            </button>
          </div>
          <RandomResultCard restaurant={result} onSpinAgain={handleSpinAgain} />
        </div>
      )}

      {/* Error state */}
      {error && !isSlotSpinning && (
        <div className="card-surface p-5 border-brand-200 bg-brand-50/50 text-center space-y-2">
          <div className="text-2xl">🔍</div>
          <div className="font-bold text-sm text-brand-900">{error}</div>
          <div className="text-xs text-brand-700">
            คำแนะนำ: ลองปลดล็อกตัวกรองบางประเภท หรือกดปุ่มรีเซ็ตตัวกรองด้านล่าง
          </div>
          <button
            onClick={handleResetFilters}
            className="btn-secondary text-xs py-1.5 px-3 border-brand-200 text-brand-800 hover:bg-brand-100"
          >
            รีเซ็ตตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* Filters Accordion / Box */}
      <div className="card-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-zinc-900">
              ตัวกรองการสุ่ม (Filter Options)
            </h2>
            {activeFiltersCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {activeFiltersCount} ตัวกรอง
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-zinc-400 hover:text-brand-600 transition-colors"
            >
              ล้างค่าทั้งหมด
            </button>
          )}
        </div>

        <FilterChips
          selectedTags={filters.tags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
          selectedPrice={filters.priceRange}
          onPriceChange={handlePriceChange}
          onlyOpenNow={filters.onlyOpenNow}
          onOpenToggle={handleOpenToggle}
        />
      </div>

      {/* Recent Spins History Section */}
      {historyData && historyData.history.length > 0 && (
        <div className="card-surface p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <span>🕒</span> ประวัติการสุ่มล่าสุด
            </h3>
            <span className="text-xs text-zinc-400">5 รายการล่าสุด</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {historyData.history.map((h) => {
              const snap = h.result.snapshot;
              return (
                <div
                  key={h._id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 first:pt-0 last:pb-0 hover:bg-zinc-50/50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                      {snap?.imageUrl ? (
                        <img
                          src={snap.imageUrl}
                          alt={snap.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-zinc-900 truncate">
                        {snap?.name || 'ร้านอาหาร'}
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2">
                        <span>
                          {new Date(h.createdAt).toLocaleDateString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {snap?.priceRange && (
                          <span>
                            • {snap.priceRange === 'cheap' ? '฿' : snap.priceRange === 'medium' ? '฿฿' : '฿฿฿'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {snap?.googleMapsUrl && (
                      <a
                        href={snap.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs py-1.5 px-2.5 text-zinc-600 hover:text-brand-600"
                        title="เปิดแผนที่"
                      >
                        📍 แผนที่
                      </a>
                    )}
                    <Link
                      to={`/restaurants/${h.result.restaurantId}`}
                      className="btn-secondary text-xs py-1.5 px-3 font-medium"
                    >
                      ดูข้อมูล →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
