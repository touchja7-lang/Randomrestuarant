import { ButtonHTMLAttributes } from 'react';

interface SpinButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSpinning?: boolean;
}

export const SpinButton = ({ isSpinning, disabled, children, ...props }: SpinButtonProps) => (
  <div className="flex flex-col items-center gap-2">
    <button
      {...props}
      disabled={disabled || isSpinning}
      className={`
        relative w-full max-w-sm flex items-center justify-center gap-3.5
        font-bold text-lg sm:text-xl py-4 sm:py-5 px-8 rounded-2xl
        transition-all duration-200 select-none overflow-hidden
        border border-brand-500/50
        ${
          isSpinning
            ? 'bg-brand-500 text-white cursor-wait animate-pulse shadow-md'
            : 'bg-gradient-to-b from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-glow-brand hover:shadow-lg active:translate-y-0.5 active:scale-[0.99] cursor-pointer'
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
      `}
    >
      {/* Top specular highlight line for high-craft tactile feel */}
      <span className="absolute inset-x-0 top-0 h-px bg-white/30" />

      {/* Rotating Dice or Sparkle Icon */}
      <span
        className={`text-2xl sm:text-3xl transition-transform duration-300 ${
          isSpinning ? 'animate-spin-fast' : 'group-hover:scale-110'
        }`}
      >
        🎲
      </span>

      <span className="tracking-tight">
        {isSpinning ? 'กำลังสุ่มร้าน...' : children ?? 'สุ่มร้านเลย! (Spin)'}
      </span>

      {!isSpinning && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white/90">
          Click
        </span>
      )}
    </button>
  </div>
);
