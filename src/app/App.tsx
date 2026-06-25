import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun, Github, Linkedin, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import DotGrid from "./components/DotGrid";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mirror activeSection in a ref so the scroll/keydown listeners can read the
  // latest value without being torn down and re-subscribed on every change.
  const activeSectionRef = useRef(0);
  activeSectionRef.current = activeSection;

  // Guards against the snap container advancing more than one slide per arrow
  // press: lock while a programmatic smooth-scroll is in flight, releasing it
  // once the scroll lands (or after a safety timeout).
  const isAnimatingRef = useRef(false);
  const targetSectionRef = useRef(0);
  const animTimerRef = useRef<number>(0);

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = Math.max(0, Math.min(index, 5));
    if (target === activeSectionRef.current) return;
    targetSectionRef.current = target;
    isAnimatingRef.current = true;
    clearTimeout(animTimerRef.current);
    animTimerRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
    const slideWidth = container.clientWidth;
    container.scrollTo({ left: slideWidth * target, behavior: "smooth" });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

      // Don't hijack arrow keys while typing in a field (caret movement).
      const ae = document.activeElement as HTMLElement | null;
      if (
        ae &&
        (ae.tagName === "INPUT" ||
          ae.tagName === "TEXTAREA" ||
          ae.isContentEditable)
      ) {
        return;
      }

      // We own horizontal navigation — stop the browser's native scroll/snap
      // from also moving the container (a key cause of double-advancing).
      e.preventDefault();

      // Ignore auto-repeat from a held key and presses mid-transition.
      if (e.repeat || isAnimatingRef.current) return;

      const current = activeSectionRef.current;
      if (e.key === "ArrowRight") {
        scrollToSection(current + 1);
      } else {
        scrollToSection(current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // rAF-throttle the scroll handler and only setState when the section
    // actually changes, so a swipe doesn't fire a re-render storm.
    let ticking = false;
    const update = () => {
      ticking = false;
      const slideWidth = container.clientWidth;
      const newSection = Math.round(container.scrollLeft / slideWidth);
      if (newSection !== activeSectionRef.current) {
        setActiveSection(newSection);
      }
      // Release the navigation lock once the programmatic scroll has landed.
      if (isAnimatingRef.current && newSection === targetSectionRef.current) {
        isAnimatingRef.current = false;
        clearTimeout(animTimerRef.current);
      }
    };
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const projects = [
    {
      title: "SYNERA",
      description:
        "E-commerce Platform dedicated for algerian female community",
      status: "COMPLETED",
      url: "#",
      tech: ["React", "PostgreSQL", "Supabase", "Netlify"],
    },
    {
      title: "Hyperconverged Cloud Infrastructure (HCI)",
      description:
        "Architected and deployed a highly available hyperconverged infrastructure, integrating compute, storage, and networking into a single software-defined pool",
      status: "IN DEV",
      url: "#",
      tech: ["Proxmox", "Ceph", "KVM", "Open vSwitch", "Ansible"],
    },
    {
      title: "WIKAYANET",
      description:
        "A Secure web platform using Django and ExpressJS to deliver real-time security updates and news.",
      status: "COMPLETED",
      url: "#",
      tech: ["Django", "HTML/CSS", "Express", "JavaScript"],
    },
    {
      title: "INSECURE-MAIL",
      description:
        "A newsletter mailing app that sends cybersecurity relevant mails to subscribers 3 times a week.",
      status: "IN DEV",
      url: "#",
      tech: ["Go", "Fiber", "Docker", "Mailgun", "n8n"],
    },
  ];

  const internships = [
    {
      company: "SONATRACH",
      role: "Infrastructure and Networks Engineer",
      period: "JAN 2026 - PRESENT",
      context: "and deployment of an HCI based on open source technologies.",
      status: "ONGOING",
    },
    {
      company: "AMANA",
      role: "Microservices Monitoring Intern",
      period: "JUN 2025 - AUG 2025",
      context:
        "Implemented a Monitoring solution for microservices, and databases",
      status: "COMPLETED",
    },
    {
      company: "CERIST",
      role: "Intern Web Developer & Web Security Engineer",
      period: "JAN 2024 - MAY 2024",
      context:
        "Developed a Web app while Implementing web security best practices",
      status: "COMPLETED",
    },
  ];

  const clubs = [
    {
      name: "GDG ESI ALGER",
      role: "Core Team Member",
      period: "OCT 2024 - PRESENT",
      context: "Developper at Google Developer Group community activities",
    },
    {
      name: "CELEC USTHB",
      role: "Communication Team Member",
      period: "OCT 2022 - OCT 2024",
      context: "Electronics and embedded systems club",
    },
    {
      name: "SHELLMATES CLUB ESI ALGER",
      role: "External Relations Member",
      period: "NOV 2024 - PRESENT",
      context: "Cybersecurity and CTF competitions",
    },
  ];

  const domains = [
    {
      name: "Web Development",
      tools: "React, Next.js, Django, Express, TailwindCSS",
      color: "#3b82f6",
    },
    {
      name: "Web Security",
      tools: "OWASP ZAP, Burp Suite, Penetration Testing",
      color: "#ef4444",
    },
    {
      name: "Cloud & DevOps",
      tools: "GCP, AWS, Docker, Kubernetes, Terraform, Git/Github, CI/CD",
      color: "#f59e0b",
    },
    {
      name: "Networking",
      tools: "TCP/IP, DNS, VPN, Network Design, SSH",
      color: "#14b8a6",
    },
    {
      name: "Linux Administration",
      tools: "Ubuntu Server, VPS, Bash, systemd, iptables, Ansible",
      color: "#a855f7",
    },
  ];

  // Per-technology hover colors
  const techHoverColors: Record<string, string> = {
    // Languages
    Python: "#3776AB",
    Go: "#00ADD8",
    JavaScript: "#F7DF1E",
    PHP: "#777BB4",
    "C#": "#239120",
    Java: "#ED8B00",
    Lua: "#2C2D72",
    YAML: "#CB171E",
    // Frameworks
    Django: "#092E20",
    "Next.js": "#808080",
    React: "#61DAFB",
    Express: "#68A063",
    Flask: "#888888",
    TailwindCSS: "#06B6D4",
    // Tools
    Docker: "#2496ED",
    Kubernetes: "#326CE5",
    Terraform: "#7B42BC",
    Jenkins: "#D24939",
    Nginx: "#009639",
    Git: "#F05032",
    SSH: "#4EAA25",
    "OWASP ZAP": "#F68D2E",
    // Project-specific techs
    PostgreSQL: "#336791",
    Supabase: "#3ECF8E",
    Netlify: "#00C7B7",
    Proxmox: "#E57000",
    Ceph: "#EF5C55",
    KVM: "#3776AB",
    "Open vSwitch": "#00599C",
    Ansible: "#EE0000",
    "HTML/CSS": "#E34F26",
    Fiber: "#00ADD8",
    Mailgun: "#F06B66",
    n8n: "#EA4B71",
  };

  const languages = [
    "Python",
    "Go",
    "JavaScript",
    "PHP",
    "C#",
    "Java",
    "Lua",
    "YAML",
  ];
  const frameworks = [
    "Django",
    "Next.js",
    "React",
    "Express",
    "Flask",
    "TailwindCSS",
  ];
  const tools = [
    "Docker",
    "Kubernetes",
    "Terraform",
    "Jenkins",
    "Nginx",
    "Git",
    "SSH",
    "OWASP ZAP",
  ];

  const sections = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Contact",
  ];

  const bgClass = isDark ? "bg-black" : "bg-white";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white" : "border-black";
  const mutedClass = isDark ? "text-white/50" : "text-black/50";
  const bgSecondaryClass = isDark ? "bg-white" : "bg-black";
  const itemBgClass = isDark ? "bg-white/[0.05]" : "bg-black/[0.05]";

  // Accent color classes for light mode
  const accentBorderClass = isDark ? "border-white" : "border-[#2563eb]";
  const accentTextClass = isDark ? "text-white" : "text-[#2563eb]";
  const accentHoverShadow = isDark
    ? "0 0 8px rgba(255, 255, 255, 0.6)"
    : "0 0 8px rgba(37, 99, 235, 0.5)";

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") {
      return isDark
        ? "border-[#4ade80] text-[#4ade80]"
        : "border-[#16a34a] bg-[#16a34a]/10 text-[#15803d] font-medium";
    }
    if (status === "IN DEV" || status === "ONGOING") {
      return isDark
        ? "border-[#fbbf24] text-[#fbbf24]"
        : "border-[#d97706] bg-[#d97706]/10 text-[#b45309] font-medium";
    }
    return borderClass;
  };

  const getSkillTagStyle = (name: string) => {
    const color = techHoverColors[name];
    if (!color) return {};
    return {
      "--hover-color": color,
    } as React.CSSProperties;
  };

  // Reusable skill tag hover handlers
  const skillTagHoverHandlers = (name: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLSpanElement>) => {
      const color = techHoverColors[name];
      if (color) {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
        e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
        e.currentTarget.style.backgroundColor = `${color}30`;
        e.currentTarget.style.transform = "translateY(-1px) scale(1.05)";
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLSpanElement>) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.color = "";
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.backgroundColor = "";
      e.currentTarget.style.transform = "";
    },
  });

  const skillTagBaseClass = `skill-tag border ${borderClass} px-3 py-1.5 rounded text-sm transition-all duration-150`;

  // Slide transition variants
  const slideVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };

  return (
    <div
      className={`relative w-screen h-screen ${bgClass} ${textClass} font-mono overflow-hidden`}
    >
      {/* Dot Grid Background with parallax */}
      <DotGrid isDark={isDark} />

      {/* Custom Cursor */}
      <CustomCursor isDark={isDark} />

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 ${isDark ? "bg-black/70" : "bg-white/70"} backdrop-blur-md border-b ${borderClass}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex gap-3 sm:gap-8 portfolio-nav-links overflow-x-auto">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(index)}
                className={`text-xs sm:text-sm tracking-wider transition-all duration-150 whitespace-nowrap ${
                  activeSection === index
                    ? `opacity-100 ${!isDark ? "text-[#2563eb]" : ""}`
                    : "opacity-40"
                } hover:opacity-100`}
              >
                {section}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative p-2 rounded-lg hover:opacity-80 transition-opacity duration-150 flex-shrink-0 overflow-hidden group w-[34px] h-[34px]"
          >
            {/* Spinning gradient border */}
            <div className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#2563eb_100%)] opacity-80" />

            {/* Inner button background */}
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

      {/* Side Navigation Arrows */}
      {activeSection > 0 && (
        <button
          onClick={() => scrollToSection(activeSection - 1)}
          className={`fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border ${borderClass} ${isDark ? "bg-black/40" : "bg-white/40"} opacity-40 hover:opacity-100 transition-opacity duration-150`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {activeSection < 5 && (
        <button
          onClick={() => scrollToSection(activeSection + 1)}
          className={`fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border ${borderClass} ${isDark ? "bg-black/40" : "bg-white/40"} opacity-40 hover:opacity-100 transition-opacity duration-150`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-scroll snap-x snap-mandatory h-screen pt-14 sm:pt-16"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Slide 1 - Hero/Home */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <AnimatePresence mode="wait">
            {activeSection === 0 && (
              <motion.div
                key="home"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-6xl"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4 sm:mb-6"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  BOUZARA ZAKARIA
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`text-base sm:text-lg md:text-xl font-light tracking-wide mb-6 sm:mb-8 ${mutedClass}`}
                >
                  Networks & Systems Engineer / DevOps
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`w-full md:w-2/3 h-px ${isDark ? "bg-white" : "bg-black"} mb-8 sm:mb-12`}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className={`relative w-full md:w-2/3 border ${borderClass} p-4 rounded-lg bg-transparent`}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything... (this feature is coming up soon)"
                    className={`w-full bg-transparent outline-none ${textClass} font-mono placeholder:${mutedClass}`}
                  />
                  {inputValue === "" && (
                    <span
                      className={`caret-blink absolute right-4 top-1/2 -translate-y-1/2 w-2 h-5 ${bgSecondaryClass}`}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Slide 2 - About */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center overflow-hidden group">
                {/* Counter-clockwise spinning border */}
                <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_50%_50%,#2563eb_0%,transparent_30%,transparent_100%)] opacity-80" />

                <div
                  className={`absolute inset-[3px] rounded-full overflow-hidden ${bgClass} z-10 flex items-center justify-center`}
                >
                  <img
                    src="https://res.cloudinary.com/dllozpfmy/image/upload/v1776035109/pfp_niw2bg.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".pfp-fallback")) {
                        const fallback = document.createElement("span");
                        fallback.className =
                          "pfp-fallback text-5xl sm:text-6xl font-bold opacity-30";
                        fallback.textContent = "BZ";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                ABOUT
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 font-light text-base sm:text-lg leading-relaxed">
                <p>
                  Networks & Systems Engineer specializing in infrastructure
                  automation and cloud-native technologies.
                </p>
                <p>
                  Building scalable, secure, and resilient distributed systems
                  with a focus on DevOps practices and modern orchestration.
                </p>
                <p>
                  Experienced in architecting enterprise solutions across hybrid
                  cloud environments.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
                <motion.a
                  href="https://github.com/zakaria-bouzara"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                  whileHover={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.15)",
                    boxShadow: isDark
                      ? "0 0 8px rgba(255, 255, 255, 0.6)"
                      : "0 0 8px rgba(0, 0, 0, 0.4)",
                    transition: { duration: 0.12, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-center gap-2 border ${borderClass} px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide about-btn`}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/zakaria-bouzara"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: "rgba(10, 102, 194, 0.1)" }}
                  whileHover={{
                    backgroundColor: "rgba(10, 102, 194, 0.2)",
                    boxShadow: "0 0 8px rgba(10, 102, 194, 0.5)",
                    transition: { duration: 0.12, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-center gap-2 border px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide about-btn ${isDark ? "border-white hover:border-[#0A66C2] hover:text-[#0A66C2]" : "border-[#0A66C2] text-[#0A66C2]"}`}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </motion.a>
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(22, 163, 74, 0.1)",
                  }}
                  whileHover={{
                    backgroundColor: isDark
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(22, 163, 74, 0.2)",
                    boxShadow: isDark
                      ? "0 0 8px rgba(34, 197, 94, 0.5)"
                      : "0 0 8px rgba(22, 163, 74, 0.5)",
                    transition: { duration: 0.12, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-center gap-2 border px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide about-btn ${isDark ? "border-white hover:border-[#22c55e] hover:text-[#22c55e]" : "border-[#16a34a] text-[#16a34a]"}`}
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3 - Skills */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-6xl">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              SKILLS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Left: Domains */}
              <div>
                <h3 className={`text-sm tracking-widest mb-6 ${mutedClass}`}>
                  DOMAINS
                </h3>
                <div className="space-y-4">
                  {domains.map((domain, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1, duration: 0.4 },
                      }}
                      viewport={{ once: false, amount: 0.3 }}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={
                        { "--domain-color": domain.color } as React.CSSProperties
                      }
                      className={`domain-item group border-l-2 ${isDark ? borderClass : "border-[#2563eb]"} pl-4 py-2 rounded-r-md`}
                    >
                      <h4 className="domain-name font-bold mb-1">
                        {domain.name}
                      </h4>
                      <p className={`text-sm ${mutedClass}`}>{domain.tools}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Languages, Frameworks, Tools */}
              <div className="space-y-8">
                <div>
                  <h3 className={`text-sm tracking-widest mb-4 ${mutedClass}`}>
                    LANGUAGES
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className={skillTagBaseClass}
                        style={getSkillTagStyle(lang)}
                        {...skillTagHoverHandlers(lang)}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm tracking-widest mb-4 ${mutedClass}`}>
                    FRAMEWORKS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.map((framework) => (
                      <span
                        key={framework}
                        className={skillTagBaseClass}
                        style={getSkillTagStyle(framework)}
                        {...skillTagHoverHandlers(framework)}
                      >
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm tracking-widest mb-4 ${mutedClass}`}>
                    TOOLS & INFRA
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className={skillTagBaseClass}
                        style={getSkillTagStyle(tool)}
                        {...skillTagHoverHandlers(tool)}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4 - Projects */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-6xl">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-16"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              PROJECTS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {projects.map((project, index) => (
                <motion.a
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.4 },
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{
                    boxShadow: isDark
                      ? "0 0 12px rgba(255, 255, 255, 0.4)"
                      : "0 0 12px rgba(37, 99, 235, 0.35)",
                    transition: { duration: 0.12, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex flex-col border ${borderClass} p-5 sm:p-6 rounded-lg group cursor-pointer no-underline ${textClass}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className={`text-xs border px-2 py-1 rounded ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm font-light mb-4 flex-grow">
                    {project.description}
                  </p>
                  {/* Tech tags — pinned to bottom */}
                  <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`text-xs border ${borderClass} px-2 py-0.5 rounded transition-all duration-150 ${
                          isDark ? "opacity-90" : "opacity-80"
                        }`}
                        style={getSkillTagStyle(t)}
                        {...skillTagHoverHandlers(t)}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end opacity-50 group-hover:opacity-100 transition-opacity duration-150">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 15L15 5M15 5H5M15 5V15" />
                    </svg>
                  </div>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                viewport={{ once: false, amount: 0.3 }}
                className={`border border-dashed ${borderClass} p-5 sm:p-6 rounded-lg flex items-center justify-center col-span-1 md:col-span-2`}
              >
                <p className="text-sm font-light tracking-wide">
                  2 OTHER PROJECTS ARE UNDER CONSTRUCTION
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Slide 5 - Experience */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-6xl">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-16"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              EXPERIENCE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {/* Internships */}
              <div>
                <h3
                  className={`text-sm tracking-widest mb-6 sm:mb-8 ${mutedClass}`}
                >
                  INTERNSHIPS
                </h3>
                <div
                  className={`relative pl-6 sm:pl-8 border-l ${borderClass} space-y-10 sm:space-y-12`}
                >
                  {internships.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      viewport={{ once: false, amount: 0.3 }}
                      className="relative"
                    >
                      <div
                        className={`absolute -left-7 sm:-left-9 top-0 w-3 h-3 ${bgSecondaryClass} rounded-full`}
                      />
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className="text-lg sm:text-xl font-bold"
                            style={{
                              fontFamily:
                                "system-ui, -apple-system, sans-serif",
                            }}
                          >
                            {exp.company}
                          </h4>
                          <span
                            className={`text-xs border px-2 py-1 rounded flex-shrink-0 ${getStatusColor(exp.status)}`}
                          >
                            {exp.status}
                          </span>
                        </div>
                        <p className="text-sm font-light">{exp.role}</p>
                        <p className={`text-xs ${mutedClass}`}>{exp.context}</p>
                        <p className="text-xs tracking-widest pt-2">
                          {exp.period}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scientific Clubs — no ONGOING status badge */}
              <div>
                <h3
                  className={`text-sm tracking-widest mb-6 sm:mb-8 ${mutedClass}`}
                >
                  SCIENTIFIC CLUBS
                </h3>
                <div
                  className={`relative pl-6 sm:pl-8 border-l ${borderClass} space-y-10 sm:space-y-12`}
                >
                  {clubs.map((club, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      viewport={{ once: false, amount: 0.3 }}
                      className="relative"
                    >
                      <div
                        className={`absolute -left-7 sm:-left-9 top-0 w-3 h-3 ${bgSecondaryClass} rounded-full`}
                      />
                      <div className="space-y-2">
                        <h4
                          className="text-lg sm:text-xl font-bold"
                          style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                          }}
                        >
                          {club.name}
                        </h4>
                        <p className="text-sm font-light">{club.role}</p>
                        <p className={`text-xs ${mutedClass}`}>
                          {club.context}
                        </p>
                        <p className="text-xs tracking-widest pt-2">
                          {club.period}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 6 - Contact */}
        <section className="min-w-full w-screen h-full snap-start flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              GET IN TOUCH
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`text-sm sm:text-base mb-8 sm:mb-12 ${mutedClass}`}
            >
              Open to collaborations and freelance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`border ${borderClass} rounded-lg mb-8 sm:mb-12 overflow-hidden`}
            >
              {[
                {
                  label: "EMAIL",
                  value: "Bouzara.Zakaria.25@gmail.com",
                  href: "mailto:Bouzara.Zakaria.25@gmail.com",
                },
                {
                  label: "LINKEDIN",
                  value: "linkedin.com/in/zakaria-bouzara",
                  href: "https://linkedin.com/in/zakaria-bouzara",
                },
                {
                  label: "PORTFOLIO",
                  value: "https://zakaria-resume.netlify.app/",
                  href: "https://zakaria-resume.netlify.app/",
                },
                { label: "PHONE", value: "+213 557520413", href: undefined },
                {
                  label: "LOCATION",
                  value: "Algiers, Algeria",
                  href: undefined,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 px-5 sm:px-8 py-4 sm:py-5 ${index !== 4 ? `border-b ${borderClass}` : ""}`}
                >
                  <div
                    className={`text-left text-xs sm:text-sm tracking-widest ${mutedClass}`}
                  >
                    {item.label}
                  </div>
                  <div className="text-right text-sm sm:text-base font-light">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("mailto") ? "_self" : "_blank"
                        }
                        rel="noopener noreferrer"
                        className={`underline underline-offset-4 decoration-1 opacity-70 hover:opacity-100 transition-opacity duration-150 ${textClass}`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`text-xs ${mutedClass}`}
            >
              BOUZARA ZAKARIA · 2026
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
