import Navigation from '../components/Navigation';

export default function RepairStatusScreen() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-blue-900 text-white px-4 py-2 rounded-t-2xl font-bold text-lg">Repair Task #WL2024-1247 <span className="ml-2 bg-orange-400 px-2 py-0.5 rounded text-xs text-white">In Progress</span></div>
        <div className="bg-white rounded-b-2xl p-5">
          <div className="mb-4">
            <div className="font-bold mb-1 flex items-center gap-2">
              <span className="material-icons">info</span> Leak Information
            </div>
            <div className="text-sm mb-1">Location: Sector 15, Dwarka</div>
            <div className="text-sm mb-1">Reported: 2 hours ago by Citizen</div>
            <div className="text-sm mb-1"><span className="text-red-600 font-bold">●</span> Severity: Critical</div>
            <div className="text-sm font-bold">Estimated Water Loss: 500L/hour</div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center shadow gap-2">
              <span>Before Repair</span>
              <div className="border-dashed border-2 border-gray-300 min-h-[60px] min-w-[60px] rounded-lg flex items-center justify-center text-gray-400">
                Upload Photo
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center shadow gap-2">
              <span>After Repair</span>
              <div className="border-dashed border-2 border-gray-300 min-h-[60px] min-w-[60px] rounded-lg flex items-center justify-center text-gray-400">
                Upload Photo
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-1">Progress Timeline</div>
            <ul className="text-xs ml-2 list-disc text-gray-500">
              <li>Task Assigned</li>
              <li>Technician En Route</li>
              <li>Repair In Progress</li>
              <li>Repair Complete</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
