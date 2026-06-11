import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { Expertise } from "@/components/home/Expertise";
import { ConsultancyTabs } from "@/components/home/ConsultancyTabs";
import { About } from "@/components/home/About";
import { Team } from "@/components/home/Team";
import { Clients } from "@/components/home/Clients";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";
import { BlogPromo } from "@/components/home/BlogPromo";
import { getPublishedArticles, toSummary } from "@/lib/content/articles";
import {
  getClients,
  getCompany,
  getHomeContent,
  getTeam,
  getTestimonials,
} from "@/lib/content/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  const home = getHomeContent();
  const company = getCompany();
  const team = getTeam();
  const clients = getClients();
  const testimonials = getTestimonials();
  const articles = getPublishedArticles().map(toSummary);

  const jsonLd = [organizationJsonLd(company.contact, team.members), websiteJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero content={home.hero} />
        <Pillars content={home.pillars} />
        <Expertise content={home.expertise} />
        <ConsultancyTabs content={home.consultancy} />
        <About content={home.about} />
        <Team content={team} />
        <Clients content={clients} />
        <Testimonials content={testimonials} />
        <BlogPromo content={home.blogPromo} articles={articles} />
        <CTA content={home.cta} email={company.contact.email} />
      </main>
      <Footer />
    </>
  );
}
