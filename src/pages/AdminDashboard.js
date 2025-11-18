import ReportsCard from "../components/ReportsCard";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage users, view reports, and analyze hazard data here.
        </p>
      </header>

      {/* Reports Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Hazard Reports
        </h2>
        <ReportsCard role="admin" />
      </section>

      {/* (Optional) Future Sections */}
      {/* 
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          User Management
        </h2>
        <UserTable /> 
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Analytics & Insights
        </h2>
        <AnalyticsCharts /> 
      </section>
      */}
    </div>
  );
}
