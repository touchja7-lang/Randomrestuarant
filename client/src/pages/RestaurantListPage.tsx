import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurants, useDeleteRestaurant } from '../hooks/useRestaurants';
import { RestaurantCard } from '../components/RestaurantCard';
import { PriceRange } from '../types';

export const RestaurantListPage = () => {
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceRange | ''>('');
  const [openFilter, setOpenFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useRestaurants({
    search: search || undefined,
    priceRange: priceFilter || undefined,
    isOpen: openFilter,
    page,
    limit: 12,
  });

  const deleteMutation = useDeleteRestaurant();

  const handleDelete = async (id: string) => {
    if (!window.confirm('คุณต้องการลบร้านอาหารนี้ใช่หรือไม่?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('เกิดข้อผิดพลาดในการลบร้านอาหาร');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setPriceFilter('');
    setOpenFilter(undefined);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / 12) : 1;
  const isFiltering = !!search || priceFilter !== '' || openFilter !== undefined;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            รายชื่อร้านอาหารทั้งหมด
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {data ? `มีทั้งหมด ${data.total} ร้านในระบบ` : 'กำลังโหลดข้อมูลร้าน...'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
          <Link to="/random" className="btn-secondary text-xs sm:text-sm py-2.5 px-3 sm:px-4 font-semibold text-center">
            🎲 ไปสุ่มร้าน
          </Link>
          <Link to="/restaurants/new" className="btn-primary text-xs sm:text-sm py-2.5 px-3 sm:px-4 font-bold text-center">
            <span>＋</span> เพิ่มร้านใหม่
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-surface p-3.5 sm:p-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อร้านอาหาร หรือทำเล..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-base pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Price Select */}
        <select
          value={priceFilter}
          onChange={(e) => {
            setPriceFilter(e.target.value as PriceRange | '');
            setPage(1);
          }}
          className="input-base w-full sm:w-44 text-xs font-medium cursor-pointer"
        >
          <option value="">ทุกระดับราคา</option>
          <option value="cheap">฿ ประหยัด (ไม่เกิน 100.-)</option>
          <option value="medium">฿฿ ปานกลาง (100-300.-)</option>
          <option value="premium">฿฿฿ พรีเมียม (300.- ขึ้นไป)</option>
        </select>

        {/* Open Status Select */}
        <select
          value={openFilter === undefined ? '' : String(openFilter)}
          onChange={(e) => {
            setOpenFilter(e.target.value === '' ? undefined : e.target.value === 'true');
            setPage(1);
          }}
          className="input-base w-full sm:w-40 text-xs font-medium cursor-pointer"
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="true">🟢 เปิดอยู่ (Open)</option>
          <option value="false">🔴 ปิดอยู่ (Closed)</option>
        </select>

        {isFiltering && (
          <button
            onClick={handleResetFilters}
            className="btn-ghost text-xs py-2 px-3 text-zinc-500 hover:text-brand-600 shrink-0"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card-surface h-72 p-4 space-y-3">
              <div className="h-40 bg-zinc-100 rounded-xl" />
              <div className="h-4 bg-zinc-100 rounded w-2/3" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !data?.restaurants?.length && (
        <div className="card-surface p-8 text-center border-brand-200 bg-brand-50/50 space-y-3">
          <div className="text-3xl">⚠️</div>
          <div className="font-bold text-zinc-900">ไม่สามารถโหลดข้อมูลร้านอาหารได้</div>
          <p className="text-xs text-zinc-500">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือเซิร์ฟเวอร์</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data && data.restaurants.length === 0 && (
        <div className="card-surface p-12 text-center space-y-4">
          <div className="text-4xl">🍽️</div>
          <div className="text-base font-bold text-zinc-900">ไม่พบร้านอาหารที่ตรงกับเงื่อนไข</div>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {isFiltering
              ? 'ลองปรับเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อดูร้านทั้งหมด'
              : 'ยังไม่มีร้านอาหารในระบบ เริ่มต้นสร้างร้านอาหารแรกของคุณได้เลย!'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            {isFiltering ? (
              <button onClick={handleResetFilters} className="btn-secondary text-xs">
                ล้างตัวกรอง
              </button>
            ) : (
              <Link to="/restaurants/new" className="btn-primary text-xs">
                + เพิ่มร้านอาหารใหม่
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      {!isLoading && data && data.restaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            ← หน้าก่อนหน้า
          </button>
          <span className="text-xs font-semibold text-zinc-500 px-2">
            หน้า {page} จาก {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            หน้าถัดไป →
          </button>
        </div>
      )}
    </div>
  );
};
