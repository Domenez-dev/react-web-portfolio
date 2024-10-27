import React, { useState } from 'react';
import { Github, Linkedin, Mail, Menu, X, ExternalLink, Code, Monitor, Database, Cloud, Users, Palette, Video, Award } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

        {/* Mobile menu */}
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

      {/* Hero Section */}
      <section id="about" className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Full Stack Developer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Passionate about creating efficient solutions with 3 years of experience in Django and React development.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/domenez-dev" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/bouzara-zakaria" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard
              icon={<Code />}
              title="Programming Languages"
              skills={['Python', 'JavaScript', 'C']}
            />
            <SkillCard
              icon={<Monitor />}
              title="Frameworks"
              skills={['React', 'Django', 'Flask', 'Bootstrap']}
            />
            <SkillCard
              icon={<Database />}
              title="Databases"
              skills={['SQL', 'Database Design', 'Optimization']}
            />
            <SkillCard
              icon={<Cloud />}
              title="Cloud & DevOps"
              skills={['AWS', 'Docker', 'Git']}
            />
            <SkillCard
              icon={<Users />}
              title="Soft Skills"
              skills={['Teamwork', 'Problem Solving', 'Communication']}
            />
            <SkillCard
              icon={<Palette />}
              title="Design"
              skills={['Figma', 'UI/UX', 'Web Design']}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              title="Wikayanet"
              description="A web platform using Django and HTML to deliver real-time security updates and news."
              tags={['Django', 'HTML', 'Real-time']}
            />
            <ProjectCard
              title="Content Aggregator Bot"
              description="A bot that utilizes web scraping to gather and organize articles from various websites."
              tags={['Python', 'Web Scraping', 'Automation']}
            />
            <ProjectCard
              title="YouTube Downloader"
              description="A Flask-based web application for downloading YouTube videos with URL input."
              tags={['Flask', 'Python', 'Frontend']}
            />
            <ProjectCard
              title="Encrypted Messaging App"
              description="A secure messaging app with end-to-end encryption (In Development)."
              tags={['Security', 'Real-time', 'Encryption']}
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-8">
            <ExperienceCard
              title="Intern Web Developer & Web Security Engineer"
              company="CERIST (Research Center)"
              period="December 2023 – June 2024"
              description="Developed and secured web applications, implemented security protocols, and optimized web interfaces."
            />
            <ExperienceCard
              title="Development Team Member"
              company="Celec"
              period="Present"
              description="Contributing to IT projects and platform development, while also working as a video editor."
            />
            <ExperienceCard
              title="Team IT Member"
              company="OMC"
              period="Present"
              description="Created a landing page for registrations, streamlining the process for our community."
            />
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 bg-gray-50 px-4">
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

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-gray-600 mb-8">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 Bouzara Zakaria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function SkillCard({ icon, title, skills }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill} className="text-gray-600">{skill}</li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ title, description, tags }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ title, company, period, description }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-blue-600 mb-2">{company}</p>
      <p className="text-gray-500 text-sm mb-3">{period}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function EducationCard({ degree, school, year, status }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{degree}</h3>
      <p className="text-blue-600 mb-1">{school}</p>
      {status ? (
        <p className="text-gray-500">{status}</p>
      ) : (
        <p className="text-gray-500">Graduated: {year}</p>
      )}
    </div>
  );
}

export default App;