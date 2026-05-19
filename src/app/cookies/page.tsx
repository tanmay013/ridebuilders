"use client";

import LegalLayout, { type LegalDoc } from "@/components/shared/LegalLayout";
import siteData from "@/data/site.json";

export default function CookiesPage() {
  const doc = siteData.legalPages.cookies as LegalDoc;
  return <LegalLayout doc={doc} />;
}
