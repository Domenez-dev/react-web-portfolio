import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  skills: string[];
}

export function SkillCard({ icon, title, skills }: SkillCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="text-blue-600 mb-4 transform transition-transform duration-300 hover:scale-110">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill} className="text-gray-600">{skill}</li>
        ))}
      </ul>
    </div>
  );
}