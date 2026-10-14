import { useNavigate, Link } from 'react-router-dom';
import { RestaurantForm } from '../components/RestaurantForm';
import { useCreateRestaurant } from '../hooks/useRestaurants';
import { RestaurantFormData } from '../validators';

export const NewRestaurantPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateRestaurant();

  const handleSubmit = async (data: RestaurantFormData) => {
    try {
      const restaurant = await createMutation.mutateAsync(data);
      navigate(`/restaurants/${restaurant._id}`);
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'ไม่สามารถสร้างร้านอาหารได้ กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <span>←</span> ยกเลิก และกลับหน้ารายชื่อร้าน
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
          Add New Restaurant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
          เพิ่มร้านอาหารใหม่
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          กรอกรายละเอียดร้านอาหารเพื่อให้ระบบสามารถนำไปสุ่มในครั้งถัดไปได้
        </p>
      </div>

      {/* Form Card */}
      <div className="card-surface p-6 sm:p-8 border border-zinc-200/90 shadow-card">
        <RestaurantForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
      </div>
    </div>
  );
};
