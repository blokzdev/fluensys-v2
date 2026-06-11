import type { NextConfig } from "next";

/**
 * Legacy asset paths from the v1 site (fluensys-site). The v2 content lake
 * stores every article's files under content/articles/<year>/<slug>/ and
 * publishes them to /blogfiles/<year>/<slug>/. These redirects keep any
 * externally shared v1 URLs (notably the article PDFs) alive forever.
 */
const LEGACY_BLOGFILE_REDIRECTS: Array<{ from: string; to: string }> = [
  // Full-article PDFs
  {
    from: "/blogfiles/2024/08/vfds-in-pumping-systems-rev1.pdf",
    to: "/blogfiles/2024/vfds-in-pumping-systems/vfds-in-pumping-systems.pdf",
  },
  {
    from: "/blogfiles/2024/08/using-dynamic-modelling-to-troubleshoot-pumping-system-trip-rev1.pdf",
    to: "/blogfiles/2024/using-dynamic-modelling-to-troubleshoot-pumping-system-trip/using-dynamic-modelling-to-troubleshoot-pumping-system-trip.pdf",
  },
  {
    from: "/blogfiles/2024/09/troubleshooting-centrifugal-pumps-rev1.pdf",
    to: "/blogfiles/2024/troubleshooting-centrifugal-pumps/troubleshooting-centrifugal-pumps.pdf",
  },
  {
    from: "/blogfiles/2024/10/implementing-net-zero-strategies-in-process-plants-rev1.pdf",
    to: "/blogfiles/2024/implementing-net-zero-strategies-in-process-plants/implementing-net-zero-strategies-in-process-plants.pdf",
  },
  {
    from: "/blogfiles/2024/10/key-issues-and-common-solutions-for-cryogenic-pumps-rev1.pdf",
    to: "/blogfiles/2024/key-issues-and-common-solutions-for-cryogenic-pumps/key-issues-and-common-solutions-for-cryogenic-pumps.pdf",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return LEGACY_BLOGFILE_REDIRECTS.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
