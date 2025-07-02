import React from "react";
export default function Step({ active, label, rejected, disabled }) {
  return (
    <div className="flex items-center space-x-2">
      <span
        className={`rounded-full border-2 w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
          disabled
            ? "border-gray-300 bg-gray-100"
            : active
            ? rejected
              ? "border-red-500 bg-red-100"
              : "border-green-500 bg-green-100"
            : "border-gray-300 bg-white"
        }`}
      >
        {disabled ? (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : active ? (
          rejected ? (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )
        ) : (
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        )}
      </span>
      <span className={`font-semibold ${
        disabled
          ? "text-gray-400 line-through"
          : active
          ? rejected
            ? "text-red-600"
            : "text-green-600"
          : "text-gray-500"
      }`}>{label}</span>
    </div>
  );
} 