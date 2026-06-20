import React, { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { colors, font } from "./Tokens";

export default function LoadRequestDetail({ requestId, onBack, setToast }) {
  const api = useApi();

  const [data, setData] = useState(null);
  const [lineQty, setLineQty] = useState({});
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get(`/approval/${requestId}`);
      setData(res);
      const initialQty = {};
      (res.lines || []).forEach((l) => {
        initialQty[l.id] = l.approved_qty;
      });
      setLineQty(initialQty);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to fetch request detail:", err);
      setStatus("error");
    }
  }, [api, requestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleQtyChange = (lineId, value) => {
    const num = value === "" ? "" : Number(value);
    setLineQty((prev) => ({ ...prev, [lineId]: num }));
  };

  const handleConfirm = async () => {
    const lines = Object.entries(lineQty).map(([id, approved_qty]) => ({
      id,
      approved_qty: Number(approved_qty) || 0,
    }));

    setSubmitting(true);
    try {
      await api.post(`/approval/${requestId}/approve`, { lines });
      setToast({ type: "success", message: `Approved ${data.movement_code}.` });
      onBack();
    } catch (err) {
      console.error("Approve failed:", err);
      setToast({
        type: "error",
        message: "Couldn't approve this request. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await api.post(`/approval/${requestId}/reject`);
      setToast({ type: "success", message: `Rejected ${data.movement_code}.` });
      onBack();
    } catch (err) {
      console.error("Reject failed:", err);
      setToast({
        type: "error",
        message: "Couldn't reject this request. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ padding: "32px", color: colors.textMuted }}>
        Loading request…
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div style={{ padding: "32px" }}>
        <p style={{ color: colors.textMuted, marginBottom: "12px" }}>
          Couldn't load this request.
        </p>
        <button onClick={fetchDetail} style={secondaryBtnStyle}>
          Retry
        </button>
      </div>
    );
  }

  const canEdit = data.status === "Pending";

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              color: colors.textMuted,
              marginBottom: "4px",
            }}
          >
            Transactions &nbsp;»&nbsp; Load Requests &nbsp;»&nbsp; Load Request
            Details
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            Load Request Details
          </h1>
        </div>
        <button onClick={onBack} style={secondaryBtnStyle}>
          Back
        </button>
      </header>

      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "14px",
            color: colors.textPrimary,
          }}
        >
          Movement Details
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 32px",
            fontSize: "13px",
          }}
        >
          <Field label="Movement Code" value={data.movement_code} />
          <Field label="Warehouse" value={data.warehouse_name} />
          <Field label="Employee" value={data.employee_name} />
          <Field label="Status" value={data.status} />
          <Field
            label="Request Created"
            value={new Date(data.created_at).toLocaleString()}
          />
          <Field
            label="Last Modified"
            value={
              data.server_modified_time
                ? new Date(data.server_modified_time).toLocaleString()
                : "—"
            }
          />
          <Field label="Movement Type" value="Load" />
        </div>
      </div>

      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            padding: "16px 20px",
            color: colors.textPrimary,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          Load Request Details
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: colors.bg }}>
                {[
                  "Product Code",
                  "Product Name",
                  "UOM",
                  "Req. Qty",
                  "Sup. Approved Qty",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "10px 20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: colors.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.lines || []).map((line) => (
                <tr
                  key={line.id}
                  style={{ borderTop: `1px solid ${colors.border}` }}
                >
                  <td style={{ padding: "12px 20px" }}>{line.sku_code}</td>
                  <td style={{ padding: "12px 20px" }}>{line.sku_name}</td>
                  <td style={{ padding: "12px 20px" }}>{line.uom}</td>
                  <td style={{ padding: "12px 20px" }}>{line.requested_qty}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <input
                      type="number"
                      min="0"
                      disabled={!canEdit}
                      value={lineQty[line.id] ?? ""}
                      onChange={(e) => handleQtyChange(line.id, e.target.value)}
                      style={{
                        width: "90px",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: `1px solid ${colors.border}`,
                        background: canEdit ? colors.surface : colors.bg,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canEdit && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              padding: "20px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <button
              onClick={handleConfirm}
              disabled={submitting}
              style={primaryBtnStyle}
            >
              {submitting ? "Confirming…" : "Confirm"}
            </button>
            <button
              onClick={handleReject}
              disabled={submitting}
              style={dangerBtnStyle}
            >
              Reject
            </button>
            <button
              onClick={onBack}
              disabled={submitting}
              style={secondaryBtnStyle}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ color: colors.textMuted, marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ color: colors.textPrimary, fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}

const primaryBtnStyle = {
  padding: "9px 20px",
  borderRadius: "8px",
  border: "none",
  background: colors.primary,
  color: "#fff",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
};

const dangerBtnStyle = {
  ...primaryBtnStyle,
  background: "#e5484d",
};

const secondaryBtnStyle = {
  padding: "9px 18px",
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  background: colors.surface,
  color: colors.textPrimary,
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
};
