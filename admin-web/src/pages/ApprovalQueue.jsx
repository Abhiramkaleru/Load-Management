import React, { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { colors, font } from "./Tokens";
import RequestList from "./RequestList";
import ReviewModal from "./ReviewModal";
import Toast from "../components/Toast";
import { QueueSkeleton, EmptyQueue, ErrorState } from "./Queuestates";
import useIsMobile from "./Useismobile";

const NAV_ITEMS = [
  "Dashboard",
  "Products & Sales",
  "Inventory & Stock",
  "Distribution & Delivery",
  "Finance & Accounts",
  "Administration",
];

export default function ApprovalQueue() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const api = useApi();

  const fetchQueue = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await api.get("/approval/queue");
      setRequests(data || []);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to fetch queue:", err);
      setStatus("error");
    }
  }, [api]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const openReview = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
  };

  const closeReview = () => {
    if (isSubmitting) return;
    setSelectedRequest(null);
    setActionType("");
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;
    const { id, salesman_name } = selectedRequest;

    setIsSubmitting(true);
    setBusyId(id);
    try {
      if (actionType === "approve") {
        await api.post(`/approval/${id}/approve`);
        setToast({
          type: "success",
          message: `Approved request from ${salesman_name}.`,
        });
      } else {
        await api.post(`/approval/${id}/reject`);
        setToast({
          type: "success",
          message: `Rejected request from ${salesman_name}.`,
        });
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSelectedRequest(null);
      setActionType("");
    } catch (err) {
      console.error(`${actionType} failed:`, err);
      setToast({
        type: "error",
        message: `Couldn't ${actionType} this request. Try again.`,
      });
    } finally {
      setIsSubmitting(false);
      setBusyId(null);
    }
  };

  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: font.body,
      }}
    >
      <style>{`
        @keyframes nfpc-spin { to { transform: rotate(360deg); } }
        @keyframes nfpc-shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; }
        }
      `}</style>

      {!isMobile && <Sidebar />}

      <main
        style={{
          flex: 1,
          padding: isMobile ? "20px 16px" : "32px",
          minWidth: 0,
        }}
      >
        <header style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            Load request approvals
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "14px",
              color: colors.textMuted,
            }}
          >
            {status === "ready" && requests.length > 0
              ? `${requests.length} request${requests.length === 1 ? "" : "s"} waiting for review`
              : "Review and action pending load requests from your sales team"}
          </p>
        </header>

        {status === "loading" && <QueueSkeleton />}
        {status === "error" && <ErrorState onRetry={fetchQueue} />}
        {status === "ready" && requests.length === 0 && <EmptyQueue />}
        {status === "ready" && requests.length > 0 && (
          <RequestList
            requests={requests}
            onReview={openReview}
            busyId={busyId}
          />
        )}
      </main>

      <ReviewModal
        request={selectedRequest}
        actionType={actionType}
        isSubmitting={isSubmitting}
        onCancel={closeReview}
        onConfirm={handleConfirm}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: "260px",
        flexShrink: 0,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          color: colors.primary,
          fontWeight: 800,
          fontSize: "20px",
          letterSpacing: "0.02em",
          padding: "0 8px",
          marginBottom: "28px",
        }}
      >
        NFPC
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item}>{item}</NavItem>
        ))}

        <li
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "16px 12px 8px",
          }}
        >
          Load Management
        </li>

        <NavItem active>Approval Queue</NavItem>
      </ul>
    </nav>
  );
}

function NavItem({ children, active }) {
  const [hover, setHover] = React.useState(false);
  return (
    <li
      tabIndex={0}
      role="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px 12px",
        marginBottom: "2px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: active ? 600 : 500,
        color: active ? colors.primary : colors.textSecondary,
        background: active
          ? colors.primarySoft
          : hover
            ? colors.bg
            : "transparent",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {children}
    </li>
  );
}
