import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Briefcase, Calendar, GraduationCap, Users } from "lucide-react";

type Entry = {
  title: string;
  role: string;
  context: string;
  period?: string;
  badge?: string;
  current?: boolean;
  link?: { to: string; label: string };
};

type Category = {
  key: string;
  label: string;
  short: string;
  icon: typeof Briefcase;
  // [dark, light] accent
  color: [string, string];
  entries: Entry[];
};

const categories: Category[] = [
  {
    key: "work",
    label: "Work Experience",
    short: "Work",
    icon: Briefcase,
    color: ["#60a5fa", "#2563eb"],
    entries: [
      {
        title: "DIGITAL PLUM",
        role: "Backend & Infrastructure Developer",
        badge: "REMOTE",
        current: true,
        period: "FEB 2026 - PRESENT",
        context:
          "Building backend solutions for various apps while managing Digital Plum's infrastructure and deployments.",
      },
      {
        title: "IMTIYAZ ACADEMY",
        role: "IT & Network Administrator",
        badge: "HYBRID",
        current: true,
        period: "AUG 2026 - PRESENT",
        context:
          "Maintaining and improving the network topology, configuring workstations, managing AD DS across 3 sites and ensuring the safe deployment of the school's apps.",
      },
      {
        title: "AUTO-ENTREPRENEUR",
        role: "Architecte Réseau et Sécurité",
        badge: "FREELANCE",
        period: "FEB 2026 - PRESENT",
        current: true,
        context:
          "Designing and securing network infrastructures for clients as a self-employed network & security architect.",
        link: { to: "/freelance", label: "See freelance work" },
      },
    ],
  },
  {
    key: "internships",
    label: "Internships",
    short: "Internships",
    icon: GraduationCap,
    color: ["#4ade80", "#16a34a"],
    entries: [
      {
        title: "SONATRACH",
        role: "Infrastructure and Networks Engineer",
        period: "JAN 2026 - JUN 2026",
        badge: "COMPLETED",
        context:
          "Implementation and deployment of an HCI based on open source technologies.",
      },
      {
        title: "AMANA",
        role: "Microservices Monitoring Intern",
        period: "JUN 2025 - AUG 2025",
        badge: "COMPLETED",
        context:
          "Implemented a Monitoring solution for microservices, and databases",
      },
      {
        title: "CERIST",
        role: "Intern Web Developer & Web Security Engineer",
        period: "JAN 2024 - JUN 2024",
        badge: "COMPLETED",
        context:
          "Developed a Web app while Implementing web security best practices",
      },
    ],
  },
  {
    key: "clubs",
    label: "Scientific Clubs",
    short: "Clubs",
    icon: Users,
    color: ["#c084fc", "#9333ea"],
    entries: [
      {
        title: "GDG ESI ALGER",
        role: "Core Team Member",
        period: "OCT 2024 - PRESENT",
        context: "Developer at Google Developer Group community activities",
      },
      {
        title: "SHELLMATES CLUB ESI ALGER",
        role: "External Relations Member",
        period: "NOV 2024 - PRESENT",
        context: "Cybersecurity and CTF competitions",
      },
      {
        title: "CELEC USTHB",
        role: "Communication Team Member",
        period: "OCT 2022 - OCT 2024",
        context: "Electronics and embedded systems club",
      },
    ],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function ExperienceSection({ isDark }: { isDark: boolean }) {
  const [activeKey, setActiveKey] = useState(categories[0].key);
  const active = categories.find((c) => c.key === activeKey)!;
  const accent = isDark ? active.color[0] : active.color[1];

  const mutedClass = isDark ? "text-white/50" : "text-black/50";
  const subtleBorder = isDark ? "border-white/15" : "border-black/15";
  const pageBg = isDark ? "#000000" : "#ffffff";
  const lineClass = isDark ? "bg-white/20" : "bg-black/20";

  return (
    <div className="w-full max-w-6xl m-auto py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-14">
      {/* Header + category switcher */}
      <div className="lg:pt-2">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          EXPERIENCE
        </h2>
        <p className={`text-xs tracking-widest mb-6 lg:mb-10 ${mutedClass}`}>
          {categories
            .map((c) => `${pad(c.entries.length)} ${c.short.toUpperCase()}`)
            .join(" · ")}
        </p>

        <div
          role="tablist"
          className="grid grid-cols-3 lg:grid-cols-1 gap-2"
        >
          {categories.map((c, i) => {
            const selected = c.key === activeKey;
            const color = isDark ? c.color[0] : c.color[1];
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveKey(c.key)}
                className={`group flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-2 sm:px-3 py-2.5 lg:py-3 rounded-lg border text-left transition-[color,border-color,box-shadow] duration-200 ${
                  selected ? "" : `${subtleBorder} ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`
                }`}
                style={
                  selected
                    ? {
                        borderColor: color,
                        color,
                        background: `linear-gradient(${color}14, ${color}14), ${pageBg}`,
                        boxShadow: `0 0 18px -6px ${color}`,
                      }
                    : { backgroundColor: pageBg }
                }
              >
                <span className="hidden lg:inline text-xs opacity-60">
                  {pad(i + 1)}
                </span>
                <Icon className="hidden sm:block w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm tracking-wide truncate">
                  <span className="lg:hidden">{c.short}</span>
                  <span className="hidden lg:inline">{c.label}</span>
                </span>
                <span className="hidden lg:inline ml-auto text-xs opacity-60">
                  {pad(c.entries.length)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.ol
          key={activeKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative pl-8 sm:pl-10 space-y-4 sm:space-y-5"
        >
          {/* Line: 1px wide, its center sits at 0.625rem — same as the 1.25rem dots */}
          <span
            aria-hidden
            className={`absolute left-[calc(0.625rem-0.5px)] top-8 bottom-8 w-px ${lineClass}`}
          />

          {active.entries.map((entry, index) => (
            <motion.li
              key={entry.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="relative"
            >
              {/* Dot, vertically aligned with the card title */}
              <span
                aria-hidden
                className="absolute -left-8 sm:-left-10 top-[calc(1.2917rem+1px)] sm:top-[calc(1.5417rem+1px)] w-5 h-5 flex items-center justify-center"
              >
                {entry.current && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: accent }}
                  />
                )}
                <span
                  className={`relative w-5 h-5 rounded-full border-2 ${isDark ? "bg-black" : "bg-white"}`}
                  style={{ borderColor: accent }}
                >
                  <span
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                </span>
              </span>

              <div
                className={`experience-card rounded-lg border ${subtleBorder} p-4 sm:p-5`}
                style={{ "--card-color": accent, backgroundColor: pageBg } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-base sm:text-lg font-bold leading-[1.833rem]"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {entry.title}
                  </h3>
                  {entry.badge && (
                    <span
                      className="text-[0.833rem] sm:text-xs tracking-wider border px-2 py-0.5 rounded flex-shrink-0"
                      style={{
                        borderColor: accent,
                        color: accent,
                        background: `linear-gradient(${accent}14, ${accent}14), ${pageBg}`,
                      }}
                    >
                      {entry.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm font-light mt-1.5">{entry.role}</p>
                <p className={`text-xs leading-relaxed mt-2 ${mutedClass}`}>
                  {entry.context}
                </p>

                {(entry.period || entry.link) && (
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-3">
                    {entry.period && (
                      <span className="flex items-center gap-1.5 text-xs tracking-widest">
                        <Calendar className={`w-3.5 h-3.5 ${mutedClass}`} />
                        {entry.period}
                      </span>
                    )}
                    {entry.link && (
                      <Link
                        to={entry.link.to}
                        className="inline-flex items-center gap-1 text-xs font-bold tracking-wide hover:underline"
                        style={{ color: accent }}
                      >
                        {entry.link.label}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}
