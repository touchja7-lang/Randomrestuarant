import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';

const PRICE_BADGE_STYLE: Record<string, { label: string; textClass: string; bgClass: string }> = {
  cheap: { label: '฿ ประหยัด (ต่ำกว่า 100.-)', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200' },
  medium: { label: '฿฿ ปานกลาง (100-300.-)', textClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200' },
  premium: { label: '฿฿฿ พรีเมียม (300.- ขึ้นไป)', textClass: 'text-brand-700', bgClass: 'bg-brand-50 border-brand-200' },
};

const DEFAULT_GENERIC_MENUS = [
  'เมนูซิกเนเจอร์อันดับ 1 ของร้าน',
  'เมนูยอดนิยมขายดีประจำวัน',
  'เมนูชุดรวมมิตรพิเศษ',
  'เมนูต้มยำ / ซุปหม้อไฟร้อนๆ',
  'เมนูของหวานหรือเครื่องดื่มปิดท้าย',
];

interface RandomResultCardProps {
  restaurant: Restaurant;
  onSpinAgain: () => void;
}

export const RandomResultCard = ({ restaurant, onSpinAgain }: RandomResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const price = PRICE_BADGE_STYLE[restaurant.priceRange] || PRICE_BADGE_STYLE.medium;

  // Menu Randomizer State
  const menuList = restaurant.menus && restaurant.menus.length > 0 ? restaurant.menus : DEFAULT_GENERIC_MENUS;
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [isMenuSpinning, setIsMenuSpinning] = useState(false);
  const [menuDisplayText, setMenuDisplayText] = useState<string | null>(null);
  const menuIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyAddress = () => {
    if (restaurant.address) {
      navigator.clipboard.writeText(restaurant.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpinMenu = () => {
    if (isMenuSpinning) return;
    setIsMenuSpinning(true);
    setSelectedMenu(null);

    let counter = 0;
    menuIntervalRef.current = setInterval(() => {
      setMenuDisplayText(menuList[counter % menuList.length]);
      counter++;
    }, 70);

    setTimeout(() => {
      if (menuIntervalRef.current) clearInterval(menuIntervalRef.current);
      const picked = menuList[Math.floor(Math.random() * menuList.length)];
      setSelectedMenu(picked);
      setMenuDisplayText(picked);
      setIsMenuSpinning(false);
    }, 850);
  };

  return (
    <div className="card-surface overflow-hidden border-2 border-brand-500/30 shadow-card-hover animate-slide-up">
      {/* Visual Header / Image */}
      <div className="relative w-full h-56 sm:h-72 bg-zinc-100 overflow-hidden">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-50 to-amber-50 flex flex-col items-center justify-center text-zinc-400">
            <span className="text-6xl mb-2">🍽️</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              ไม่มีรูปภาพร้าน
            </span>
          </div>
        )}

        {/* Gradient Overlay for bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />

        {/* Status badges floating over image */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-xs ${
              restaurant.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-white ${
                restaurant.isOpen ? 'animate-pulse' : ''
              }`}
            />
            {restaurant.isOpen ? 'เปิดบริการอยู่' : 'ปิดอยู่ชั่วคราว'}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-zinc-950/80 text-white backdrop-blur-md shadow-xs shrink-0">
            ⭐ {restaurant.rating.toFixed(1)} / 5.0
          </span>
        </div>

        {/* Name floating on the bottom of the image banner */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
            ผลการสุ่มมื้อนี้ 🎉
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight line-clamp-2">
            {restaurant.name}
          </h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Price & Tag bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div
            className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border ${price.bgClass} ${price.textClass}`}
          >
            {price.label}
          </div>

          {restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-medium transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-sm text-zinc-600 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        {/* Address with Copy helper */}
        {restaurant.address && (
          <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-3 border border-zinc-200/70 text-xs">
            <div className="flex items-center gap-2 text-zinc-700 truncate mr-2">
              <span className="text-brand-600 shrink-0">📍</span>
              <span className="truncate">{restaurant.address}</span>
            </div>
            <button
              onClick={handleCopyAddress}
              className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกที่อยู่'}
            </button>
          </div>
        )}

        {/* 🎲 MENU RANDOMIZER SECTION 🎲 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-50/70 border border-amber-200/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍲</span>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  สุ่มเมนูเด็ดที่จะกินในร้านนี้
                </h4>
                <p className="text-xs text-zinc-500">
                  หมดปัญหาเลือกร้านได้แล้วแต่ไม่รู้จะสั่งอะไรดี!
                </p>
              </div>
            </div>
            <button
              onClick={handleSpinMenu}
              disabled={isMenuSpinning}
              className="btn-primary text-xs py-2 px-3.5 font-bold shadow-xs hover:shadow-sm"
            >
              {isMenuSpinning ? 'กำลังสุ่ม...' : selectedMenu ? 'สุ่มเมนูใหม่ 🔄' : 'สุ่มเมนู 🎲'}
            </button>
          </div>

          {/* Random Menu Slot Animation / Display */}
          {(isMenuSpinning || selectedMenu) && (
            <div className={`p-4 rounded-xl text-center border transition-all ${
              isMenuSpinning
                ? 'bg-amber-100/60 border-amber-300 animate-pulse text-amber-900 font-bold text-base'
                : 'bg-white border-amber-300 shadow-sm text-zinc-900'
            }`}>
              {isMenuSpinning ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>{menuDisplayText}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    เมนูแนะนำประจำมื้อนี้ของคุณ ✨
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-brand-700">
                    {selectedMenu}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Available menus chip list */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-zinc-500">
              เมนูแนะนำยอดฮิต ({menuList.length} เมนู):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {menuList.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMenu(m)}
                  className={`text-xs px-2.5 py-1 rounded-lg border text-left transition-colors ${
                    selectedMenu === m
                      ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-zinc-700 border-zinc-200/80 hover:border-amber-300'
                  }`}
                >
                  {selectedMenu === m ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {restaurant.googleMapsUrl ? (
            <a
              href={restaurant.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary sm:col-span-2 py-3 text-sm font-bold shadow-md"
            >
              <span>📍</span> เปิดเส้นทางใน Google Maps
            </a>
          ) : (
            <Link
              to={`/restaurants/${restaurant._id}`}
              className="btn-primary sm:col-span-2 py-3 text-sm font-bold"
            >
              ดูข้อมูลร้าน
            </Link>
          )}

          <button
            onClick={onSpinAgain}
            className="btn-secondary py-3 text-sm font-semibold"
          >
            <span>🔄</span> สุ่มร้านใหม่
          </button>

          {restaurant.sourceUrl && (
            <a
              href={restaurant.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-3 text-center text-xs font-semibold py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
            >
              🍽️ ดูรีวิวและภาพเมนูเพิ่มเติมบน Wongnai ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
