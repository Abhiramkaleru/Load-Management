import React from "react";
import { colors, radius } from "../pages/Tokens";

const VARIANTS = {
  primary: {
    background: colors.primary,
    color: "#fff",
    border: "1px solid transparent",
    hoverBackground: colors.primaryHover,
  },
  success: {
    background: colors.success,
    color: "#fff",
    border: "1px solid transparent",
    hoverBackground: colors.successHover,
  },
  danger: {
    background: colors.danger,
    color: "#fff",
    border: "1px solid transparent",
    hoverBackground: colors.dangerHover,
  },
  secondary: {
    background: "#fff",
    color: colors.textPrimary,
    border: `1px solid ${colors.borderStrong}`,
    hoverBackground: "#F9FAFB",
  },
  ghost: {
    background: "transparent",
    color: colors.textSecondary,
    border: "1px solid transparent",
    hoverBackground: colors.bg,
  },
};

export default function Button({
  variant = "secondary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.secondary;
  const isDisabled = disabled || loading;

  const sizeStyles =
    size === "sm"
      ? { padding: "6px 12px", fontSize: "13px" }
      : { padding: "10px 16px", fontSize: "14px" };

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...sizeStyles,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: fullWidth ? "100%" : undefined,
        background: isDisabled
          ? colors.border
          : hover
          ? v.hoverBackground
          : v.background,
        color: isDisabled ? colors.textMuted : v.color,
        border: v.border,
        borderRadius: radius.sm,
        fontWeight: 600,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background 120ms ease",
        outline: "none",
        boxShadow: "none",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focusRing}33`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {loading ? (
        <>
          <Spinner size={14} color={v.color} />
          <span>Working…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Spinner({ size = 16, color = colors.textSecondary }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid currentColor`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        color,
        animation: "nfpc-spin 0.7s linear infinite",
      }}
    />
  );
}