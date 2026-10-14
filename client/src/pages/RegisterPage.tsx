import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../validators';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    try {
      const { token, user } = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(token, user);
      navigate('/random');
    } catch (err: unknown) {
      setServerError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'การสมัครสมาชิกล้มเหลว กรุณาตรวจสอบข้อมูลหรือลองใช้อีเมลอื่น'
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl mx-auto shadow-sm">
            🎲
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            สร้างบัญชีผู้ใช้
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            ลงทะเบียนเพื่อบันทึกประวัติการสุ่มร้านอาหาร และร่วมสร้างรายชื่อร้านโปรด
          </p>
        </div>

        <div className="card-surface p-6 sm:p-8 shadow-card border border-zinc-200/90 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-base">ชื่อของคุณ (Name)</label>
              <input
                {...register('name')}
                className="input-base"
                placeholder="เช่น บอย, ตะวัน, Jane Doe"
              />
              {errors.name && (
                <p className="text-xs font-medium text-brand-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label-base">อีเมล (Email)</label>
              <input
                {...register('email')}
                type="email"
                className="input-base"
                placeholder="name@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs font-medium text-brand-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-base mb-0">รหัสผ่าน (Password)</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-medium text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? 'ซ่อน' : 'แสดง'}
                </button>
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input-base"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-xs font-medium text-brand-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-base">ยืนยันรหัสผ่าน (Confirm Password)</label>
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                className="input-base"
                placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-brand-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 text-center">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm font-bold shadow-sm"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  กำลังลงทะเบียน...
                </span>
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
};
