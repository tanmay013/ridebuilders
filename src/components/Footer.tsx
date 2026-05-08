import type { FC, ReactNode } from "react";
import siteData from "@/data/site.json";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
}

interface FooterContent {
  tagline: string;
  columns: FooterColumn[];
  social: SocialLink[];
  legal: FooterLink[];
  copyright: string;
}

const footer = siteData.footer as FooterContent;

const RideBuildersLogo: FC = () => (
  <svg
    viewBox="0 0 256 256"
    className="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
      fill="#ffffff"
    />
  </svg>
);

// Inline brand glyphs — no extra icon library needed.
const socialIcons: Record<string, ReactNode> = {
  twitter: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.658l-5.214-6.817-5.97 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231zM17.083 19.77h1.832L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15V9l5.2 3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

const Footer: FC = () => {
  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand + tagline + social */}
          <div className="md:col-span-4">
            <a href="#home" className="flex items-center gap-2">
              <RideBuildersLogo />
              <span className="text-white text-base font-medium tracking-tight">
                ridebuilders
              </span>
            </a>
            <p className="mt-4 text-white/55 text-sm max-w-xs leading-relaxed">
              {footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {footer.social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                  {socialIcons[s.name] ?? null}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-sm font-semibold tracking-wide">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/55 text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-white/45">{footer.copyright}</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
            {footer.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
