import React from "react";
import { colors } from "./Tokens";

const STATUS_STYLES = {
  pending: { bg: colors.pendingBg, fg: colors.pending, label: "Pending" },
  approved: { bg: colors.approvedBg, fg: colors.approved, label: "Approved" },
  rejected: { bg: colors.rejectedBg, fg: colors.rejected, label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const style = STATUS_STYLES[key] || {
    bg: colors.border,
    fg: colors.textSecondary,
    label: status || "Unknown",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: style.bg,
        color: style.fg,
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: style.fg,
        }}
      />
      {style.label}
    </span>
  );
}