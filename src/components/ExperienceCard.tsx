import React from 'react';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

export function ExperienceCard({ title, company, period, description }: ExperienceCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-blue-600 mb-2">{company}</p>
      <p className="text-gray-500 text-sm mb-3">{period}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}