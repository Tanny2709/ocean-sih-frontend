import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

export default function GraphsDashboard() {
  const [reportsData, setReportsData] = useState([]);
  const [mlData, setMlData] = useState([]);
  const [incoisData, setIncoisData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4567", "#AA00FF"];

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReportsData(data))
      .catch(console.error);

    fetch("http://localhost:5000/api/ml-model-outputs")
      .then((res) => res.json())
      .then((data) => setMlData(data))
      .catch(console.error);

    fetch("http://localhost:5000/api/incois-prediction")
      .then((res) => res.json())
      .then((data) => setIncoisData(data))
      .catch(console.error);
  }, []);

  // Aggregations
  

 

  const mlByCalamity = mlData.reduce((acc, m) => {
    acc[m.calamity_type] = (acc[m.calamity_type] || 0) + 1;
    return acc;
  }, {});

  const mlConfidenceData = mlData.map((m) => ({
    calamity: m.calamity_type,
    confidence: parseFloat(m.confidence ?? 0),
  }));

  const incoisWaveHeights = incoisData.map((p) => ({
    location: p.location,
    waveHeight: p.wave_height_m ?? 0,
    currentSpeed: p.current_speed_knots ?? 0,
  }));

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-lg space-y-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Graphs Dashboard</h2>

      {/* Reports by AI Type */}
      

      {/* Reports by Severity */}
      

      {/* ML Model Outputs by Calamity */}
      <div>
        <h3 className="font-semibold mb-2">ML Model Outputs by Calamity Type</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={Object.entries(mlByCalamity).map(([key, value]) => ({ name: key, value }))}
            cx="50%"
            cy="50%"
            label
            outerRadius={100}
          >
            {Object.entries(mlByCalamity).map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* ML Confidence Distribution */}
      <div>
        <h3 className="font-semibold mb-2">ML Confidence Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mlConfidenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="calamity" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="confidence" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* INCOIS Predictions Wave Height & Current Speed */}
      <div>
        <h3 className="font-semibold mb-2">INCOIS Predictions: Wave Height & Current Speed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incoisWaveHeights}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="waveHeight" stroke="#8884d8" />
            <Line type="monotone" dataKey="currentSpeed" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INCOIS Wave Height vs Current Speed Scatter */}
      <div>
        <h3 className="font-semibold mb-2">INCOIS Wave Height vs Current Speed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="waveHeight" name="Wave Height (m)" />
            <YAxis type="number" dataKey="currentSpeed" name="Current Speed (knots)" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="INCOIS Predictions" data={incoisWaveHeights} fill="#FF4567" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
