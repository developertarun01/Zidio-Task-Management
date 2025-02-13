import React from 'react';

const Services = () => {
  return (
    <div className="flex flex-col items-center p-10 bg-white">
      <div className="bg-blue-50 p-10 rounded-2xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Our Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Task Management</h2>
            <p className="text-gray-700">
              Comprehensive task tracking and management solutions with real-time updates and collaborative features.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Project Planning</h2>
            <p className="text-gray-700">
              Strategic project planning tools with deadline management and milestone tracking capabilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Team Collaboration</h2>
            <p className="text-gray-700">
              Enhanced team communication features with real-time updates and progress tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Analytics & Reporting</h2>
            <p className="text-gray-700">
              Detailed insights and analytics to track project progress and team performance.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Why Choose Zidio?</h2>
          <ul className="space-y-3 text-gray-700">
            <li>✓ Intuitive and user-friendly interface</li>
            <li>✓ Real-time collaboration and updates</li>
            <li>✓ Secure and reliable platform</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Customizable workflows</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 italic">
            "Empowering teams to achieve more through efficient task management and seamless collaboration."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;