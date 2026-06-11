import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ClientsContent } from "@/lib/content/site";

export function Clients({ content }: { content: ClientsContent }) {
  // Duplicate the row so the CSS marquee loops seamlessly.
  const marqueeItems = [...content.items, ...content.items];

  return (
    <section id="clients" className="border-y border-line bg-surface py-24 md:py-32">
      <div className="container-site">
        <SectionHeading
          eyebrow="Trusted by industry"
          title={content.title}
          subtitle="From global engineering leaders to UK utilities — five decades of trusted delivery."
        />
      </div>

      <Reveal className="relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-16 pr-16">
          {marqueeItems.map((client, i) => (
            <a
              key={`${client.name}-${i}`}
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`${client.name} — ${client.industry}`}
              className="opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              tabIndex={i >= content.items.length ? -1 : undefined}
              aria-hidden={i >= content.items.length || undefined}
            >
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={132}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
