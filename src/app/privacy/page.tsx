"use client";

import LegalLayout, { type LegalDoc } from "@/components/shared/LegalLayout";
import siteData from "@/data/site.json";

export default function PrivacyPage() {
  const doc = siteData.legalPages.privacy as LegalDoc;
  return <LegalLayout doc={doc} />;
}
