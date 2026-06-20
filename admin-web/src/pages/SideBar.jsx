// import React, { useState } from "react";
// import {
//   Home,
//   ShoppingCart,
//   Boxes,
//   Truck,
//   Wallet,
//   ShieldCheck,
//   BarChart3,
//   Repeat,
//   ChevronRight,
//   ChevronDown,
//   CreditCard,
//   Inbox,
//   RotateCcw,
//   CalendarClock,
//   PackageSearch,
//   ArrowLeftRight,
//   ClipboardList,
//   PackageOpen,
//   ClipboardCheck,
//   Pencil,
//   TrendingUp,
// } from "lucide-react";
// import { colors, font } from "./Tokens";

// const DASHBOARD_ITEM = { label: "Dashboard", icon: Home, key: "dashboard" };

// const MODULES = [
//   { label: "Products & Sales", icon: ShoppingCart },
//   { label: "Inventory & Stock", icon: Boxes },
//   { label: "Distribution & Delivery", icon: Truck },
//   { label: "Finance & Accounts", icon: Wallet },
//   { label: "Administration", icon: ShieldCheck },
//   { label: "Reports & Analytics", icon: BarChart3 },
// ];

// const TRANSACTIONS_ITEM = {
//   label: "Transactions",
//   icon: Repeat,
//   children: [
//     { label: "Payment Management", icon: CreditCard },
//     { label: "Collection", icon: Inbox },
//     { label: "Return Order", icon: RotateCcw },
//     { label: "Expiry Check", icon: CalendarClock },
//     {
//       label: "Load Management",
//       icon: PackageSearch,
//       children: [
//         { label: "Van Transfer", icon: ArrowLeftRight },
//         { label: "Load Request", icon: ClipboardList, key: "load-request" },
//         { label: "Unload Request", icon: PackageOpen },
//         { label: "Stock Audit", icon: ClipboardCheck },
//         { label: "Manual Stock Update", icon: Pencil },
//       ],
//     },
//   ],
// };

// const SALES_ITEM = { label: "Sales", icon: TrendingUp, children: [] };

// export default function Sidebar({ activeKey = "load-request", onNavigate = () => {} }) {
//   const [expanded, setExpanded] = useState(new Set(["Transactions", "Load Management"]));

//   const toggle = (label) => {
//     setExpanded((prev) => {
//       const next = new Set(prev);
//       if (next.has(label)) {
//         next.delete(label);
//       } else {
//         next.add(label);
//       }
//       return next;
//     });
//   };

//   return (
//     <nav
//       aria-label="Main navigation"
//       style={{
//         width: "260px",
//         flexShrink: 0,
//         background: colors.surface,
//         borderRight: `1px solid ${colors.border}`,
//         padding: "24px 16px",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: font.body,
//       }}
//     >
//       <div
//         style={{
//           color: colors.primary,
//           fontWeight: 800,
//           fontSize: "20px",
//           letterSpacing: "0.02em",
//           padding: "0 8px",
//           marginBottom: "28px",
//         }}
//       >
//         nfpc
//       </div>

//       <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, overflowY: "auto" }}>
//         <NavRow
//           item={DASHBOARD_ITEM}
//           depth={0}
//           activeKey={activeKey}
//           expanded={expanded}
//           toggle={toggle}
//           onNavigate={onNavigate}
//         />

//         <SectionLabel>Modules</SectionLabel>
//         {MODULES.map((item) => (
//           <NavRow
//             key={item.label}
//             item={item}
//             depth={0}
//             activeKey={activeKey}
//             expanded={expanded}
//             toggle={toggle}
//             onNavigate={onNavigate}
//           />
//         ))}

//         <NavRow
//           item={TRANSACTIONS_ITEM}
//           depth={0}
//           activeKey={activeKey}
//           expanded={expanded}
//           toggle={toggle}
//           onNavigate={onNavigate}
//         />
//         <NavRow
//           item={SALES_ITEM}
//           depth={0}
//           activeKey={activeKey}
//           expanded={expanded}
//           toggle={toggle}
//           onNavigate={onNavigate}
//         />
//       </ul>

