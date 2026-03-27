"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteConfig, ContactConfig } from "@/types";

// ─── Default values (fallbacks before Firestore loads) ────────────────────────

const DEFAULT_SITE: SiteConfig = {
  name: "nishancreates",
  title: "I build websites that actually work for your business.",
  bio: "Hey, I'm Nishan — a developer from Nepal. I got tired of seeing local businesses with zero online presence, so I started building for them. Cafes, clothing brands, restaurants. Real sites, real dashboards, real results.",
  taglines: [
    "Built a cafe system. Owner got 3x more reservations.",
    "Turned WhatsApp into a checkout engine.",
    "Local business? You need more than a brochure.",
    "One developer. Full system. No middlemen.",
  ],
  profileImage: "/profile.jpg",
  heroCtaPrimary: "See my work",
  heroCtaSecondary: "Let's talk",
  availableForWork: true,
  yearsExperience: 3,
  projectsCompleted: 10,
};

const DEFAULT_CONTACT: ContactConfig = {
  whatsapp: "9779848303515",
  email: "nishanrokaya535@gmail.com",
  github: "https://github.com/nishancreates",
  linkedin: "https://www.linkedin.com/in/nishan-kumar-rokaya/",
  whatsappMessage:
    "Hello Nishan! 👋 I found your portfolio and I'd like to discuss a project.",
};

// ─── Context type ─────────────────────────────────────────────────────────────

interface GlobalContextType {
  siteConfig: SiteConfig;
  contactConfig: ContactConfig;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType>({
  siteConfig: DEFAULT_SITE,
  contactConfig: DEFAULT_CONTACT,
  isLoading: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE);
  const [contactConfig, setContactConfig] =
    useState<ContactConfig>(DEFAULT_CONTACT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to site config
    const unsubSite = onSnapshot(
      doc(db, "config", "site"),
      (snap) => {
        if (snap.exists()) {
          setSiteConfig({ ...DEFAULT_SITE, ...snap.data() } as SiteConfig);
        }
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );

    // Listen to contact config
    const unsubContact = onSnapshot(
      doc(db, "config", "contact"),
      (snap) => {
        if (snap.exists()) {
          setContactConfig({
            ...DEFAULT_CONTACT,
            ...snap.data(),
          } as ContactConfig);
        }
      },
      () => {}
    );

    return () => {
      unsubSite();
      unsubContact();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ siteConfig, contactConfig, isLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGlobalConfig() {
  return useContext(GlobalContext);
}
