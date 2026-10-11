import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isError = toastMessage.type === "error";
  const isInfo = toastMessage.type === "info";

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-xl animate-slide-up transition-all"
      style={{
        backgroundColor: isError
          ? "rgba(239, 68, 68, 0.95)"
          : isInfo
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(16, 185, 129, 0.95)",
        borderColor: isError
          ? "rgba(248, 113, 113, 0.4)"
          : isInfo
          ? "rgba(148, 163, 184, 0.3)"
          : "rgba(52, 211, 153, 0.4)",
        color: "#ffffff",
      }}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 shrink-0" />
      ) : isInfo ? (
        <Info className="w-5 h-5 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      )}
      <span className="text-sm font-semibold tracking-wide">
        {toastMessage.message}
      </span>
    </div>
  );
};