//       <div
//         style={{
//           width: "36px",
//           height: "36px",
//           borderRadius: "50%",
//           background: "#1a1a1a",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontWeight: 700,
//           fontSize: "14px",
//           marginTop: "12px",
//         }}
//       >
//         N
//       </div>
//     </nav>
//   );
// }

// function SectionLabel({ children }) {
//   return (
//     <li
//       style={{
//         fontSize: "11px",
//         fontWeight: 700,
//         color: colors.textMuted,
//         textTransform: "uppercase",
//         letterSpacing: "0.06em",
//         padding: "16px 12px 8px",
//         listStyle: "none",
//       }}
//     >
//       {children}
//     </li>
//   );
// }

// function NavRow({ item, depth, activeKey, expanded, toggle, onNavigate }) {
//   const [hover, setHover] = useState(false);
//   const hasChildren = Array.isArray(item.children) && item.children.length > 0;
//   const isOpen = expanded.has(item.label);
//   const isActive = item.key && item.key === activeKey;
//   const Icon = item.icon;

//   const handleClick = () => {
//     if (hasChildren) {
//       toggle(item.label);
//     } else {
//       onNavigate(item.key || item.label);
//     }
//   };

//   return (
//     <>
//       <li
//         tabIndex={0}
//         role="button"
//         onClick={handleClick}
//         onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
//         onMouseEnter={() => setHover(true)}
//         onMouseLeave={() => setHover(false)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//           padding: "9px 12px",
//           paddingLeft: `${12 + depth * 16}px`,
//           marginBottom: "2px",
//           borderRadius: "6px",
//           fontSize: "14px",
//           fontWeight: isActive ? 600 : 500,
//           color: isActive ? colors.primary : colors.textSecondary,
//           background: isActive ? colors.primarySoft : hover ? colors.bg : "transparent",
//           cursor: "pointer",
//           outline: "none",
//           listStyle: "none",
//         }}
//       >
//         {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
//         <span
//           style={{
//             flex: 1,
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {item.label}
//         </span>
//         {hasChildren &&
//           (isOpen ? (
//             <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
//           ) : (
//             <ChevronRight size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
//           ))}
//       </li>

//       {hasChildren && isOpen && (
//         <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//           {item.children.map((child) => (
//             <NavRow
//               key={child.label}
//               item={child}
//               depth={depth + 1}
//               activeKey={activeKey}
//               expanded={expanded}
//               toggle={toggle}
//               onNavigate={onNavigate}
//             />
//           ))}
//         </ul>
//       )}
//     </>
//   );
// }

