import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Star,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Globe,
  Smartphone,
  ShieldCheck,
  Server,
  GitMerge,
  Code2,
  PenTool,
  Copy,
  Check,
  MapPin,
  ArrowUpRight,
  Plus,
  type LucideIcon,
} from "lucide-react";
import DotGrid from "../components/DotGrid";
import CustomCursor from "../components/CustomCursor";
import { useTheme } from "../hooks/useTheme";
import { supabase, type Feedback } from "../lib/supabaseClient";

interface FreelanceProject {
  title: string;
  // Folder name under src/assets/projects/ holding this project's images.
  slug: string;
  description: string;
  status: "COMPLETED" | "IN DEV" | "CONFIDENTIAL";
  platform: "Web" | "Mobile";
  tech: string[];
  // Only set once the project has somewhere public to send visitors (a live
  // site, an app store listing...). Left unset, the details window just
  // shows the gallery — which is the only option for an unpublished mobile
  // app anyway.
  liveUrl?: string;
  // Gradient colors for the fallback cover, picked per project for a bit of
  // catalogue variety instead of every card looking identical.
  gradient: [string, string];
}

const freelanceProjects: FreelanceProject[] = [
  {
    title: "SYNERA",
    slug: "synera",
    description: "Online store built specifically for a female audience.",
    status: "COMPLETED",
    platform: "Web",
    tech: ["React", "Django"],
    gradient: ["#be185d", "#f472b6"],
  },
  {
    title: "TAOUFIK",
    slug: "taoufik",
    description:
      "Mobile app that detects potential illnesses from a sound recording.",
    status: "COMPLETED",
    platform: "Mobile",
    tech: ["Flutter", "Flask"],
    gradient: ["#6d28d9", "#a78bfa"],
  },
  {
    title: "NAFS",
    slug: "nafs",
    description: "Mobile app for booking online psychological appointments.",
    status: "COMPLETED",
    platform: "Mobile",
    tech: ["Flutter", "Supabase", "GCP", "Firebase"],
    gradient: ["#b45309", "#fbbf24"],
  },
  {
    title: "VALIDZ",
    slug: "validz",
    description: "Consulting platform for businesses and startups.",
    status: "COMPLETED",
    platform: "Web",
    tech: ["Next.js"],
    gradient: ["#0f766e", "#2dd4bf"],
  },
];

// Project images are picked up automatically from
// src/assets/projects/<slug>/ — no code changes needed when adding one.
// A file named `cover.*` is the main image (shown in the card mockup and
// first in the gallery); every other image follows it, sorted by filename
// (so 01.png, 02.png, ... keeps them in order).
const projectImageFiles = import.meta.glob<string>(
  "../../assets/projects/*/*.{png,jpg,jpeg,webp,avif,gif,PNG,JPG,JPEG,WEBP}",
  { eager: true, query: "?url", import: "default" },
);

const projectImages: Record<string, string[]> = (() => {
  const bySlug: Record<string, { name: string; url: string }[]> = {};
  for (const [path, url] of Object.entries(projectImageFiles)) {
    const [slug, name] = path.split("/").slice(-2);
    (bySlug[slug] ??= []).push({ name, url });
  }
  const result: Record<string, string[]> = {};
  for (const [slug, files] of Object.entries(bySlug)) {
    const isCover = (n: string) => /^cover\./i.test(n);
    files.sort(
      (a, b) =>
        Number(isCover(b.name)) - Number(isCover(a.name)) ||
        a.name.localeCompare(b.name, undefined, { numeric: true }),
    );
    result[slug] = files.map((f) => f.url);
  }
  return result;
})();

const getProjectImages = (project: FreelanceProject) =>
  project.status === "CONFIDENTIAL" ? [] : (projectImages[project.slug] ?? []);

const connectServices: { label: string; icon: LucideIcon }[] = [
  { label: "Architecte réseau et sécurité", icon: ShieldCheck },
  { label: "Administrateur de serveurs", icon: Server },
  { label: "Ingénieur(e) DevOps", icon: GitMerge },
  { label: "Développeur(se) full-stack", icon: Code2 },
  { label: "Designer UX/UI", icon: PenTool },
];

