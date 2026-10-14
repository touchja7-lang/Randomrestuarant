import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { getLineManUrl, getGrabUrl } from '../utils/delivery';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onDelete?: (id: string) => void;
}

const PRICE_TAG: Record<string, { label: string; textClass: string; bgClass: string }> = {
  cheap: { label: '฿ ประหยัด', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-200/80' },
  medium: { label: '฿฿ ปานกลาง', textClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200/80' },
  premium: { label: '฿฿฿ พรีเมียม', textClass: 'text-brand-700', bgClass: 'bg-brand-50 border-brand-200/80' },
};

export const RestaurantCard = ({ restaurant, onDelete }: RestaurantCardProps) => {
  const price = PRICE_TAG[restaurant.priceRange] || PRICE_TAG.medium;

  return (
    <div className="card-interactive overflow-hidden flex flex-col group">
      {/* Image Banner */}
      <Link to={`/restaurants/${restaurant._id}`} className="relative h-44 w-full bg-zinc-100 overflow-hidden block">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Live Status Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
              restaurant.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-800/85 text-zinc-300'
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

        {/* Rating Pill */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-950/75 text-white backdrop-blur-md">
            ⭐ {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to={`/restaurants/${restaurant._id}`}
              className="font-bold text-zinc-900 group-hover:text-brand-600 transition-colors line-clamp-1 text-base tracking-tight"
            >
              {restaurant.name}
            </Link>
            <span
              className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${price.bgClass} ${price.textClass}`}
            >
              {price.label}
            </span>
          </div>

          {restaurant.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-2">
              {restaurant.description}
            </p>
          )}

          {restaurant.address && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mb-1">
              <span>📍</span>
              <span className="truncate">{restaurant.address}</span>
            </div>
          )}

          {restaurant.menus && restaurant.menus.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 truncate font-medium">
              <span>🍲</span>
              <span className="truncate">เมนูเด็ด: {restaurant.menus.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Tags & Action row */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 overflow-hidden max-h-6">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
            {restaurant.tags.length > 3 && (
              <span className="text-[11px] font-semibold text-zinc-400 self-center">
                +{restaurant.tags.length - 3}
              </span>
            )}
          </div>

          {/* Quick Actions (Always available for personal use) */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <a
              href={getLineManUrl(restaurant)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-xs"
              title="สั่งเดลิเวอรีผ่าน LINE MAN"
            >
              <span className="w-5 h-5 rounded-md bg-[#06C755] text-white flex items-center justify-center text-[11px] font-black shadow-2xs">
                LM
              </span>
            </a>
            <a
              href={getGrabUrl(restaurant)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-xs"
              title="สั่งเดลิเวอรีผ่าน GrabFood"
            >
              <span className="w-5 h-5 rounded-md bg-[#00B14F] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                GB
              </span>
            </a>
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-brand-600 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
                title="เปิด Google Maps"
              >
                🗺️
              </a>
            )}
            {restaurant.sourceUrl && (
              <a
                href={restaurant.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 active:bg-amber-100 transition-colors text-xs"
                title="เปิดดูบน Wongnai"
              >
                🍽️
              </a>
            )}
            <Link
              to={`/restaurants/${restaurant._id}/edit`}
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors text-xs"
              title="แก้ไขร้านนี้"
            >
              ✏️
            </Link>
            <button
              onClick={() => onDelete?.(restaurant._id)}
              className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-xs cursor-pointer"
              title="ลบร้านนี้"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