import React, { useState } from "react";
import {
  Home,
  ShoppingCart,
  Boxes,
  Truck,
  Wallet,
  ShieldCheck,
  BarChart3,
  Repeat,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Inbox,
  RotateCcw,
  CalendarClock,
  PackageSearch,
  ArrowLeftRight,
  ClipboardList,
  PackageOpen,
  ClipboardCheck,
  Pencil,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { colors, font } from "./Tokens";

const DASHBOARD_ITEM = { label: "Dashboard", icon: Home, key: "dashboard" };

const MODULES = [
  { label: "Products & Sales", icon: ShoppingCart },
  { label: "Inventory & Stock", icon: Boxes },
  { label: "Distribution & Delivery", icon: Truck },
  { label: "Finance & Accounts", icon: Wallet },
  { label: "Administration", icon: ShieldCheck },
  { label: "Reports & Analytics", icon: BarChart3 },
];

const TRANSACTIONS_ITEM = {
  label: "Transactions",
  icon: Repeat,
  children: [
    { label: "Payment Management", icon: CreditCard },
    { label: "Collection", icon: Inbox },
    { label: "Return Order", icon: RotateCcw },
    { label: "Expiry Check", icon: CalendarClock },
    {
      label: "Load Management",
      icon: PackageSearch,
      children: [
        { label: "Van Transfer", icon: ArrowLeftRight },
        { label: "Load Request", icon: ClipboardList, key: "load-request" },
        { label: "Unload Request", icon: PackageOpen },
        { label: "Stock Audit", icon: ClipboardCheck },
        { label: "Manual Stock Update", icon: Pencil },
      ],
    },
  ],
};

const SALES_ITEM = {
  label: "Sales",
  icon: TrendingUp,
  children: [],
};

export default function Sidebar({
  activeKey = "load-request",
  onNavigate = () => {},
  onLogout = () => {},
}) {
  const [expanded, setExpanded] = useState(
    new Set(["Transactions", "Load Management"]),
  );

  const toggle = (label) => {
    setExpanded((prev) => {
      const next = new Set(prev);

      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }

      return next;
    });
  };

  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: "260px",
        flexShrink: 0,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        fontFamily: font.body,
        height: "100vh",
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
        nfpc
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flex: 1,
          overflowY: "auto",
        }}
      >
        <NavRow
          item={DASHBOARD_ITEM}
          depth={0}
          activeKey={activeKey}
          expanded={expanded}
          toggle={toggle}
          onNavigate={onNavigate}
        />

        <SectionLabel>Modules</SectionLabel>

        {MODULES.map((item) => (
          <NavRow
            key={item.label}
            item={item}
            depth={0}
            activeKey={activeKey}
            expanded={expanded}
            toggle={toggle}
            onNavigate={onNavigate}
          />
        ))}

        <NavRow
          item={TRANSACTIONS_ITEM}
          depth={0}
          activeKey={activeKey}
          expanded={expanded}
          toggle={toggle}
          onNavigate={onNavigate}
        />

        <NavRow
          item={SALES_ITEM}
          depth={0}
          activeKey={activeKey}
          expanded={expanded}
          toggle={toggle}
          onNavigate={onNavigate}
        />
      </ul>

      {/* Logout Section */}
      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          paddingTop: "12px",
          marginTop: "12px",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            border: "none",
            borderRadius: "6px",
            background: "transparent",
            color: "#dc2626",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          Logout
        </button>

        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#1a1a1a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "14px",
            marginTop: "12px",
          }}
        >
          N
        </div>
      </div>
    </nav>
  );
}

function SectionLabel({ children }) {
  return (
    <li
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "16px 12px 8px",
        listStyle: "none",
      }}
    >
      {children}
    </li>
  );
}

function NavRow({ item, depth, activeKey, expanded, toggle, onNavigate }) {
  const [hover, setHover] = useState(false);

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const isOpen = expanded.has(item.label);
  const isActive = item.key && item.key === activeKey;
  const Icon = item.icon;

  const handleClick = () => {
    if (hasChildren) {
      toggle(item.label);
    } else {
      onNavigate(item.key || item.label);
    }
  };

  return (
    <>
      <li
        tabIndex={0}
        role="button"
        onClick={handleClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 12px",
          paddingLeft: `${12 + depth * 16}px`,
          marginBottom: "2px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: isActive ? 600 : 500,
          color: isActive ? colors.primary : colors.textSecondary,
          background: isActive
            ? colors.primarySoft
            : hover
              ? colors.bg
              : "transparent",
          cursor: "pointer",
          outline: "none",
          listStyle: "none",
        }}
      >
        {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}

        <span
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.label}
        </span>

        {hasChildren &&
          (isOpen ? (
            <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          ) : (
            <ChevronRight size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          ))}
      </li>

      {hasChildren && isOpen && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {item.children.map((child) => (
            <NavRow
              key={child.label}
              item={child}
              depth={depth + 1}
              activeKey={activeKey}
              expanded={expanded}
              toggle={toggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </>
  );
}
