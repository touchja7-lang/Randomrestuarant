import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="mt-auto border-t border-zinc-200/80 bg-white py-8 text-zinc-500">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            🎲
          </div>
          <span className="text-sm font-semibold text-zinc-800">RandomEats</span>
        </div>
        <span className="hidden sm:inline text-zinc-300">•</span>
        <span className="text-xs text-zinc-500 max-w-sm">
          เครื่องมือสุ่มร้านอาหาร เพื่อมื้อที่ดีกว่าโดยไม่ต้องเถียงกัน
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium">
        <Link to="/random" className="hover:text-zinc-900 transition-colors">
          สุ่มร้านอาหาร
        </Link>
        <Link to="/restaurants" className="hover:text-zinc-900 transition-colors">
          ร้านทั้งหมด
        </Link>
        <Link to="/restaurants/new" className="hover:text-zinc-900 transition-colors">
          เพิ่มร้านอาหาร
        </Link>
        <span className="text-zinc-400">© {new Date().getFullYear()} RandomEats</span>
      </div>
    </div>
  </footer>
);
