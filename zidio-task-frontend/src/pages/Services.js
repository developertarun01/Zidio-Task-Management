import React from 'react';
import { ClipboardList, GitBranch, Users, BarChart } from 'lucide-react';

const Services = () => {
  return (
    <div className="flex flex-col items-center bg-white px-4 py-10">
      <div className="bg-blue-50 p-6 md:p-10 rounded-2xl shadow-lg max-w-6xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-8">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { title: 'Task Management', icon: <ClipboardList className="w-12 h-12 text-black" />, description: 'Comprehensive task tracking and management solutions with real-time updates and collaborative features.' },
            { title: 'Project Planning', icon: <GitBranch className="w-12 h-12 text-black" />, description: 'Strategic project planning tools with deadline management and milestone tracking capabilities.' },
            { title: 'Team Collaboration', icon: <Users className="w-12 h-12 text-black" />, description: 'Enhanced team communication features with real-time updates and progress tracking.' },
            { title: 'Analytics & Reporting', icon: <BarChart className="w-12 h-12 text-black" />, description: 'Detailed insights and analytics to track project progress and team performance.' }
          ].map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-all duration-300 hover:shadow-xl group">
              <h2 className="text-2xl font-semibold text-center text-blue-600 mb-3">{service.title}</h2>
              <div className="flex justify-center mb-4">{service.icon}</div>
              <p className="text-black text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center md:text-left">Why Choose Zidio?</h2>
          <ul className="space-y-3 text-black text-center md:text-left">
            <li>✓ Intuitive and user-friendly interface</li>
            <li>✓ Real-time collaboration and updates</li>
            <li>✓ Secure and reliable platform</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Customizable workflows</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 italic text-lg">
            "Empowering teams to achieve more through efficient task management and seamless collaboration."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
