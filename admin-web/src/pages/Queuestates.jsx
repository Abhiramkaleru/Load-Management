import React from "react";
import { colors, radius, shadow } from "./Tokens";

export function QueueSkeleton() {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.card,
        overflow: "hidden",
      }}
      aria-busy="true"
      aria-label="Loading approval queue"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px",
            borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
          }}
        >
          <SkeletonBlock width="22%" />
          <SkeletonBlock width="18%" />
          <SkeletonBlock width="12%" />
          <SkeletonBlock width="14%" height="22px" radius="999px" />
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <SkeletonBlock width="72px" height="32px" />
            <SkeletonBlock width="72px" height="32px" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonBlock({ width, height = "14px", radius: r = "4px" }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: r,
        background:
          "linear-gradient(90deg, #EEF0F3 25%, #F5F6F8 37%, #EEF0F3 63%)",
        backgroundSize: "400% 100%",
        animation: "nfpc-shimmer 1.4s ease infinite",
      }}
    />
  );
}

export function EmptyQueue() {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px dashed ${colors.borderStrong}`,
        borderRadius: radius.lg,
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "48px",
          height: "48px",
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: colors.primarySoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        ✓
      </div>
      <h3
        style={{
          margin: "0 0 6px",
          fontSize: "16px",
          color: colors.textPrimary,
        }}
      >
        Queue is clear
      </h3>
      <p style={{ margin: 0, fontSize: "14px", color: colors.textMuted }}>
        No load requests are waiting on a decision right now.
      </p>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.rejectedBg}`,
        borderRadius: radius.lg,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          margin: "0 0 6px",
          fontSize: "16px",
          color: colors.textPrimary,
        }}
      >
        Couldn't load the approval queue
      </h3>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: "14px",
          color: colors.textMuted,
        }}
      >
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        style={{
          background: colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: radius.sm,
          padding: "10px 18px",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}
