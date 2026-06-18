import { useEffect, useState } from "react";
import { breakpoint } from "./Tokens";

// Tracks whether the viewport is at or below the mobile breakpoint.
// Used to switch the request list between a table (desktop) and
// stacked cards (mobile/tablet) without relying on CSS-only solutions,
// since the row content differs structurally between the two layouts.
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= breakpoint.mobile
      : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint.mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
