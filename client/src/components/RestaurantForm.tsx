import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantSchema, RestaurantFormData } from '../validators';
import { Restaurant, AVAILABLE_TAGS, PriceRange } from '../types';
import { restaurantApi } from '../api/restaurant.api';

interface RestaurantFormProps {
  defaultValues?: Partial<Restaurant>;
  onSubmit: (data: RestaurantFormData) => void;
  isLoading?: boolean;
}

const PRICE_TIERS: { label: string; desc: string; value: PriceRange }[] = [
  { label: '฿ ประหยัด', desc: 'ต่ำกว่า 100.-', value: 'cheap' },
  { label: '฿฿ ปานกลาง', desc: '100 - 300.-', value: 'medium' },
  { label: '฿฿฿ พรีเมียม', desc: '300.- ขึ้นไป', value: 'premium' },
];

export const RestaurantForm = ({ defaultValues, onSubmit, isLoading }: RestaurantFormProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      address: defaultValues?.address || '',
      priceRange: defaultValues?.priceRange || 'medium',
      tags: defaultValues?.tags || [],
      imageUrl: defaultValues?.imageUrl || '',
      googleMapsUrl: defaultValues?.googleMapsUrl || '',
      sourceUrl: defaultValues?.sourceUrl || '',
      lineManUrl: defaultValues?.lineManUrl || '',
      grabUrl: defaultValues?.grabUrl || '',
      isOpen: defaultValues?.isOpen ?? true,
      rating: defaultValues?.rating ?? 4.0,
      menus: defaultValues?.menus || [],
    },
  });

  const selectedTags = watch('tags') || [];
  const previewImageUrl = watch('imageUrl');

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setValue('tags', next);
  };

  const handleAutoFetch = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setFetchStatus(null);

    try {
      const data = await restaurantApi.parseUrl(urlInput.trim());

      if (data.name) setValue('name', data.name);
      if (data.address) setValue('address', data.address);
      if (data.description) setValue('description', data.description);
      if (data.imageUrl) setValue('imageUrl', data.imageUrl);
      if (data.googleMapsUrl) setValue('googleMapsUrl', data.googleMapsUrl);
      if (data.sourceUrl) setValue('sourceUrl', data.sourceUrl);
      if (data.rating) setValue('rating', Number(data.rating.toFixed(1)));
      if (data.priceRange) setValue('priceRange', data.priceRange as PriceRange);
      if (data.tags && data.tags.length > 0) {
        setValue('tags', data.tags);
      }

      setFetchStatus({
        success: true,
        message: `ดึงข้อมูลสำเร็จ: "${data.name}" ตรวจสอบและกดบันทึกได้เลย!`,
      });
    } catch (err: unknown) {
      setFetchStatus({
        success: false,
        message:
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'ไม่สามารถดึงข้อมูลจากลิงก์นี้ได้ กรุณาตรวจสอบ URL หรือกรอกข้อมูลด้วยตนเอง',
      });
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto-Fill Feature Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-brand-50/40 border border-brand-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            ดึงข้อมูลร้านอัตโนมัติจากลิงก์ (Auto-Fill from Link)
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-600 text-white">
            Wongnai & Maps
          </span>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          วางลิงก์ร้านจาก <strong>Wongnai</strong> (เช่น <code className="text-brand-700 bg-white/70 px-1 py-0.5 rounded">https://www.wongnai.com/r/...</code>) หรือ <strong>Google Maps</strong> แล้วกดปุ่ม ระบบจะกรอกชื่อร้าน, ที่อยู่, รูปภาพ และสร้างลิงก์นำทางให้อัตโนมัติทันที
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAutoFetch();
              }
            }}
            placeholder="วางลิงก์ Wongnai หรือ Google Maps ที่นี่..."
            className="input-base flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleAutoFetch}
            disabled={isFetchingUrl || !urlInput.trim()}
            className="btn-primary text-xs py-2.5 px-4 shrink-0 shadow-sm font-bold"
          >
            {isFetchingUrl ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                กำลังดึงข้อมูล...
              </span>
            ) : (
              '⚡ ดึงข้อมูลร้าน'
            )}
          </button>
        </div>

        {fetchStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              fetchStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {fetchStatus.success ? '✓ ' : '✕ '}
            {fetchStatus.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Group 1: General Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-100">
            1. ข้อมูลร้านอาหาร (Basic Info)
          </h3>

          <div>
            <label className="label-base">ชื่อร้านอาหาร *</label>
            <input
              {...register('name')}
              className="input-base"
              placeholder="เช่น ส้มตำนัว, เอี้ยวฮั้วสุกี้โบราณ, ชาบูแล็บ"
            />
            {errors.name && (
              <p className="text-xs font-medium text-brand-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label-base">คำอธิบายสั้นๆ หรือเมนูแนะนำ</label>
            <textarea
              {...register('description')}
              className="input-base resize-none"
              rows={2}
              placeholder="เช่น สุกี้โบราณเตาถ่านสูตรเด็ด, หมูกรอบในตำนาน, บาร์เนื้อไม่อั้น"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">คะแนนรีวิว (0.0 - 5.0)</label>
              <input
                {...register('rating', { valueAsNumber: true })}
                type="number"
                min={0}
                max={5}
                step={0.1}
                className="input-base"
              />
              {errors.rating && (
                <p className="text-xs font-medium text-brand-600 mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="label-base">สถานะเปิด-ปิดร้าน</label>
              <div className="flex items-center h-10 px-3 border border-zinc-200 rounded-xl bg-zinc-50/50">
                <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700">
                  <input
                    {...register('isOpen')}
                    type="checkbox"
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
                  />
                  <span>เปิดให้บริการอยู่ในปัจจุบัน (Open Now)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Group 2: Price & Tags */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-100">
            2. ระดับราคา & หมวดหมู่ (Price & Categories)
          </h3>

          <div>
            <label className="label-base">ระดับราคา (Price Tier)</label>
            <Controller
              name="priceRange"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {PRICE_TIERS.map(({ label, desc, value }) => {
                    const isSelected = field.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{label}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-400'
                          }`}
                        >
                          {desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label-base mb-0">ป้ายแท็กอาหาร (Tags)</label>
              <span className="text-[11px] text-zinc-400">เลือกได้หลายรายการ</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menus input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label-base mb-0">เมนูแนะนำประจำร้าน (Signature Menus)</label>
              <span className="text-[11px] text-zinc-400">คั่นแต่ละเมนูด้วยเครื่องหมายจุลภาค (,)</span>
            </div>
            <textarea
              className="input-base text-xs h-20"
              placeholder="เช่น มาม่าต้มยำหมูกรอบ, ยำแซลมอนแซ่บ, คอหมูทอด, เต้าหู้ผัดพริกเกลือ"
              defaultValue={defaultValues?.menus?.join(', ') || ''}
              onChange={(e) => {
                const list = e.target.value
                  .split(',')
                  .map((m) => m.trim())
                  .filter(Boolean);
                setValue('menus', list);
              }}
            />
          </div>
        </div>

        {/* Group 3: Location & Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-100">
            3. แผนที่และรูปภาพ (Location & Media)
          </h3>

          <div>
            <label className="label-base">ที่อยู่ร้าน (Address)</label>
            <input
              {...register('address')}
              className="input-base"
              placeholder="เช่น 59,59/1-2 ซอยจุฬา12 วังใหม่ ปทุมวัน กทม."
            />
          </div>

          <div>
            <label className="label-base">ลิงก์ Google Maps (URL)</label>
            <input
              {...register('googleMapsUrl')}
              className="input-base"
              placeholder="https://maps.google.com/..."
            />
            {errors.googleMapsUrl && (
              <p className="text-xs font-medium text-brand-600 mt-1">
                {errors.googleMapsUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="label-base">ลิงก์ต้นทาง เช่น Wongnai (URL - ไม่บังคับ)</label>
            <input
              {...register('sourceUrl')}
              className="input-base"
              placeholder="https://www.wongnai.com/r/..."
            />
          </div>

          {/* Delivery App Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <label className="label-base flex items-center gap-1.5 text-emerald-800">
                <span>🛵 ลิงก์ร้านบน LINE MAN (ไม่บังคับ)</span>
              </label>
              <input
                {...register('lineManUrl')}
                className="input-base text-xs"
                placeholder="https://lineman.line.me/... (เว้นว่างเพื่อค้นหาอัตโนมัติ)"
              />
              {errors.lineManUrl && (
                <p className="text-xs font-medium text-brand-600 mt-1">
                  {errors.lineManUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-base flex items-center gap-1.5 text-[#00B14F]">
                <span>🟢 ลิงก์ร้านบน GrabFood (ไม่บังคับ)</span>
              </label>
              <input
                {...register('grabUrl')}
                className="input-base text-xs"
                placeholder="https://food.grab.com/... (เว้นว่างเพื่อค้นหาอัตโนมัติ)"
              />
              {errors.grabUrl && (
                <p className="text-xs font-medium text-brand-600 mt-1">
                  {errors.grabUrl.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label-base">ลิงก์รูปภาพ (Image URL)</label>
            <input
              {...register('imageUrl')}
              className="input-base"
              placeholder="https://img.wongnai.com/... หรือ https://images.unsplash.com/..."
            />
            {errors.imageUrl && (
              <p className="text-xs font-medium text-brand-600 mt-1">
                {errors.imageUrl.message}
              </p>
            )}

            {/* Live image preview */}
            {previewImageUrl && (
              <div className="mt-2 relative w-full h-40 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <img
                  src={previewImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur">
                  Image Preview
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-base font-bold shadow-md"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                กำลังบันทึกข้อมูล...
              </span>
            ) : (
              'บันทึกข้อมูลร้านอาหาร'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
