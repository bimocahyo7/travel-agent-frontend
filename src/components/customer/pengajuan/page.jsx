import PengajuanPage from './PengajuanPage';
import { Badge } from '@/components/ui/badge';

export default function Page() {
  return <PengajuanPage />;
}

function Step({ active, label, rejected }) {
  return (
    <div className="flex items-center min-w-max">
      <span
        className={`rounded-full border-2 w-6 h-6 flex items-center justify-center transition-colors duration-200 ${
          rejected
            ? "border-red-500 bg-red-100"
            : active
            ? "border-green-500 bg-green-100"
            : "border-gray-300 bg-white"
        }`}
      >
        {rejected ? (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : active ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        )}
      </span>
      <span
        className={`ml-2 px-1 font-semibold text-sm min-w-[80px] text-center ${
          rejected
            ? "text-red-600"
            : active
            ? "text-green-600"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <span className="mx-1 text-gray-400 text-lg">
        {label !== "Ditolak" && label !== "Lunas" && "→"}
      </span>
    </div>
  );
}
