import React from 'react';

interface EducationCardProps {
  degree: string;
  school: string;
  year?: string;
  status?: string;
}

export function EducationCard({ degree, school, year, status }: EducationCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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