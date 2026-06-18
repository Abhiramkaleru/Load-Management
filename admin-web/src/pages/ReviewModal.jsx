import React, { useEffect, useRef } from "react";
import { colors, radius, shadow } from "./Tokens";
import Button from "../components/Button";
import StatusBadge from "./Statusbadge";

export default function ReviewModal({
  request,
  actionType,
  isSubmitting,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);
  const confirmIsDanger = actionType === "reject";

  // Close on Escape, and move focus into the dialog when it opens so
  // keyboard users land somewhere sensible immediately.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !isSubmitting) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel, isSubmitting]);

  if (!request) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 9999,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        tabIndex={-1}
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "85vh",
          overflowY: "auto",
          background: colors.surface,
          borderRadius: radius.lg,
          boxShadow: shadow.modal,
          outline: "none",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <h2
              id="review-modal-title"
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: colors.textPrimary,
                margin: 0,
              }}
            >
              Review load request
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: colors.textMuted,
              }}
            >
              Request #{request.id}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div style={{ padding: "24px" }}>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              margin: 0,
              marginBottom: "20px",
            }}
          >
            <Field label="Salesman" value={request.salesman_name} />
            <Field label="Warehouse" value={request.warehouse_name} />
          </dl>

          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: colors.textSecondary,
              marginBottom: "8px",
            }}
          >
            Items ({request.lines?.length || 0})
          </div>

          {request.lines?.length ? (
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                overflow: "hidden",
              }}
            >
              {request.lines.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: colors.textPrimary,
                    borderTop:
                      index === 0 ? "none" : `1px solid ${colors.border}`,
                    background: index % 2 === 1 ? colors.bg : colors.surface,
                  }}
                >
                  <span>{item.sku_name || item.product_name || item.name}</span>
                  <span
                    style={{ color: colors.textSecondary, fontWeight: 600 }}
                  >
                    Qty {item.quantity ?? item.qty}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: colors.textMuted,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              No item details available for this request.
            </p>
          )}

          {confirmIsDanger && (
            <div
              role="alert"
              style={{
                marginTop: "20px",
                padding: "12px 14px",
                background: colors.dangerSoft,
                border: `1px solid ${colors.rejectedBg}`,
                borderRadius: radius.md,
                fontSize: "13px",
                color: colors.rejected,
              }}
            >
              Rejecting notifies the salesman and removes this request from the
              queue. This can't be undone.
            </div>
          )}
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant={confirmIsDanger ? "danger" : "success"}
            onClick={onConfirm}
            loading={isSubmitting}
          >
            {confirmIsDanger ? "Reject request" : "Approve request"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt
        style={{
          fontSize: "12px",
          color: colors.textMuted,
          marginBottom: "2px",
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: colors.textPrimary,
          margin: 0,
        }}
      >
        {value || "-"}
      </dd>
    </div>
  );
}
