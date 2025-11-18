import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 leading-tight">
          Integrated Platform for Ocean Hazard Reporting
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Empowering citizens, analysts, and authorities with real-time crowdsourced 
          hazard reports and social media insights for safer coasts.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg shadow hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-700">Crowdsourced Reports</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Citizens and coastal residents can submit real-time reports with 
              geotags, photos, videos, or audio evidence.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-700">Interactive Dashboard</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Visualize hazard hotspots on an interactive map with grouped reports 
              and AI-driven severity insights.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-700">Social Media Analytics</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Monitor Twitter, YouTube, and public discussions using NLP to detect 
              hazard-related trends and sentiment.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-700">Role-Based Access</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Analysts, administrators, and citizens access tailored dashboards for 
              effective decision-making.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About the Project
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            This platform, supported by the Indian National Centre for Ocean Information Services (INCOIS), 
            bridges the gap between early warning models and real-time ground reports. It helps authorities, 
            analysts, and citizens work together to mitigate risks from tsunamis, storm surges, high waves, 
            and coastal flooding.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-700 text-white text-center text-sm">
        © {new Date().getFullYear()} Ocean Hazard Reporting Platform. All rights reserved.
      </footer>
    </div>
  );
}