const connectSteps = [
  {
    title: "Reach out",
    body: "Send a short brief — what you're building, your timeline and a rough budget.",
  },
  {
    title: "Scope & agree",
    body: "We pin down deliverables and sign a contract under my auto-entrepreneur status.",
  },
  {
    title: "Build",
    body: "Regular check-ins and demos so you see progress as it happens.",
  },
  {
    title: "Deliver & support",
    body: "Handover with documentation, plus support once it's live.",
  },
];

const contactEmail = "Bouzara.Zakaria.25@gmail.com";

const techHoverColors: Record<string, string> = {
  React: "#61DAFB",
  Django: "#092E20",
  Flutter: "#02569B",
  Flask: "#999999",
  Supabase: "#3ECF8E",
  GCP: "#4285F4",
  Firebase: "#FFA000",
  "Next.js": "#808080",
};

const avatarUrl = (name: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundType=gradientLinear&fontWeight=600`;

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const statusDotColors: Record<FreelanceProject["status"], string> = {
  COMPLETED: "#4ade80",
  "IN DEV": "#fbbf24",
  CONFIDENTIAL: "#a78bfa",
};

// Renders the project inside a device frame (browser window for web, phone
// for mobile) so the catalogue reads like real products. Shows the project's
// cover image on the device screen, or initials until one is added.
function ProjectCover({
  title,
  image,
  gradient,
  confidential,
  platform,
  className = "",
}: {
  title: string;
  image?: string;
  gradient: [string, string];
  confidential: boolean;
  platform: FreelanceProject["platform"];
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = image && !errored && !confidential;
  const isMobile = platform === "Mobile";

  const screen = showImage ? (
    <img
      src={image}
      alt={title}
      onError={() => setErrored(true)}
      className="w-full h-full object-cover object-top"
    />
  ) : (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(160deg, ${gradient[0]}cc, ${gradient[1]}99)`,
      }}
    >
      {confidential ? (
        <Lock className="w-1/4 h-1/4 max-w-10 max-h-10 text-white/80" />
      ) : (
        <span
          className={`${isMobile ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"} font-bold text-white/90`}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {getInitials(title)}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`w-full flex items-center justify-center relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)",
        }}
      />
      <div className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-3/4 h-2/3 rounded-full bg-white/20 blur-3xl" />

      <div className="relative z-10 h-full w-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
        {isMobile ? (
          <div className="relative h-[78%] aspect-[9/19] rounded-[1.1rem] border-[3px] border-white/40 bg-black/30 shadow-2xl shadow-black/40 overflow-hidden">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/3 h-1.5 rounded-full bg-black/60 z-10" />
            {screen}
          </div>
        ) : (
          <div className="w-[76%] aspect-[16/10] rounded-md border border-white/40 bg-black/30 shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-black/30 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 h-1.5 flex-1 max-w-[50%] rounded-full bg-white/20" />
            </div>
            <div className="flex-1 min-h-0">{screen}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Supports fractional ratings (used for the average) by clipping a filled
// star over an outlined one.
function StarRating({
  rating,
  isDark,
  size = "sm",
}: {
  rating: number;
  isDark: boolean;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1)));
        return (
          <span key={n} className={`relative ${sizeClass}`}>
            <Star
              className={`absolute inset-0 ${sizeClass}`}
              fill="none"
              stroke={isDark ? "#ffffff80" : "#00000080"}
            />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={`${sizeClass} max-w-none`}
                  fill="#2563eb"
                  stroke="#2563eb"
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ProjectModal({
  project,
  isDark,
  borderClass,
  bgClass,
  mutedClass,
  textClass,
  getStatusColor,
  getSkillTagStyle,
  skillTagHoverHandlers,
  onClose,
}: {
  project: FreelanceProject;
  isDark: boolean;
  borderClass: string;
  bgClass: string;
  mutedClass: string;
  textClass: string;
  getStatusColor: (status: string) => string;
  getSkillTagStyle: (name: string) => React.CSSProperties;
  skillTagHoverHandlers: (name: string) => Record<string, unknown>;
  onClose: () => void;
}) {
  const confidential = project.status === "CONFIDENTIAL";
  const images = getProjectImages(project);
  const [active, setActive] = useState(0);
  const isMobile = project.platform === "Mobile";

  const go = useCallback(
    (dir: number) =>
      setActive((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (images.length > 1 && e.key === "ArrowLeft") go(-1);
      if (images.length > 1 && e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, go, images.length]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col border ${borderClass} ${bgClass} ${textClass} rounded-xl overflow-hidden`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors duration-150"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="overflow-y-auto">
          {/* Gallery viewer */}
          <div
            className="relative h-[42vh] sm:h-[58vh] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)",
              }}
            />

            {images.length > 0 ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={images[active]}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
                >
                  <img
                    src={images[active]}
                    alt={`${project.title} — image ${active + 1} of ${images.length}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/40"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/90">
                {confidential ? (
                  <Lock className="w-12 h-12" />
                ) : (
                  <span
                    className="text-7xl sm:text-8xl font-bold"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {getInitials(project.title)}
                  </span>
                )}
                {!confidential && (
                  <span className="text-[10px] sm:text-xs tracking-[0.25em] text-white/70">
                    SCREENSHOTS COMING SOON
                  </span>
                )}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm transition-colors duration-150"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm transition-colors duration-150"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                <span className="absolute bottom-3 right-3 z-20 text-[11px] tracking-wider text-white bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={`flex gap-2 overflow-x-auto p-3 sm:px-5 border-b ${isDark ? "border-white/20" : "border-black/20"}`}>
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active}
                  className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                    isMobile ? "w-12 h-20 sm:w-14 sm:h-24" : "w-24 h-14 sm:w-28 sm:h-16"
                  } ${
                    i === active
                      ? "border-[#2563eb] opacity-100"
                      : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 md:gap-10 p-5 sm:p-8">
            <div>
              <h3
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {project.title}
              </h3>
              <div className={`flex items-center gap-1.5 text-xs mb-4 ${mutedClass}`}>
                {isMobile ? (
                  <Smartphone className="w-3.5 h-3.5" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                {isMobile ? "Mobile app" : "Web platform"}
              </div>
              <p
                className={`text-sm sm:text-base font-light leading-relaxed ${
                  confidential ? "opacity-70" : ""
                }`}
              >
                {confidential
                  ? "Project details are confidential per client agreement."
                  : project.description}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className={`text-[10px] tracking-[0.25em] mb-2 ${mutedClass}`}>
                  STATUS
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-xs border px-2 py-1 rounded ${getStatusColor(project.status)}`}
                >
                  {confidential && <Lock className="w-3 h-3" />}
                  {project.status}
                </span>
              </div>

              {!confidential && (
                <>
                  <div>
                    <p className={`text-[10px] tracking-[0.25em] mb-2 ${mutedClass}`}>
                      STACK
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className={`skill-tag text-xs border ${borderClass} px-2 py-0.5 rounded transition-all duration-150 ${
                            isDark ? "opacity-90" : "opacity-80"
                          }`}
                          style={getSkillTagStyle(t)}
                          {...skillTagHoverHandlers(t)}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-4 py-2.5 rounded-lg transition-colors duration-150"
                    >
                      Visit live {isMobile ? "listing" : "site"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <p className={`text-xs leading-relaxed ${mutedClass}`}>
                      {isMobile
                        ? images.length > 0
                          ? "Not published to an app store yet — the screenshots above are the closest preview for now."
                          : "Not published to an app store yet."
                        : "No public link yet — reach out if you'd like a live walkthrough."}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Freelance() {
  const [isDark, setIsDark] = useTheme(true);
  const [feedbackState, setFeedbackState] = useState<
    "loading" | "error" | "ready"
  >("loading");
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<FreelanceProject | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const averageRating =
    feedbackList.length > 0
      ? feedbackList.reduce((sum, f) => sum + f.rating, 0) /
        feedbackList.length
      : 0;
  const platformCounts = {
    Web: freelanceProjects.filter((p) => p.platform === "Web").length,
    Mobile: freelanceProjects.filter((p) => p.platform === "Mobile").length,
  };

  useEffect(() => {
    if (!emailCopied) return;
    const t = setTimeout(() => setEmailCopied(false), 2000);
    return () => clearTimeout(t);
  }, [emailCopied]);

  const copyEmail = () => {
    navigator.clipboard
      ?.writeText(contactEmail)
      .then(() => setEmailCopied(true))
      .catch(() => {});
  };

  useEffect(() => {
    let active = true;
    supabase
      .from("feedback")
      .select("id, name, rating, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setFeedbackState("error");
          return;
        }
        setFeedbackList(data ?? []);
        setFeedbackState("ready");
      });
    return () => {
      active = false;
    };
  }, []);

  const bgClass = isDark ? "bg-[#0a1830]" : "bg-[#eaf1fe]";
  const navBgClass = isDark ? "bg-[#0a1830]/70" : "bg-[#eaf1fe]/70";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white" : "border-black";
  const mutedClass = isDark ? "text-white/50" : "text-black/50";
  const subtleBorderClass = isDark ? "border-white/20" : "border-black/20";

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") {
      return isDark
        ? "border-[#4ade80] text-[#4ade80]"
        : "border-[#16a34a] bg-[#16a34a]/10 text-[#15803d] font-medium";
    }
    if (status === "IN DEV") {
      return isDark
        ? "border-[#fbbf24] text-[#fbbf24]"
        : "border-[#d97706] bg-[#d97706]/10 text-[#b45309] font-medium";
    }
    if (status === "CONFIDENTIAL") {
      return isDark
        ? "border-[#a78bfa] text-[#a78bfa]"
        : "border-[#7c3aed] bg-[#7c3aed]/10 text-[#6d28d9] font-medium";
    }
    return borderClass;
  };

  const getSkillTagStyle = (name: string) => {
    const color = techHoverColors[name];
    if (!color) return {};
    return { "--hover-color": color } as React.CSSProperties;
  };

  const skillTagHoverHandlers = (name: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLSpanElement>) => {
      const color = techHoverColors[name];
      if (color) {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
        e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
        e.currentTarget.style.backgroundColor = `${color}30`;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLSpanElement>) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.color = "";
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.backgroundColor = "";
    },
  });

  return (
    <div
      className={`relative w-screen min-h-screen ${bgClass} ${textClass} font-mono`}
    >
      <DotGrid isDark={isDark} />
      <CustomCursor isDark={isDark} />

      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-40 ${navBgClass} backdrop-blur-md border-b ${borderClass}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs sm:text-sm tracking-wider opacity-60 hover:opacity-100 transition-opacity duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative p-2 rounded-lg hover:opacity-80 transition-opacity duration-150 flex-shrink-0 overflow-hidden group w-[34px] h-[34px]"
          >
            <div className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#2563eb_100%)] opacity-80" />
            <div
              className={`absolute inset-[1px] rounded-[7px] ${bgClass} z-0 flex items-center justify-center`}
            >
              <div className="relative z-10">
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>
        </div>
      </nav>

      <main className="px-6 sm:px-8 md:px-16 lg:px-24 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            FREELANCE WORK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-sm sm:text-base font-light mb-10 sm:mb-16 ${mutedClass}`}
          >
            Client projects I've built, and what they had to say about it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`flex items-start gap-4 rounded-xl border border-[#2563eb]/40 border-l-4 border-l-[#2563eb] ${
              isDark ? "bg-[#2563eb]/15" : "bg-[#2563eb]/10"
            } px-5 py-4 sm:px-6 sm:py-5 mb-10 sm:mb-16`}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2563eb] text-white flex-shrink-0">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <p
                className="text-sm font-bold mb-1"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Confidentiality comes first
              </p>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-white/85" : "text-black/80"
                }`}
              >
                Not every project I've worked on is listed here — some stay off
                this page entirely under client confidentiality agreements.
                Your project would be protected the same way, if needed.
              </p>
            </div>
          </motion.div>

          {/* Projects */}
          <section className="mb-16 sm:mb-24">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p
                  className={`text-[10px] sm:text-xs tracking-[0.25em] mb-2 ${mutedClass}`}
                >
                  CATALOGUE — {String(freelanceProjects.length).padStart(2, "0")}{" "}
                  ENTRIES
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  PROJECTS
                </h2>
              </div>

              <div className={`flex items-center gap-4 text-xs tracking-wider ${mutedClass}`}>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {platformCounts.Web} Web
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  {platformCounts.Mobile} Mobile
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {freelanceProjects.map((project, index) => {
                  const confidential = project.status === "CONFIDENTIAL";
                  const catalogueNo = index + 1;

                  return (
                    <motion.button
                      key={project.title}
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.08, duration: 0.4 },
                      }}
                      viewport={{ once: false, amount: 0.2 }}
                      whileHover={{
                        y: -4,
                        boxShadow: isDark
                          ? "0 0 14px rgba(255, 255, 255, 0.35)"
                          : "0 0 14px rgba(37, 99, 235, 0.35)",
                        transition: { duration: 0.15, ease: "easeOut" },
                      }}
                      className={`flex flex-col text-left border ${borderClass} ${bgClass} rounded-xl overflow-hidden group cursor-pointer ${textClass}`}
                    >
                      <div className="relative">
                        <ProjectCover
                          title={project.title}
                          image={getProjectImages(project)[0]}
                          gradient={project.gradient}
                          confidential={confidential}
                          platform={project.platform}
                          className="aspect-[4/3]"
                        />

                        <span className="absolute top-3 left-3 z-20 text-[10px] tracking-[0.2em] text-white/85 font-medium">
                          NO. {String(catalogueNo).padStart(2, "0")}
                        </span>
                        <span className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 text-[10px] tracking-wider text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                          {confidential ? (
                            <Lock className="w-2.5 h-2.5" />
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: statusDotColors[project.status],
                              }}
                            />
                          )}
                          {project.status}
                        </span>

                        <div className="absolute inset-0 z-20 flex items-end justify-center pb-4 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="flex items-center gap-1 text-xs tracking-wider text-black bg-white px-3 py-1.5 rounded-full translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                            View project
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className={`flex flex-col flex-grow gap-2 p-4 sm:p-5 border-t ${borderClass}`}>
                        <div className="flex items-center justify-between gap-3">
                          <h3
                            className="text-lg font-bold"
                            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                          >
                            {project.title}
                          </h3>
                          <span
                            className={`flex items-center gap-1 text-[11px] tracking-wide flex-shrink-0 ${mutedClass}`}
                          >
                            {project.platform === "Mobile" ? (
                              <Smartphone className="w-3 h-3" />
                            ) : (
                              <Globe className="w-3 h-3" />
                            )}
                            {project.platform === "Mobile" ? "Mobile" : "Web"}
                          </span>
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-light leading-relaxed line-clamp-2 ${
                            confidential ? "opacity-70" : ""
                          }`}
                        >
                          {confidential
                            ? "Project details are confidential per client agreement."
                            : project.description}
                        </p>

                        {!confidential && (
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className={`skill-tag text-[11px] border ${subtleBorderClass} px-2 py-0.5 rounded transition-all duration-150`}
                                style={getSkillTagStyle(t)}
                                {...skillTagHoverHandlers(t)}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, transition: { delay: 0.35 } }}
                  viewport={{ once: false, amount: 0.2 }}
                  className={`border border-dashed ${borderClass} rounded-xl flex flex-col items-center justify-center gap-2 p-6 min-h-[200px] ${mutedClass}`}
                >
                  <span className="text-2xl font-light leading-none">+</span>
                  <p className="text-xs tracking-[0.2em]">MORE PROJECTS INCOMING</p>
                </motion.div>
            </div>
          </section>

          {/* Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                CLIENT FEEDBACK
              </h2>
              {feedbackState === "ready" && feedbackList.length > 0 && (
                <div
                  className={`flex items-center gap-2.5 border ${subtleBorderClass} rounded-full pl-3 pr-3.5 py-1.5`}
                >
                  <span
                    className="text-lg font-bold leading-none"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {averageRating.toFixed(1)}
                  </span>
                  <StarRating rating={averageRating} isDark={isDark} size="md" />
                  <span className={`text-xs ${mutedClass}`}>
                    {feedbackList.length}{" "}
                    {feedbackList.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>
            <Link
              to="/leave-feedback"
              className="text-xs sm:text-sm tracking-wider border border-[#2563eb] text-[#2563eb] bg-[#2563eb]/10 px-3 py-1.5 rounded-full hover:bg-[#2563eb]/20 transition-colors duration-150 whitespace-nowrap"
            >
              Worked with me? Leave feedback →
            </Link>
          </div>

          {feedbackState === "loading" && (
            <p className={`text-sm font-light ${mutedClass}`}>
              Loading feedback...
            </p>
          )}

          {feedbackState === "error" && (
            <p className={`text-sm font-light ${mutedClass}`}>
              Couldn't load feedback right now — please try again later.
            </p>
          )}

          {feedbackState === "ready" && feedbackList.length === 0 && (
            <p className={`text-sm font-light ${mutedClass}`}>
              No feedback yet — be the first to share yours.
            </p>
          )}

          {feedbackState === "ready" && feedbackList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {feedbackList.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05, duration: 0.4 },
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  className={`flex flex-col gap-4 border ${borderClass} p-5 sm:p-6 rounded-lg`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl(item.name)}
                      alt=""
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <StarRating rating={item.rating} isDark={isDark} />
                    </div>
                  </div>
                  <p className="text-sm font-light leading-relaxed">
                    {item.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* How to connect */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.15 }}
            className={`relative mt-16 sm:mt-24 border ${borderClass} ${bgClass} rounded-2xl overflow-hidden`}
          >
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#2563eb]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
              {/* Who it's for + services */}
              <div
                className={`p-6 sm:p-10 border-b lg:border-b-0 lg:border-r ${subtleBorderClass}`}
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.2em] border border-[#2563eb] text-[#2563eb] bg-[#2563eb]/10 px-3 py-1 rounded-full mb-5">
                  <MapPin className="w-3 h-3" />
                  ALGERIA · AUTO-ENTREPRENEUR
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-4"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  HOW TO CONNECT
                </h2>
                <p
                  className={`text-sm sm:text-base font-light mb-8 max-w-xl leading-relaxed ${mutedClass}`}
                >
                  Based in Algeria? Reach out directly and we can work out a
                  contract and agreement built around what your project needs.
                  I hold an auto-entrepreneur status for Algerian clients.
                </p>

                <p className={`text-[10px] sm:text-xs tracking-[0.25em] mb-3 ${mutedClass}`}>
                  AVAILABLE FOR
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {connectServices.map(({ label, icon: Icon }, i) => (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
                      }}
                      viewport={{ once: true }}
                      className={`flex items-center gap-3 border ${subtleBorderClass} rounded-lg px-3 py-2.5 hover:border-[#2563eb] transition-colors duration-150`}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2563eb]/15 text-[#2563eb] flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs sm:text-sm">{label}</span>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.1 + connectServices.length * 0.05,
                        duration: 0.3,
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group flex items-center gap-3 h-full border border-dashed border-[#2563eb] bg-[#2563eb]/5 hover:bg-[#2563eb]/15 rounded-lg px-3 py-2.5 transition-colors duration-150"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2563eb] text-white flex-shrink-0">
                        <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs sm:text-sm">Un autre besoin ?</span>
                        <span className={`text-[11px] ${mutedClass}`}>
                          Parlons-en
                        </span>
                      </span>
                    </a>
                  </motion.li>
                </ul>
              </div>

              {/* Process */}
              <div className="p-6 sm:p-10">
                <p className={`text-[10px] sm:text-xs tracking-[0.25em] mb-6 ${mutedClass}`}>
                  HOW IT WORKS
                </p>
                <ol className="relative">
                  {connectSteps.map((step, i) => (
                    <motion.li
                      key={step.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.15 + i * 0.08, duration: 0.3 },
                      }}
                      viewport={{ once: true }}
                      className="relative flex gap-4 pb-7 last:pb-0"
                    >
                      {i < connectSteps.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-8 bottom-0 w-px ${
                            isDark ? "bg-white/20" : "bg-black/20"
                          }`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border text-[11px] flex-shrink-0 ${bgClass} ${
                          i === 0
                            ? "border-[#2563eb] text-[#2563eb]"
                            : subtleBorderClass
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="pt-1">
                        <p
                          className="text-sm sm:text-base font-bold mb-1"
                          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                        >
                          {step.title}
                        </p>
                        <p className={`text-xs sm:text-sm font-light leading-relaxed ${mutedClass}`}>
                          {step.body}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t ${subtleBorderClass} px-6 sm:px-10 py-5 sm:py-6`}
            >
              <div>
                <p
                  className="text-base sm:text-lg font-bold"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Have a project in mind?
                </p>
                <p className={`text-xs sm:text-sm font-light ${mutedClass}`}>
                  Drop me an email with a short brief to get started.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-5 py-2.5 rounded-lg transition-colors duration-150"
                >
                  <Mail className="w-4 h-4" />
                  Email me
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm border ${borderClass} px-4 py-2.5 rounded-lg hover:opacity-80 transition-opacity duration-150 max-w-full`}
                >
                  <span className="truncate">{contactEmail}</span>
                  {emailCopied ? (
                    <Check className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-60 flex-shrink-0" />
                  )}
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isDark={isDark}
            borderClass={borderClass}
            bgClass={bgClass}
            mutedClass={mutedClass}
            textClass={textClass}
            getStatusColor={getStatusColor}
            getSkillTagStyle={getSkillTagStyle}
            skillTagHoverHandlers={skillTagHoverHandlers}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
