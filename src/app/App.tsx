import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import DotGrid from "./components/DotGrid";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [prevSection, setPrevSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && activeSection < 5) {
        scrollToSection(activeSection + 1);
      } else if (e.key === "ArrowLeft" && activeSection > 0) {
        scrollToSection(activeSection - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newSection = Math.round(scrollLeft / slideWidth);
      if (newSection !== activeSection) {
        setPrevSection(activeSection);
        setActiveSection(newSection);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setPrevSection(activeSection);
    const slideWidth = container.clientWidth;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  };

  const projects = [
    {
      title: "SYNERA",
      description:
        "E-commerce Platform dedicated for algerian female community",
      status: "COMPLETED",
    },
    {
      title: "HCI INFRASTRUCTURE",
      description:
        "Deployement of a private Hyperconverged infrastructure deployment For Sonatrach",
      status: "IN DEV",
    },
    {
      title: "WIKAYANET",
      description:
        "A cyberSecurity news Platefore that has been built for CERIST",
      status: "COMPLETED",
    },
    {
      title: "INSECURE-MAIL",
      description: "Security research and penetration testing",
      status: "IN DEV",
    },
  ];

  const internships = [
    {
      company: "SONATRACH",
      role: "Networks & Systems Engineer",
      period: "FEB 2023 - PRESENT",
      context: "Infrastructure automation and cloud operations",
      status: "ONGOING",
    },
    {
      company: "AMANA",
      role: "DevOps Engineer",
      period: "JUN 2022 - AUG 2022",
      context: "CI/CD pipeline development and containerization",
      status: "COMPLETED",
    },
    {
      company: "CERIST",
      role: "Research Engineer",
      period: "JAN 2021 - MAY 2021",
      context: "Network security and systems research",
      status: "COMPLETED",
    },
  ];

  const clubs = [
    {
      name: "CELEC USTHB",
      role: "Member",
      period: "OCT 2022 - PRESENT",
      context: "Electronics and embedded systems club",
    },
    {
      name: "GDG ESI ALGER",
      role: "Core Team Member",
      period: "OCT 2024 - PRESENT",
      context: "Google Developer Group community activities",
    },
    {
      name: "SHELLMATES CLUB ESI ALGER",
      role: "Member",
      period: "NOV 2024 - PRESENT",
      context: "Cybersecurity and CTF competitions",
    },
  ];

  const domains = [
    {
      name: "Web Development",
      tools: "React, Next.js, Django, Express, TailwindCSS",
    },
    {
      name: "Web Security",
      tools: "OWASP ZAP, Burp Suite, Penetration Testing",
    },
    { name: "Cloud Services", tools: "Azure, GCP, AWS, Cloud Architecture" },
    { name: "Networking", tools: "TCP/IP, DNS, VPN, Network Design, SSH" },
    { name: "DevOps", tools: "Docker, Kubernetes, Terraform, Jenkins, CI/CD" },
    {
      name: "Linux Administration",
      tools: "Ubuntu Server, VPS, Bash, systemd, iptables, Ansible",
    },
  ];

  // Per-technology hover colors
  const techHoverColors: Record<string, string> = {
    // Languages
    Python: '#3776AB',
    Go: '#00ADD8',
    JavaScript: '#F7DF1E',
    PHP: '#777BB4',
    'C#': '#239120',
    Java: '#ED8B00',
    Lua: '#2C2D72',
    YAML: '#CB171E',
    // Frameworks
    Django: '#092E20',
    'Next.js': '#808080',
    React: '#61DAFB',
    Express: '#68A063',
    Flask: '#888888',
    TailwindCSS: '#06B6D4',
    // Tools
    Docker: '#2496ED',
    Kubernetes: '#326CE5',
    Terraform: '#7B42BC',
    Jenkins: '#D24939',
    Nginx: '#009639',
    Git: '#F05032',
    SSH: '#4EAA25',
    'OWASP ZAP': '#F68D2E',
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
  const textSecondaryClass = isDark ? "text-black" : "text-white";

  // Accent color classes for light mode
  const accentBorderClass = isDark ? "border-white" : "border-[#2563eb]";
  const accentTextClass = isDark ? "text-white" : "text-[#2563eb]";
  const accentHoverShadow = isDark
    ? "0 0 8px rgba(255, 255, 255, 0.6)"
    : "0 0 8px rgba(37, 99, 235, 0.5)";

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') {
      return isDark
        ? 'border-[#4ade80] text-[#4ade80]'
        : 'border-[#16a34a] bg-[#16a34a]/10 text-[#15803d] font-medium';
    }
    if (status === 'IN DEV' || status === 'ONGOING') {
      return isDark
        ? 'border-[#fbbf24] text-[#fbbf24]'
        : 'border-[#d97706] bg-[#d97706]/10 text-[#b45309] font-medium';
    }
    return borderClass;
  };

  const getSkillTagStyle = (name: string) => {
    const color = techHoverColors[name];
    if (!color) return {};
    return {
      '--hover-color': color,
    } as React.CSSProperties;
  };

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
      {/* Dot Grid Background */}
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
            className={`p-2 border ${borderClass} rounded-lg hover:opacity-70 transition-opacity duration-150 flex-shrink-0`}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

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
                    placeholder="Ask me anything... (this feature is coming up soon"
                    className={`w-full bg-transparent outline-none ${textClass} font-mono placeholder:${mutedClass}`}
                  />
                  {inputValue === "" && (
                    <span
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-5 ${bgSecondaryClass} transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
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
              <div
                className={`w-48 h-48 sm:w-64 sm:h-64 border ${borderClass} rounded-full flex items-center justify-center overflow-hidden`}
              >
                <img
                  src="/pfp.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback: show initials if image not found
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".pfp-fallback")) {
                      const fallback = document.createElement("span");
                      fallback.className =
                        "pfp-fallback text-4xl sm:text-5xl font-bold opacity-30";
                      fallback.textContent = "BZ";
                      parent.appendChild(fallback);
                    }
                  }}
                />
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
                <motion.button
                  whileHover={{ boxShadow: accentHoverShadow }}
                  className={`border ${isDark ? borderClass : accentBorderClass} px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide transition-all duration-150 ${!isDark ? accentTextClass : ""}`}
                >
                  GitHub
                </motion.button>
                <motion.button
                  whileHover={{ boxShadow: accentHoverShadow }}
                  className={`border ${isDark ? borderClass : accentBorderClass} px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide transition-all duration-150 ${!isDark ? accentTextClass : ""}`}
                >
                  LinkedIn
                </motion.button>
                <motion.button
                  whileHover={{ boxShadow: accentHoverShadow }}
                  className={`border ${isDark ? borderClass : accentBorderClass} px-5 sm:px-6 py-2 rounded-lg text-sm tracking-wide transition-all duration-150 ${!isDark ? accentTextClass : ""}`}
                >
                  Resume
                </motion.button>
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
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      viewport={{ once: false, amount: 0.3 }}
                      className={`border-l-2 ${isDark ? borderClass : "border-[#2563eb]"} pl-4 py-2`}
                    >
                      <h4 className="font-bold mb-1">{domain.name}</h4>
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
                        className={`skill-tag border ${borderClass} px-3 py-1.5 rounded text-sm transition-all duration-150`}
                        style={getSkillTagStyle(lang)}
                        onMouseEnter={(e) => {
                          const color = techHoverColors[lang];
                          if (color) {
                            e.currentTarget.style.borderColor = color;
                            e.currentTarget.style.color = color;
                            e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '';
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.transform = '';
                        }}
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
                        className={`skill-tag border ${borderClass} px-3 py-1.5 rounded text-sm transition-all duration-150`}
                        style={getSkillTagStyle(framework)}
                        onMouseEnter={(e) => {
                          const color = techHoverColors[framework];
                          if (color) {
                            e.currentTarget.style.borderColor = color;
                            e.currentTarget.style.color = color;
                            e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '';
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.transform = '';
                        }}
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
                        className={`skill-tag border ${borderClass} px-3 py-1.5 rounded text-sm transition-all duration-150`}
                        style={getSkillTagStyle(tool)}
                        onMouseEnter={(e) => {
                          const color = techHoverColors[tool];
                          if (color) {
                            e.currentTarget.style.borderColor = color;
                            e.currentTarget.style.color = color;
                            e.currentTarget.style.boxShadow = `0 0 8px ${color}40`;
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '';
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.transform = '';
                        }}
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{
                    boxShadow: isDark
                      ? "0 0 12px rgba(255, 255, 255, 0.4)"
                      : "0 0 12px rgba(37, 99, 235, 0.35)",
                  }}
                  className={`border ${borderClass} p-5 sm:p-6 rounded-lg transition-all duration-150 group cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-4">
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
                  <p className="text-sm font-light mb-6">
                    {project.description}
                  </p>
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
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                viewport={{ once: false, amount: 0.3 }}
                className={`border border-dashed ${borderClass} p-5 sm:p-6 rounded-lg flex items-center justify-center col-span-1 md:col-span-2`}
              >
                <p className="text-sm font-light tracking-wide">
                  2 PROJECTS UNDER CONSTRUCTION
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
          <div className="w-full max-w-2xl text-center">
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
              Open to internships, collaborations and freelance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`border ${borderClass} rounded-lg mb-8 sm:mb-12 overflow-hidden`}
            >
              {[
                { label: "EMAIL", value: "zakaria.bouzara@example.com" },
                { label: "LINKEDIN", value: "linkedin.com/in/zakaria-bouzara" },
                { label: "PORTFOLIO", value: "bouzara.dev" },
                { label: "PHONE", value: "+213 555 123 456" },
                { label: "LOCATION", value: "Algiers, Algeria" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 px-4 sm:px-6 py-3 sm:py-4 ${index !== 4 ? `border-b ${borderClass}` : ""}`}
                >
                  <div
                    className={`text-left text-xs tracking-widest ${mutedClass}`}
                  >
                    {item.label}
                  </div>
                  <div className="text-right text-sm font-light">
                    {item.value}
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
