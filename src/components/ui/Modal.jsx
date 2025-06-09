import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-transparent"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 m-6 max-w-sm w-full"
        style={{ pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}