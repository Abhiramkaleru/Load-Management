import React from "react";
import { colors, radius, shadow } from "./Tokens";
import StatusBadge from "./Statusbadge";
import Button from "../components/Button";
import useIsMobile from "./Useismobile";

export default function RequestList({ requests, onReview, busyId }) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <CardList requests={requests} onReview={onReview} busyId={busyId} />
  ) : (
    <RequestTable requests={requests} onReview={onReview} busyId={busyId} />
  );
}

function RequestTable({ requests, onReview, busyId }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.card,
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: colors.bg }}>
            <Th>Salesman</Th>
            <Th>Warehouse</Th>
            <Th>Items</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <tr
              key={req.id}
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
              }}
            >
              <Td>
                <span style={{ fontWeight: 600, color: colors.textPrimary }}>
                  {req.salesman_name}
                </span>
              </Td>
              <Td>{req.warehouse_name}</Td>
              <Td>{req.lines?.length || 0} items</Td>
              <Td>
                <StatusBadge status={req.status} />
              </Td>
              <Td align="right">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <Button
                    size="sm"
                    variant="success"
                    disabled={busyId === req.id}
                    onClick={() => onReview(req, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyId === req.id}
                    onClick={() => onReview(req, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardList({ requests, onReview, busyId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            boxShadow: shadow.card,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: colors.textPrimary,
                  fontSize: "15px",
                }}
              >
                {req.salesman_name}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: colors.textSecondary,
                  marginTop: "2px",
                }}
              >
                {req.warehouse_name}
              </div>
            </div>
            <StatusBadge status={req.status} />
          </div>

          <div
            style={{
              fontSize: "13px",
              color: colors.textMuted,
              marginBottom: "14px",
            }}
          >
            {req.lines?.length || 0} items requested
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              fullWidth
              variant="success"
              disabled={busyId === req.id}
              onClick={() => onReview(req, "approve")}
            >
              Approve
            </Button>
            <Button
              fullWidth
              variant="danger"
              disabled={busyId === req.id}
              onClick={() => onReview(req, "reject")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        padding: "12px 16px",
        textAlign: align,
        fontSize: "12px",
        fontWeight: 600,
        color: colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      style={{
        padding: "14px 16px",
        textAlign: align,
        fontSize: "14px",
        color: colors.textPrimary,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}
