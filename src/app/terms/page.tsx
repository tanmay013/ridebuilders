"use client";

import LegalLayout, { type LegalDoc } from "@/components/shared/LegalLayout";
import siteData from "@/data/site.json";

export default function TermsPage() {
  const doc = siteData.legalPages.terms as LegalDoc;
  return <LegalLayout doc={doc} />;
}
