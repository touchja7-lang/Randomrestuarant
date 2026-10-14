import { PriceRange, AVAILABLE_TAGS } from '../types';

interface FilterChipsProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags?: () => void;
  selectedPrice: PriceRange | null;
  onPriceChange: (price: PriceRange | null) => void;
  onlyOpenNow: boolean;
  onOpenToggle: () => void;
}

const PRICE_OPTIONS: { label: string; sub: string; value: PriceRange | null }[] = [
  { label: 'ทั้งหมด', sub: 'ทุกระดับราคา', value: null },
  { label: '฿ ประหยัด', sub: 'ไม่เกิน 100.-', value: 'cheap' },
  { label: '฿฿ ปานกลาง', sub: '100 - 300.-', value: 'medium' },
  { label: '฿฿฿ พรีเมียม', sub: '300.- ขึ้นไป', value: 'premium' },
];

export const FilterChips = ({
  selectedTags,
  onTagToggle,
  onClearTags,
  selectedPrice,
  onPriceChange,
  onlyOpenNow,
  onOpenToggle,
}: FilterChipsProps) => {
  return (
    <div className="space-y-6">
      {/* Price Range Segmented Group */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            งบประมาณต่อคน (Price Range)
          </label>
          {selectedPrice && (
            <button
              onClick={() => onPriceChange(null)}
              className="text-[11px] font-semibold text-zinc-400 hover:text-brand-600 transition-colors"
            >
              รีเซ็ต
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRICE_OPTIONS.map(({ label, sub, value }) => {
            const isSelected = selectedPrice === value;
            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => onPriceChange(value)}
                className={`py-2.5 px-3 rounded-xl text-left border transition-all duration-150 ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm ring-1 ring-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60'
                }`}
              >
                <div className="text-xs font-bold">{label}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-400'
                  }`}
                >
                  {sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuisine Tags Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            ประเภทอาหาร (Cuisines)
            {selectedTags.length > 0 && (
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                เลือกแล้ว {selectedTags.length}
              </span>
            )}
          </label>
          {selectedTags.length > 0 && onClearTags && (
            <button
              onClick={onClearTags}
              className="text-[11px] font-semibold text-zinc-400 hover:text-brand-600 transition-colors"
            >
              ล้างค่า ({selectedTags.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs scale-[1.02]'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Open Now Toggle Bar */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <span>เฉพาะร้านที่เปิดอยู่ตอนนี้</span>
            <span
              className={`w-2 h-2 rounded-full ${
                onlyOpenNow ? 'bg-emerald-500' : 'bg-zinc-300'
              }`}
            />
          </div>
          <div className="text-xs text-zinc-400">
            กรองเฉพาะร้านที่สถานะเปิดบริการ (Open Now)
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={onlyOpenNow}
          onClick={onOpenToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            onlyOpenNow ? 'bg-emerald-600' : 'bg-zinc-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              onlyOpenNow ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
