import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRestaurant, useDeleteRestaurant } from '../hooks/useRestaurants';

const PRICE_BADGE_MAP: Record<string, { label: string; textClass: string; bgClass: string }> = {
  cheap: { label: '฿ ประหยัด (ต่ำกว่า 100.-)', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200' },
  medium: { label: '฿฿ ปานกลาง (100 - 300.-)', textClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200' },
  premium: { label: '฿฿฿ พรีเมียม (300.- ขึ้นไป)', textClass: 'text-brand-700', bgClass: 'bg-brand-50 border-brand-200' },
};

export const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: restaurant, isLoading, error } = useRestaurant(id!);
  const deleteMutation = useDeleteRestaurant();
  const [copied, setCopied] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [isMenuSpinning, setIsMenuSpinning] = useState(false);

  const handleSpinMenu = () => {
    if (!restaurant?.menus || restaurant.menus.length === 0) return;
    setIsMenuSpinning(true);
    setSelectedMenu(null);
    let counter = 0;
    const interval = setInterval(() => {
      setSelectedMenu(restaurant.menus![counter % restaurant.menus!.length]);
      counter++;
    }, 70);
    setTimeout(() => {
      clearInterval(interval);
      const picked = restaurant.menus![Math.floor(Math.random() * restaurant.menus!.length)];
      setSelectedMenu(picked);
      setIsMenuSpinning(false);
    }, 700);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-4 bg-zinc-200 rounded w-24" />
        <div className="h-72 bg-zinc-200 rounded-2xl" />
        <div className="h-8 bg-zinc-200 rounded w-1/2" />
        <div className="h-20 bg-zinc-100 rounded-xl" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🔍</div>
        <h1 className="text-xl font-bold text-zinc-900">ไม่พบร้านอาหารนี้</h1>
        <p className="text-xs text-zinc-500">ร้านอาจถูกลบออก หรือลิงก์ไม่ถูกต้อง</p>
        <Link to="/restaurants" className="btn-secondary text-xs">
          ← กลับหน้ารายชื่อร้านอาหาร
        </Link>
      </div>
    );
  }

  const price = PRICE_BADGE_MAP[restaurant.priceRange] || PRICE_BADGE_MAP.medium;

  const handleCopyAddress = () => {
    if (restaurant.address) {
      navigator.clipboard.writeText(restaurant.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบร้านนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    try {
      await deleteMutation.mutateAsync(restaurant._id);
      navigate('/restaurants');
    } catch {
      alert('เกิดข้อผิดพลาดในการลบร้านอาหาร');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <span>←</span> ย้อนกลับไปหน้ารวมร้านอาหาร
        </Link>
      </div>

      {/* Main Showcase Card */}
      <div className="card-surface overflow-hidden shadow-card border border-zinc-200/90">
        {/* Banner image */}
        <div className="relative w-full h-72 sm:h-96 bg-zinc-100 overflow-hidden">
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex flex-col items-center justify-center text-6xl">
              🍽️
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Status & Rating on top */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                restaurant.isOpen
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full bg-white ${
                  restaurant.isOpen ? 'animate-pulse' : ''
                }`}
              />
              {restaurant.isOpen ? 'เปิดบริการอยู่ (Open Now)' : 'ปิดอยู่ชั่วคราว (Closed)'}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/80 text-white backdrop-blur-md">
              ⭐ {restaurant.rating.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Restaurant Title floating bottom */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
              {restaurant.name}
            </h1>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Price & Tag metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-100">
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
                    className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                รายละเอียดร้าน
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* 🍲 Signature Menus & Randomizer */}
          {restaurant.menus && restaurant.menus.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-50/70 border border-amber-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
                    <span className="text-lg">🍲</span> เมนูเด็ดประจำร้าน ({restaurant.menus.length} เมนู)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    เลือกดูหรือกดปุ่มสุ่มเพื่อตัดสินใจว่าจะสั่งเมนูอะไรดี!
                  </p>
                </div>
                <button
                  onClick={handleSpinMenu}
                  disabled={isMenuSpinning}
                  className="btn-primary text-xs py-2 px-4 font-bold shadow-xs shrink-0 self-start sm:self-auto"
                >
                  {isMenuSpinning ? 'กำลังสุ่ม...' : '🎲 สุ่มเมนูอาหารที่จะสั่งวันนี้'}
                </button>
              </div>

              {selectedMenu && (
                <div className={`p-4 rounded-xl border text-center space-y-1 transition-all ${
                  isMenuSpinning
                    ? 'bg-amber-100 border-amber-300 animate-pulse text-amber-900 font-bold'
                    : 'bg-white border-amber-300 shadow-sm text-zinc-900 animate-slide-up'
                }`}>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    🎉 เมนูแนะนำสำหรับมื้อนี้ของคุณ:
                  </span>
                  <div className="text-xl font-extrabold text-brand-700">
                    {selectedMenu}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {restaurant.menus.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMenu(m)}
                    className={`text-xs px-3 py-1.5 rounded-xl border text-left transition-colors ${
                      selectedMenu === m
                        ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-white hover:bg-amber-100/50 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    {selectedMenu === m ? '✓ ' : '• '}{m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Address Box */}
          {restaurant.address && (
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  พิกัด & ที่อยู่ (Location)
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  {copied ? 'คัดลอกที่อยู่แล้ว ✓' : 'คัดลอกที่อยู่'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 flex items-start gap-2">
                <span className="text-brand-600 shrink-0 mt-0.5">📍</span>
                <span>{restaurant.address}</span>
              </p>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 py-3 text-sm font-bold shadow-md"
              >
                <span>📍</span> เปิดเส้นทางใน Google Maps
              </a>
            )}
            {restaurant.sourceUrl && (
              <a
                href={restaurant.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary py-3 text-sm font-semibold text-center border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900"
              >
                <span>🍽️</span> รีวิวบน Wongnai ↗
              </a>
            )}
            <Link
              to="/random"
              className="btn-secondary flex-1 py-3 text-sm font-semibold text-center"
            >
              <span>🎲</span> สุ่มร้านอาหารอื่น
            </Link>
          </div>

          {/* Management Controls */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-400">การจัดการข้อมูลร้านนี้</span>
            <div className="flex items-center gap-2">
              <Link
                to={`/restaurants/${restaurant._id}/edit`}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                ✏️ แก้ไขข้อมูล
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-xs py-1.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                🗑️ ลบร้านนี้
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
