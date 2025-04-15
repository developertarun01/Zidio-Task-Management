export const getPriorityColor = (priority, darkMode) => {
    const base = darkMode
      ? {
          High: 'bg-red-900 border-red-600 text-red-200',
          Medium: 'bg-yellow-900 border-yellow-600 text-yellow-200',
          Low: 'bg-green-900 border-green-600 text-green-200',
        }
      : {
          High: 'bg-red-100 border-red-400 text-red-800',
          Medium: 'bg-yellow-100 border-yellow-400 text-yellow-800',
          Low: 'bg-green-100 border-green-400 text-green-800',
        };
  
    return base[priority] || 'bg-gray-100 border-gray-400 text-gray-800';
  };
  