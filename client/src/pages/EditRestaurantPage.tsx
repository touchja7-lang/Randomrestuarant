import { useNavigate, useParams, Link } from 'react-router-dom';
import { RestaurantForm } from '../components/RestaurantForm';
import { useRestaurant, useUpdateRestaurant } from '../hooks/useRestaurants';
import { RestaurantFormData } from '../validators';

export const EditRestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const updateMutation = useUpdateRestaurant(id!);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-28" />
        <div className="h-8 bg-zinc-200 rounded w-1/2" />
        <div className="h-96 bg-zinc-100 rounded-2xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="text-3xl">🔍</div>
        <h2 className="font-bold text-zinc-900">ไม่พบร้านอาหารที่ต้องการแก้ไข</h2>
        <Link to="/restaurants" className="btn-secondary text-xs">
          กลับหน้ารายชื่อร้าน
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: RestaurantFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      navigate(`/restaurants/${id}`);
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          to={`/restaurants/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <span>←</span> ยกเลิก และกลับหน้าร้าน
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
          Edit Restaurant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
          แก้ไขข้อมูล: {restaurant.name}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          ปรับปรุงข้อมูลร้านอาหาร เมนูเด็ด หรือพิกัดที่ตั้ง
        </p>
      </div>

      {/* Form Card */}
      <div className="card-surface p-6 sm:p-8 border border-zinc-200/90 shadow-card">
        <RestaurantForm
          defaultValues={restaurant}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
};
