import Script from "next/script";
import { Suspense } from "react";
import GoogleAnalyticsPageView from "./GoogleAnalyticsPageView";

const GA_MEASUREMENT_ID = "G-ZJ349MZPTN";

/**
 * GA4 via gtag.js. Set NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in .env.local.
 * Page views are sent on first load and on client-side route changes.
 */
const Analytics = () => {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView gaId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
};

export default Analytics;
