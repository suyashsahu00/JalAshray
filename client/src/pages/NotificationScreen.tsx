import Navigation from '../components/Navigation';

export default function NotificationScreen() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-4">
      <div className="bg-blue-900 text-white px-4 py-2 rounded-t-2xl font-bold text-lg">Notifications</div>
      <div className="bg-white rounded-b-2xl pb-4 pt-2">
        <div className="flex gap-2 p-2 mb-2">
          <button className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-xs">All</button>
          <button className="text-gray-700 px-4 py-1 text-xs">Critical</button>
          <button className="text-gray-700 px-4 py-1 text-xs">Assigned</button>
          <button className="text-gray-700 px-4 py-1 text-xs">Completed</button>
        </div>
        <div className="p-2">
          <NotificationCard
            title="CRITICAL: Major leak at CP Metro Station"
            desc="Tap to view details"
            time="2 mins ago"
            level="critical"
          />
          <NotificationCard
            title="New repair task assigned to your team"
            desc="Ward 8, Karol Bagh"
            time="15 mins ago"
            level="assigned"
          />
          <NotificationCard
            title="Task #WL2024-1235 marked complete"
            desc="Great work!"
            time="30 mins ago"
            level="completed"
          />
          <NotificationCard
            title="Weekly performance report available"
            desc="View analytics"
            time="3 hours ago"
            level="info"
          />
        </div>
      </div>
      </div>
    </div>
  );
}

function NotificationCard({ title, desc, time, level }: { title: string; desc: string; time: string; level: string }) {
  let color = "";
  if (level === "critical") color = "border-red-600";
  if (level === "assigned") color = "border-orange-400";
  if (level === "completed") color = "border-green-600";
  return (
    <div className={`border-l-4 p-3 mb-2 rounded shadow-sm bg-gray-50 ${color}`}>
      <div className="text-sm font-bold mb-1">{title}</div>
      <div className="text-xs text-gray-600">{desc}</div>
      <div className="text-right text-xs text-gray-400">{time}</div>
    </div>
  );
}
