import { useState, useEffect } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // auto hide after 3s
  };

  return { toast, showToast };
}

export default function Toast({ toast }) {
  if (!toast) return null;

  const colors = {
    success: { background: "#185FA5", icon: "✓" },
    error:   { background: "#e24b4a", icon: "✕" },
    info:    { background: "#534AB7", icon: "ℹ" },
  };

  const style = colors[toast.type] || colors.success;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      background: style.background,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 10,
      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      animation: "slideIn 0.2s ease",
    }}>
      <span style={{
        width: 22, height: 22,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      }}>
        {style.icon}
      </span>
      {toast.message}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}