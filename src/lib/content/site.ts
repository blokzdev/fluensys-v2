import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

const SITE_DIR = path.join(process.cwd(), "content", "site");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(SITE_DIR, file), "utf-8")) as T;
}

export interface CompanyContent {
  name: string;
  legalName: string;
  tagline: string;
  strapline: string;
  description: string;
  foundingStatement: string;
  values: string[];
  keyPoints: string[];
  contact: { email: string; phone: string; address: string };
  social: { x: string; linkedin: string };
  certifications: Array<{ title: string; image: string; url: string }>;
}

export interface ServicePillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge: string;
  details: string[];
}

export interface ExpertiseGroup {
  key: string;
  label: string;
  icon: string;
  items: Array<{
    name: string;
    description: string;
    subtypes: Array<{ name: string; description: string }>;
  }>;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Array<{ value: string; label: string }>;
    slides: Array<{
      title: string;
      subtitle: string;
      buttonText: string;
      buttonHref: string;
      bgSrc: string;
      bgAlt: string;
    }>;
  };
  pillars: {
    title: string;
    subtitle: string;
    requestServiceLabel: string;
    items: ServicePillar[];
  };
  expertise: {
    title: string;
    subtitle: string;
    filterInstructions: string;
    groups: ExpertiseGroup[];
  };
  consultancy: {
    title: string;
    subtitle: string;
    categories: Array<{ title: string; icon: string; items: string[] }>;
  };
  about: {
    title: string;
    description: string;
    values: Array<{ text: string }>;
    keyPoints: string[];
    certificationBadges: Array<{ src: string; alt: string; url: string }>;
  };
  cta: { title: string; subtitle: string; buttonText: string };
  blogPromo: {
    title: string;
    subtitle: string;
    latestPostsButtonText: string;
    subscribeButtonText: string;
  };
}

export interface TeamContent {
  title: string;
  description: string;
  members: Array<{
    name: string;
    position: string;
    expertise: string;
    bio: string;
    image: string;
    linkedin: string;
  }>;
}

export interface ClientsContent {
  title: string;
  items: Array<{
    name: string;
    logo: string;
    industry: string;
    description: string;
    website: string;
  }>;
}

export interface TestimonialsContent {
  title: string;
  items: Array<{
    id: number;
    quote: string;
    author: string;
    company: string;
    project: string;
    year: number;
  }>;
}

export const getCompany = cache(() => readJson<CompanyContent>("company.json"));
export const getHomeContent = cache(() => readJson<HomeContent>("home.json"));
export const getTeam = cache(() => readJson<TeamContent>("team.json"));
export const getClients = cache(() => readJson<ClientsContent>("clients.json"));
export const getTestimonials = cache(() => readJson<TestimonialsContent>("testimonials.json"));
