import ReportsCard from "../components/ReportsCard";

export default function AnalystDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-blue-700">Analyst Dashboard</h1>
        <p className="text-gray-600 mt-2">
          View hazard reports, social media trends, and map-based analytics here.
        </p>
      </header>

      {/* Reports Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Hazard Reports
        </h2>
        <ReportsCard role="analyst" />
      </section>

      {/* (Optional) Future Sections for Analysts */}
      {/* 
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Social Media Trends
        </h2>
        <TrendsChart /> 
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Map-Based Analytics
        </h2>
        <AnalyticsMap /> 
      </section>
      */}
    </div>
  );
}
