const ActivityLogs = () => {
    const logs = [
      "You updated a task.",
      "Task 'Login Bug' marked as complete.",
      "New task 'Design Navbar' created."
    ];
  
    return (
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/20 shadow-lg">
        <h2 className="text-xl mb-4 font-semibold text-cyan-300">📣 Activity Logs</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          {logs.map((log, i) => <li key={i}>• {log}</li>)}
        </ul>
      </div>
    );
  };
  
  export default ActivityLogs;
  