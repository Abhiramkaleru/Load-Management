// Design tokens for the Load Management module.
// Centralizing these avoids magic hex values scattered across components
// and keeps the approval queue visually consistent with the rest of NFPC.

export const colors = {
  // Brand / primary action
  primary: "#4F46E5",
  primaryHover: "#4338CA",
  primarySoft: "#EEF2FF",

  // Surfaces
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",

  // Text
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",

  // Status — the only place color is allowed to be loud
  pending: "#B45309",
  pendingBg: "#FEF3C7",
  approved: "#15803D",
  approvedBg: "#DCFCE7",
  rejected: "#B91C1C",
  rejectedBg: "#FEE2E2",

  // Destructive action
  danger: "#DC2626",
  dangerHover: "#B91C1C",
  dangerSoft: "#FEF2F2",

  // Success action
  success: "#16A34A",
  successHover: "#15803D",

  focusRing: "#4F46E5",
};

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
};

export const shadow = {
  card: "0 1px 2px rgba(15, 23, 42, 0.04)",
  modal: "0 20px 40px rgba(15, 23, 42, 0.18)",
  toast: "0 8px 24px rgba(15, 23, 42, 0.16)",
};

export const font = {
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

export const breakpoint = {
  mobile: 720,
};