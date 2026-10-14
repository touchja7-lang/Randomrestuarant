import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurants } from '../hooks/useRestaurants';
import { DEFAULT_PRESET_RESTAURANTS } from '../data/presetRestaurants';

export const HomePage = () => {
  const { data: restaurantData, isLoading } = useRestaurants({ limit: 20 });
  const [sampleOffset, setSampleOffset] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const allRestaurants =
    restaurantData?.restaurants && restaurantData.restaurants.length > 0
      ? restaurantData.restaurants
      : DEFAULT_PRESET_RESTAURANTS;

  const currentSample = allRestaurants.slice(sampleOffset, sampleOffset + 3);

  const handleNextSample = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setSampleOffset((prev) => (prev + 3 >= allRestaurants.length ? 0 : prev + 3));
      setIsShuffling(false);
    }, 140);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background subtle radial warm wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-50/50 via-amber-50/20 to-transparent pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-8 sm:pt-20 pb-12 sm:pb-16 text-center">
        {/* Fresh pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-semibold mb-4 sm:mb-6 animate-fade-in shadow-xs">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>RandomEats — ตัวช่วยสุ่มมื้ออาหารประจำวัน</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.2] sm:leading-[1.15] max-w-3xl mx-auto mb-4 sm:mb-6">
          หมดปัญหา{' '}
          <span className="text-brand-600 underline decoration-brand-200 underline-offset-8">
            “กินอะไรดี?”
          </span>
          <br />
          ให้เราสุ่มร้านอร่อยให้คุณทันที
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
          ไม่ต้องเถียงกับใคร ไม่ต้องเลื่อนฟีดจนหิวโซ เลือกตัวกรองงบและสไตล์อาหารที่อยากกิน
          แล้วกดสุ่มเพื่อรับคำตอบที่พร้อมออกเดินทางได้เลย
        </p>

        {/* CTA Buttons - Single Line guaranteed & Full width on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 max-w-xl mx-auto mb-8 w-full px-2 sm:px-0">
          <Link
            to="/random"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 whitespace-nowrap btn-primary text-sm sm:text-base py-3.5 px-6 sm:px-8 rounded-2xl shadow-glow-brand hover:shadow-lg font-bold"
          >
            <span className="text-lg shrink-0">🎲</span>
            <span className="whitespace-nowrap">เริ่มสุ่มร้านอาหารเลย</span>
          </Link>
          <Link
            to="/restaurants"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 whitespace-nowrap btn-secondary text-sm sm:text-base py-3.5 px-6 rounded-2xl font-semibold"
          >
            <span className="text-lg shrink-0">🍽️</span>
            <span className="whitespace-nowrap">ดูรายชื่อร้านทั้งหมด</span>
          </Link>
        </div>

        {/* Interactive / Visual Teaser Card with Real Restaurant Data */}
        <div className="mt-8 sm:mt-14 max-w-3xl mx-auto card-surface p-4 sm:p-6 border border-zinc-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 text-xs font-semibold gap-3">
            <span className="flex items-center gap-2 text-zinc-700 text-left">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>พร้อมสุ่มจากร้านจริงในระบบ ({allRestaurants.length} ร้าน)</span>
            </span>
            <div className="flex items-center justify-between sm:justify-end gap-2.5 text-zinc-500 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
              {allRestaurants.length > 3 && (
                <button
                  type="button"
                  onClick={handleNextSample}
                  className="hover:text-brand-600 transition-colors flex items-center gap-1 font-medium text-xs bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1.5 rounded-lg cursor-pointer active:scale-95"
                >
                  🔄 สลับดูร้านอื่น
                </button>
              )}
              <Link
                to="/restaurants"
                className="hover:text-brand-600 transition-colors flex items-center gap-1 font-bold text-brand-600"
              >
                ดูทั้งหมด ({allRestaurants.length}) →
              </Link>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left transition-all duration-200 ease-out ${
              isShuffling ? 'opacity-30 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
          >
            {isLoading && !allRestaurants.length ? (
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/60 animate-pulse space-y-3"
                >
                  <div className="h-28 bg-zinc-200 rounded-lg" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              currentSample.map((restaurant) => {
                const priceTier =
                  restaurant.priceRange === 'cheap'
                    ? { label: '฿ ประหยัด', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' }
                    : restaurant.priceRange === 'premium'
                    ? { label: '฿฿฿ พรีเมียม', cls: 'bg-brand-50 text-brand-700 border-brand-200/80' }
                    : { label: '฿฿ ปานกลาง', cls: 'bg-amber-50 text-amber-700 border-amber-200/80' };

                return (
                  <Link
                    key={restaurant._id}
                    to={`/restaurants/${restaurant._id}`}
                    className="group bg-zinc-50/70 hover:bg-white rounded-xl overflow-hidden border border-zinc-200/80 hover:border-brand-300 hover:shadow-card hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out p-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-28 rounded-lg overflow-hidden bg-zinc-200 mb-2.5">
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500';
                          }}
                        />
                        <div className="absolute top-1.5 left-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md ${
                              restaurant.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-zinc-800/80 text-zinc-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                restaurant.isOpen ? 'bg-white' : 'bg-zinc-400'
                              }`}
                            />
                            {restaurant.isOpen ? 'เปิดอยู่' : 'ปิด'}
                          </span>
                        </div>
                        {restaurant.rating && (
                          <div className="absolute top-1.5 right-1.5">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-950/75 text-white backdrop-blur-md">
                              ⭐ {restaurant.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-xs font-bold text-zinc-900 group-hover:text-brand-600 transition-colors truncate mb-1">
                        {restaurant.name}
                      </div>

                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priceTier.cls}`}>
                          {priceTier.label}
                        </span>
                        {restaurant.address && (
                          <span
                            className="text-[10px] text-zinc-400 truncate max-w-[130px]"
                            title={restaurant.address}
                          >
                            📍 {restaurant.address.split(' ')[0] || 'ปทุมวัน'}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {restaurant.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[10px] text-zinc-400">
                      <span>ร้านจริงในระบบ</span>
                      <span className="text-brand-600 font-medium group-hover:translate-x-0.5 transition-transform">
                        ดูรายละเอียด →
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-zinc-100">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mb-2">
            ออกแบบมาเพื่อการตัดสินใจที่ง่ายและเร็วที่สุด
          </h2>
          <p className="text-sm text-zinc-500">
            ตัดทุกความวุ่นวาย ให้เหลือแค่สิ่งที่คุณต้องการสำหรับการเลือกร้านอาหารใน 3 วินาที
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl font-bold border border-brand-100">
              🎯
            </div>
            <h3 className="font-bold text-zinc-900 text-base">กรองตรงใจ ไม่สุ่มมั่ว</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              ระบุสไตล์อาหารที่อยากกินในมื้อนี้ กรองระดับราคาที่สบายกระเป๋า
              และเลือกเฉพาะร้านที่กำลังเปิดบริการอยู่จริง
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100">
              📍
            </div>
            <h3 className="font-bold text-zinc-900 text-base">เปิด Google Maps ทันที</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              เมื่อผลการสุ่มออกมา สามารถกดลิงก์นำทางไปยัง Google Maps ได้ในคลิกเดียว
              ไม่ต้องเสียเวลาเสิร์ชหาพิกัดใหม่
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              📜
            </div>
            <h3 className="font-bold text-zinc-900 text-base">บันทึกประวัติทุกการสุ่ม</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              จำไม่ได้ว่าวันก่อนสุ่มเจอร้านไหน? ระบบเก็บประวัติ Recent Spins
              พร้อมข้อมูลฟิลเตอร์ที่คุณเคยใช้ไว้ให้ครบ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
