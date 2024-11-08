import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Code,
  Monitor,
  Database,
  Cloud,
  Users,
  Palette,
  Instagram,
} from "lucide-react";
import { SkillCard } from "./components/SkillCard";
import { ProjectCard } from "./components/ProjectCard";
import { ExperienceCard } from "./components/ExperienceCard";
import { EducationCard } from "./components/EducationCard";
import pfp from "./assets/pfp.jpg";
console.log(pfp);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sections = [
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Education",
    "Contact",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bouzara Zakaria
            </span>

            <div className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {section}
                </a>
              ))}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {sections.map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase()}`}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="about" className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-float mb-8">
              <img
                src={pfp}
                alt="Developer Setup"
                className="w-64 h-64 object-cover rounded-full mx-auto shadow-xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 slide-in">
              Full Stack Developer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto slide-in">
              Passionate about creating efficient solutions with 3 years of
              experience in Django and React development.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/domenez-dev"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/bouzara-zakaria"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://instagram.com/bouzara.zakaria"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="mailto:bouzara.zakaria.25@gmail.com"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="skills"
        className={`py-16 bg-white px-4 transform transition-all duration-500 ${isVisible.skills ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard
              icon={<Code />}
              title="Programming Languages"
              skills={["Python", "Go", "JavaScript", "C", "PHP"]}
            />
            <SkillCard
              icon={<Monitor />}
              title="Frameworks"
              skills={["Django", "React", "Flask", "Next.js"]}
            />
            <SkillCard
              icon={<Database />}
              title="Databases"
              skills={["PostgreSQL", "MongoDB", "MySQL", "SQLite"]}
            />
            <SkillCard
              icon={<Cloud />}
              title="Cloud & DevOps"
              skills={["AWS", "Docker", "CI/CD", "Kubernetes"]}
            />
            <SkillCard
              icon={<Users />}
              title="Soft Skills"
              skills={[
                "Communication",
                "Problem Solving",
                "Team Collaboration",
                "Agile",
              ]}
            />
            <SkillCard
              icon={<Palette />}
              title="Design"
              skills={[
                "Figma",
                "UI/UX",
                "Responsive Design",
                "Tailwind CSS",
                "Material-UI",
              ]}
            />
          </div>
        </div>
      </section>

      <section
        id="projects"
        className={`py-16 bg-gray-50 px-4 transform transition-all duration-500 ${isVisible.projects ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              title="Wikayanet"
              description="A web platform using Django and HTML to deliver real-time security updates and news."
              tags={["Django", "HTML", "Real-time"]}
              image="https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800&auto=format&fit=crop&q=80"
            />
            <ProjectCard
              title="Content Aggregator Bot"
              description="A bot that utilizes web scraping to gather and organize articles from various websites."
              tags={["Python", "Web Scraping", "Automation"]}
              image="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&auto=format&fit=crop&q=80"
            />
            <ProjectCard
              title="YouTube Downloader"
              description="A Flask-based web application for downloading YouTube videos with URL input."
              tags={["Flask", "Python", "Frontend"]}
              image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80"
            />
            <ProjectCard
              title="Encrypted Messaging App"
              description="A secure messaging app with end-to-end encryption (In Development)."
              tags={["Security", "Real-time", "Encryption"]}
              image="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </section>

      <section
        id="experience"
        className={`py-16 bg-white px-4 transform transition-all duration-500 ${isVisible.experience ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-8">
            <ExperienceCard
              title="Intern Web Developer & Web Security Engineer"
              company="CERIST (Research Center)"
              period="December 2023 – June 2024"
              description="Led development of secure web applications, implemented robust security protocols, and optimized performance through modern web technologies."
            />
            <ExperienceCard
              title="Development Team Member"
              company="Celec"
              period="Present"
              description="Spearheading IT projects and platform development while contributing to video production and editing initiatives."
            />
            <ExperienceCard
              title="Team IT Member"
              company="OMC"
              period="Present"
              description="Designed and implemented an efficient landing page for registrations, enhancing user experience and streamlining community engagement."
            />
          </div>
        </div>
      </section>

      <section
        id="education"
        className={`py-16 bg-gray-50 px-4 transform transition-all duration-500 ${isVisible.education ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Education</h2>
          <div className="space-y-8">
            <EducationCard
              degree="Master's Degree in Network and Distributed Systems"
              school="University of USTHB"
              status="In Progress"
            />
            <EducationCard
              degree="Bachelor's Degree in Computer Science"
              school="University of USTHB"
              year="2024"
            />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`py-16 bg-white px-4 transform transition-all duration-500 ${isVisible.contact ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <div className="flex flex-col space-y-4 items-center">
            <a
              href="mailto:bouzara.zakaria.25@gmail.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Mail className="mr-2" size={20} />
              Send me an email
            </a>
            <a
              href="https://linkedin.com/in/bouzara-zakaria"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Linkedin className="mr-2" size={20} />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 Bouzara Zakaria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
