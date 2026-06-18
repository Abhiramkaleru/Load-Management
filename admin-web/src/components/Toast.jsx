import React, { useEffect } from "react";
import { colors, radius, shadow } from "../pages/Tokens";

// Lightweight toast for confirming approve/reject actions or surfacing
// errors. Auto-dismisses so it never blocks the next action in a queue
// someone is processing quickly.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, toast.type === "error" ? 5000 : 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: isError ? colors.danger : colors.textPrimary,
        color: "#fff",
        padding: "12px 18px",
        borderRadius: radius.md,
        boxShadow: shadow.toast,
        fontSize: "14px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 10000,
        maxWidth: "90vw",
      }}
    >
      {toast.message}
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
