import Link from "next/link";

import { getCompany } from "@/lib/content/site";

const QUICK_LINKS = [
  { title: "Our Services", href: "/#services" },
  { title: "Our Expertise", href: "/#expertise" },
  { title: "Our Team", href: "/#team" },
  { title: "Our Clients", href: "/#clients" },
  { title: "The Journal", href: "/blog" },
  { title: "Contact", href: "/#contact" },
];

export function Footer() {
  const company = getCompany();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-line bg-surface">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr] md:py-20">
        <div className="max-w-md">
          <p className="text-display text-lg font-bold tracking-[0.18em] text-ink">
            FLUEN<span className="text-azure-bright">SYS</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-dim">{company.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={company.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FluenSys on X"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-azure-bright hover:text-azure-bright"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={company.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FluenSys on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-azure-bright hover:text-azure-bright"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-eyebrow mb-5">Quick Links</p>
          <ul className="grid gap-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-dim transition-colors hover:text-azure-bright"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-eyebrow mb-5">Contact Us</p>
          <ul className="grid gap-3 text-sm text-ink-dim">
            <li>
              <a href={`mailto:${company.contact.email}`} className="transition-colors hover:text-azure-bright">
                {company.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.contact.phone.replace(/[^+\d]/g, "")}`}
                className="transition-colors hover:text-azure-bright"
              >
                {company.contact.phone}
              </a>
            </li>
            <li className="leading-relaxed">{company.contact.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-faint sm:flex-row">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-ink-dim">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink-dim">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
