"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type GoogleAnalyticsPageViewProps = {
  gaId: string;
};

const GoogleAnalyticsPageView = ({ gaId }: GoogleAnalyticsPageViewProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    const page_path = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", gaId, { page_path });
  }, [pathname, searchParams, gaId]);

  return null;
};

export default GoogleAnalyticsPageView;
