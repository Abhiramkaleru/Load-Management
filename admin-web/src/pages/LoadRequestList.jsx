import React, { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { colors, font } from "./Tokens";
import { QueueSkeleton, EmptyQueue, ErrorState } from "./Queuestates";

const STATUS_TABS = ["Pending", "Approved", "Rejected"];
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function LoadRequestList({ onOpenRequest, setToast }) {
  const api = useApi();

  const [statusFilter, setStatusFilter] = useState("Pending");
  const [counts, setCounts] = useState({ Pending: 0, Approved: 0, Rejected: 0 });
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [pageInput, setPageInput] = useState("1");

  const fetchCounts = useCallback(async () => {
    try {
      const res = await api.get("/approval/counts");
      setCounts(res || { Pending: 0, Approved: 0, Rejected: 0 });
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  }, [api]);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get(
        `/approval?status=${statusFilter}&page=${page}&limit=${pageSize}`
      );
      setRequests(res?.data || []);
      setPagination(res?.pagination || { page: 1, totalPages: 1, totalCount: 0 });
      setStatus("ready");
    } catch (err) {
      console.error("Failed to fetch queue:", err);
      setStatus("error");
    }
  }, [api, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, pageSize]);

  useEffect(() => {
    setPageInput(String(pagination.page));
  }, [pagination.page]);

  const rangeStart = pagination.totalCount === 0 ? 0 : (pagination.page - 1) * pageSize + 1;
  const rangeEnd = Math.min(pagination.page * pageSize, pagination.totalCount);

  const goToPage = (p) => {
    const clamped = Math.min(Math.max(p, 1), pagination.totalPages);
    setPage(clamped);
  };

  return (
    <div>
      <header style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "4px" }}>
          Dashboard &nbsp;»&nbsp; Transactions &nbsp;»&nbsp; Load Requests
        </div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: colors.textPrimary }}>
          Load Requests
        </h1>
      </header>

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
            display: "flex",
            borderBottom: `1px solid ${colors.border}`,
            padding: "0 16px",
          }}
        >
          {STATUS_TABS.map((tab) => {
            const isActive = tab === statusFilter;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "14px 16px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? colors.primary : colors.textSecondary,
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${colors.primary}` : "2px solid transparent",
                  cursor: "pointer",
                  marginBottom: "-1px",
                }}
              >
                {tab}
                {counts[tab] > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isActive ? colors.primary : colors.textMuted,
                      background: colors.primarySoft,
                      borderRadius: "999px",
                      padding: "1px 7px",
                    }}
                  >
                    {counts[tab]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {status === "loading" && (
          <div style={{ padding: "32px" }}>
            <QueueSkeleton />
          </div>
        )}
        {status === "error" && (
          <div style={{ padding: "32px" }}>
            <ErrorState onRetry={fetchList} />
          </div>
        )}
        {status === "ready" && requests.length === 0 && (
          <div style={{ padding: "32px" }}>
            <EmptyQueue />
          </div>
        )}

        {status === "ready" && requests.length > 0 && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: colors.bg }}>
                    {[
                      "Movement Code",
                      "Employee",
                      "Warehouse",
                      "Date",
                    ].map((col) => (
                      <th
                        key={col}
                        style={{
                          textAlign: "left",
                          padding: "10px 16px",
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
                  {requests.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => onOpenRequest(r.id)}
                      style={{ borderTop: `1px solid ${colors.border}`, cursor: "pointer" }}
                    >
                      <td style={{ padding: "12px 16px", color: colors.primary, fontWeight: 600 }}>
                        {r.movement_code}
                      </td>
                      <td style={{ padding: "12px 16px", color: colors.textPrimary }}>
                        {r.employee_name}
                      </td>
                      <td style={{ padding: "12px 16px", color: colors.textSecondary }}>
                        {r.warehouse_name}
                      </td>
                      <td style={{ padding: "12px 16px", color: colors.textSecondary, whiteSpace: "nowrap" }}>
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderTop: `1px solid ${colors.border}`,
                fontSize: "13px",
                color: colors.textSecondary,
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                Showing {rangeStart} to {rangeEnd} of {pagination.totalCount} load requests
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <PageBtn label="«" disabled={pagination.page <= 1} onClick={() => goToPage(1)} />
                <PageBtn label="‹" disabled={pagination.page <= 1} onClick={() => goToPage(pagination.page - 1)} />
                <input
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => goToPage(parseInt(pageInput, 10) || 1)}
                  onKeyDown={(e) => e.key === "Enter" && goToPage(parseInt(pageInput, 10) || 1)}
                  style={{
                    width: "40px",
                    textAlign: "center",
                    padding: "6px 4px",
                    borderRadius: "6px",
                    border: `1px solid ${colors.border}`,
                  }}
                />
                <span>of {pagination.totalPages}</span>
                <PageBtn
                  label="›"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                />
                <PageBtn
                  label="»"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => goToPage(pagination.totalPages)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${colors.border}`,
                    background: colors.surface,
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>per page</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PageBtn({ label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontSize: "13px",
      }}
    >
      {label}
    </button>
  );
}