import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code,
  Server,
  Cloud,
  Shield,
  Database,
  Terminal,
  ChevronDown,
  Menu,
  X,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Globe,
} from "lucide-react";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const skills = {
    languages: [
      "Python",
      "Go",
      "JavaScript",
      "PHP",
      "Java",
      "C",
      "Lua",
      "YAML",
      "HTML/CSS",
      "SQL",
    ],
    frameworks: [
      "Django",
      "Next.js",
      "Express",
      "React",
      "Flask",
      "FastAPI",
      "Bootstrap",
      "TailwindCSS",
    ],
    tools: [
      "Git/GitHub",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Terraform",
      "NGINX",
      "Apache",
      "SSH",
    ],
    cloud: ["AWS", "Azure", "GCP", "DigitalOcean", "heroku", "Firebase"],
    domains: ["Web Security", "Cloud Services", "Automation", "Databases"],
  };

  const experience = [
    {
      title: "Intern Web Developer & Web Security Engineer",
      company: "CERIST",
      period: "Dec 2023 – Jun 2024",
      description:
        "Developed Wikayanet.dz, a platform for publishing cybersecurity news and articles, using Django and Express.js. \nResearched and implemented web security best practices to secure the application. \nCollaborated with senior engineers to ensure robust back-end systems and data protection practices.",
    },
    {
      title: "Development Team & Communications",
      company: "Celec (Club Electronique), USTHB",
      period: "Oct 2022 – Present",
      description:
        "Part of the Development Team and Communications (ex Video Editor). Developed forms with Svelte.js and joined internal hackathons.",
    },
    {
      title: "Developed Team Member",
      company: "Google Developer Group (GDG), ESI Alger",
      period: "Oct 2024 – Present",
      description:
        "Contributed to new events registration form Template using Next.js and participated in internal hackathons and coding challenges and currently a part from the club’s Development team.",
    },
    {
      title: "External Relationships department Member",
      company: "ShellMates Club, ESI Alger",
      period: "Nov 2024 – Present",
      description:
        "Contributing to development and security-focused initiatives. Worked in the External Relations team; contributed to securing sponsorships for the upcoming event: Hackini.",
    },
  ];

  const projects = [
    {
      title: "Wikayanet",
      description:
        "A web platform using Django and HTML to deliver real-time security updates and news.",
      tech: ["Django", "HTML", "Real-time"],
      status: "Completed",
    },
    {
      title: "VPN Manager",
      description:
        "A local hosted platform that manages VPN such as OpenVPN and WireGuard on infrastructure using IaaC.",
      tech: ["Terraform", "Go", "Docker", "GCP", "AWS"],
      status: "In Development",
    },
    {
      title: "Registrations form template",
      description: "A Template for Future GDG Events registrations form",
      tech: ["Next.js", "Google Cloud Console", "backend"],
      status: "Completed",
    },
    {
      title: "Insecure-mail",
      description:
        "A newsletter mailing app that sends cybersecurity relevant mails to subscribers 3 times a week.",
      tech: ["Go", "Fiber", "Docker", "mailGun"],
      status: "In Development",
    },
  ];

  const education = [
    {
      degree: "Master's Degree in Network and Distributed Systems",
      school: "University of USTHB, Algiers",
      period: "Sep 2024 – ongoing",
      status: "in progress",
    },
    {
      degree: "Bachelor's Degree in Computer Science",
      school: "University of USTHB",
      period: "Sep 2021 – Jun 2024",
      status: "completed",
    },
    {
      degree: "Baccalaureate (Excellent Degree)",
      school: "Lycee Boudernane El Djilali, Tissemsilet",
      period: "Jun 2021",
      status: "completed",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Domenez-dev
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                "home",
                "about",
                "skills",
                "experience",
                "projects",
                "contact",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors duration-300 hover:text-blue-400 ${
                    activeSection === section
                      ? "text-blue-400"
                      : "text-slate-300"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                "home",
                "about",
                "skills",
                "experience",
                "projects",
                "contact",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block px-3 py-2 text-base font-medium capitalize text-slate-300 hover:text-blue-400 transition-colors duration-300"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div
          className="text-center z-10 px-4 sm:px-6 lg:px-8"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent">
                Zakaria Bouzara
              </span>
            </h1>
            <div className="text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-8">
              <span className="inline-block animate-bounce">👨‍💻</span>
              <span className="ml-4">
                Junior DevOps Engineer & Web Developer
              </span>
            </div>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Passionate about cloud infrastructure, automation, and building
              secure, scalable applications. Constantly sharpening
              problem-solving skills through LeetCode challenges.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a
              href="https://github.com/domenez-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl backdrop-blur-sm border border-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/bouzara-zakaria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl backdrop-blur-sm border border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-xl backdrop-blur-sm border border-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <ExternalLink size={20} />
              <span>Resume</span>
            </a>
          </div>

          <button
            onClick={() => scrollToSection("about")}
            className="animate-bounce inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-300"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                I'm a passionate DevOps Engineer and Web Developer with a
                background in cloud infrastructure, automation, and web
                security. I excel in building scalable and optimized solutions
                using modern technologies and best practices.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Currently pursuing a Master's degree in Network and Distributed
                Systems while actively contributing to various tech communities
                and working on innovative projects that bridge the gap between
                development and operations.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    2+
                  </div>
                  <div className="text-slate-400">Years Experience</div>
                </div>
                <div className="text-center p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    10+
                  </div>
                  <div className="text-slate-400">Technologies</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
                <MapPin className="text-orange-400" size={20} />
                <span className="text-slate-300">
                  Bab ezzouar, Algiers, Algeria
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
                <Mail className="text-blue-400" size={20} />
                <span className="text-slate-300">
                  bouzara.zakaria.25@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
                <Languages className="text-emerald-400" size={20} />
                <span className="text-slate-300">
                  Arabic (Native), English (Very Good), French (Good)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-orange-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Code className="text-blue-400" size={24} />
                <h3 className="text-xl font-semibold text-blue-400">
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-emerald-400" size={24} />
                <h3 className="text-xl font-semibold text-emerald-400">
                  Frameworks
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-orange-400" size={24} />
                <h3 className="text-xl font-semibold text-orange-400">Tools</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="text-purple-400" size={24} />
                <h3 className="text-xl font-semibold text-purple-400">Cloud</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.cloud.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-red-400" size={24} />
                <h3 className="text-xl font-semibold text-red-400">Domains</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.domains.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-teal-400" size={24} />
                <h3 className="text-xl font-semibold text-teal-400">
                  Certifications
                </h3>
              </div>
              <div className="space-y-2">
                <div className="text-teal-300 text-sm">
                  ICT-Towers: Basic Security (Sep 2022)
                </div>
                <div className="text-teal-300 text-sm">
                  DisHack: Project Management Hackathon (Nov 2023)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 mx-auto"></div>
          </div>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-slate-700/50 last:border-l-0"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                <div className="p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-orange-400">
                      {exp.title}
                    </h3>
                    <span className="text-slate-400 text-sm">{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase size={16} className="text-slate-400" />
                    <span className="text-slate-300 font-medium">
                      {exp.company}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-purple-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-purple-400">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto"></div>
          </div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-slate-700/50 last:border-l-0"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                <div className="p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-400">
                      {edu.degree}
                    </h3>
                    <span className="text-slate-400 text-sm">{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={16} className="text-slate-400" />
                    <span className="text-slate-300 font-medium">
                      {edu.school}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      edu.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {edu.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8"></div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, collaborating on
              projects, or just having a chat about technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a
              href="mailto:zakaria.bouzara@email.com"
              className="flex flex-col items-center gap-3 p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Mail className="text-blue-400" size={32} />
              <span className="text-slate-300">Email</span>
            </a>
            <a
              href="https://linkedin.com/in/bouzara-zakaria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Linkedin className="text-blue-400" size={32} />
              <span className="text-slate-300">LinkedIn</span>
            </a>
            <a
              href="https://github.com/domenez-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <Github className="text-emerald-400" size={32} />
              <span className="text-slate-300">GitHub</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <Globe className="text-orange-400" size={32} />
              <span className="text-slate-300">Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            © 2025 Zakaria Bouzara. Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
