"use client";

import React, { memo, useMemo, useEffect } from "react";
import SearchModal from "./SearchModal";
import { useSearch } from "./SearchContext";
import { useSignup } from "../../context/SignupContext";
import { usePathname } from "next/navigation";

const KbarBlurWrapper = memo(function KbarBlurWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSearchOpen } = useSearch();
  const { showSignup } = useSignup();
  const pathname = usePathname() || "";

  // Check if signup should be visible based on pathname
  const isSignupVisible = !["/", "/login"].includes(pathname.toLowerCase());

  // Use useMemo to only recompute the className when dependencies change
  const blurClass = useMemo(
    () => (isSearchOpen ? "blur blur-[2px]" : ""),
    [isSearchOpen]
  );

  // Disable scrollability when signup is visible and active
  const shouldDisableScroll = isSignupVisible && showSignup;

  useEffect(() => {
    if (shouldDisableScroll) {
      document.body.style.overMonad = "hidden";
    } else {
      document.body.style.overMonad = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overMonad = "unset";
    };
  }, [shouldDisableScroll]);

  return (
    <div
      className={`${blurClass} ${
        shouldDisableScroll ? "overMonad-hidden h-screen" : ""
      }`}
    >
      {children}
    </div>
  );
});

export default KbarBlurWrapper;
