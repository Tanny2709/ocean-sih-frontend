import { useState, useEffect } from "react";
import GraphsDashboard from "./GraphDashboard";


function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function groupReportsByLocation(reports, radiusKm) {
  const groups = [];
  const unassignedReports = [...reports];
  while (unassignedReports.length > 0) {
    const newGroup = {
      center: {
        lat: unassignedReports[0].lat,
        lng: unassignedReports[0].lng,
      },
      reports: [unassignedReports[0]],
      id: `group-${unassignedReports[0].id}`,
    };
    unassignedReports.shift();
    const reportsToRemoveIndexes = [];
    for (let i = 0; i < unassignedReports.length; i++) {
      const report = unassignedReports[i];
      const distance = getDistanceInKm(
        newGroup.center.lat,
        newGroup.center.lng,
        report.lat,
        report.lng
      );
      if (distance <= radiusKm) {
        newGroup.reports.push(report);
        reportsToRemoveIndexes.push(i);
      }
    }
    for (let i = reportsToRemoveIndexes.length - 1; i >= 0; i--) {
      unassignedReports.splice(reportsToRemoveIndexes[i], 1);
    }
    groups.push(newGroup);
  }
  return groups;
}

export default function ReportsCard({ role }) {
  const [reportGroups, setReportGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState([]);
  const [alertReport, setAlertReport] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [analystReportForm, setAnalystReportForm] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [transcriptionState, setTranscriptionState] = useState({
    isLoading: false,
    text: null,
    error: null,
  });

  const GROUPING_RADIUS_KM = 5;

  const departments = [
    { name: "Coastal Department", email: "atharvmandpe2@gmail.com" },
    { name: "Police Department", email: "adityaladprogrammer@gmail.com" },
    { name: "Disaster Management", email: "dmparsharam@gmail.com" },
  ];

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/analyst-reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAlert = (groupOrReport) => {
    setAlertReport(groupOrReport);

    // Prefill form with analyst input if exists
    setAnalystReportForm({
      disasterType: groupOrReport.analystReportForm?.disasterType || "",
      safeLat: groupOrReport.analystReportForm?.safeLat || "",
      safeLng: groupOrReport.analystReportForm?.safeLng || "",
      instructions: groupOrReport.analystReportForm?.instructions || "",
    });
  };


  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => {
        const grouped = groupReportsByLocation(data, GROUPING_RADIUS_KM);
        setReportGroups(grouped);
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  useEffect(() => {
    if (showPredictions) {
      fetch("http://localhost:5000/api/incois-prediction")
        .then((res) => res.json())
        .then((data) => setPredictions(data))
        .catch((err) =>
          console.error("Error fetching incois predictions:", err)
        );
    }
  }, [showPredictions]);

  useEffect(() => {
    if (showAnalysis) {
      fetch("http://localhost:5000/api/ml-model-outputs")
        .then((res) => res.json())
        .then((data) => setAnalysisData(data))
        .catch((err) => console.error(err));
    }
  }, [showAnalysis]);

  useEffect(() => {
    if (!selectedReport) {
      setTranscriptionState({ isLoading: false, text: null, error: null });
      return;
    }
    const audioMedia = selectedReport.report_media?.find((m) =>
      m.mime_type.startsWith("audio/")
    );
    if (audioMedia) {
      const fetchTranscription = async () => {
        setTranscriptionState({ isLoading: true, text: null, error: null });
        try {
          const res = await fetch("http://localhost:5000/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioUrl: audioMedia.url }),
          });
          if (!res.ok) throw new Error("Server failed to transcribe.");
          const data = await res.json();
          setTranscriptionState({
            isLoading: false,
            text: data.transcription,
            error: null,
          });
        } catch (err) {
          console.error(err);
          setTranscriptionState({
            isLoading: false,
            text: null,
            error: "Could not transcribe audio.",
          });
        }
      };
      fetchTranscription();
    }
  }, [selectedReport]);

  const handleDeptChange = (email) => {
    setSelectedDepts((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleSubmitAlert = async (groupOrReport) => {
    if (!groupOrReport) return;
    const emergencyPayload = {
      disasterType: groupOrReport.disasterType || "",
      safeLat: groupOrReport.safeLat || null,
      safeLng: groupOrReport.safeLng || null,
      instructions: groupOrReport.instructions || "",
      expiresAt: groupOrReport.expiresAt || null,
    };
    try {
      const res = await fetch("http://localhost:5000/api/emergencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emergencyPayload),
      });
      if (!res.ok) throw new Error("Failed to save emergency");
      const savedEmergency = await res.json();
      console.log("Emergency saved:", savedEmergency);
      if (selectedDepts.length > 0) {
        const emailRes = await fetch("http://localhost:5000/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportId: groupOrReport.id,
            emails: selectedDepts,
          }),
        });
        if (!emailRes.ok) throw new Error("Failed to send emails");
        const emailData = await emailRes.json();
        console.log("Emails sent:", emailData);
      }
      alert("Emergency saved & emails sent!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving or sending emails.");
    } finally {
      setSelectedDepts([]);
      setAlertReport(null);
    }
  };

  // --- Render ---
  const renderGroupView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reportGroups.map((group) => (
        <div
          key={group.id}
          className="border rounded-xl shadow-md hover:shadow-xl transition p-5 bg-white flex flex-col justify-between"
        >
          <div
            className="cursor-pointer"
            onClick={() => setSelectedGroup(group)}
          >
            <h3 className="font-bold text-lg text-blue-700">
              {group.reports.length} Reports in this Area
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Near Lat: {group.center.lat.toFixed(4)}, Lng:{" "}
              {group.center.lng.toFixed(4)}
            </p>
          </div>
          {role?.toLowerCase() === "admin" && (
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              onClick={() => handleOpenAlert(group)}
            >
              🚨 Alert this Area
            </button>
          )}

          {role?.toLowerCase() === "analyst" && (
            <div
              className="mt-4 text-right text-blue-600 font-semibold cursor-pointer"
            >
              View Report →
            </div>

          )}

          {role?.toLowerCase() === "analyst" && (
            <div
              className="mt-4 text-right text-blue-600 font-semibold cursor-pointer"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              View ML Model Analysis →
            </div>

          )}

          {role?.toLowerCase() === "analyst" && (
            <div
              className="mt-4 text-right text-blue-600 font-semibold cursor-pointer"
              onClick={() => setShowPredictions(!showPredictions)}
            >
              View existing incois prediction →
            </div>
          )}

          {role?.toLowerCase() === "analyst" && (
            <div
              className="mt-4 text-right text-blue-600 font-semibold cursor-pointer"
              onClick={() => setShowGraphs(!showGraphs)}
            >
              View additional graphs →
            </div>
          )}

          {role?.toLowerCase() === "analyst" && (
            <div className="mt-4 text-right text-blue-600 font-semibold cursor-pointer" onClick={() => setShowReportForm(true)}>
              Write report →
            </div>
          )}

          {role?.toLowerCase() === "admin" && (
            <div
              className="mt-4 text-right text-blue-600 font-semibold cursor-pointer"
              onClick={fetchReports}
            >
              View Analysis →
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderReportsInGroupView = () => (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        onClick={() => setSelectedGroup(null)}
      >
        ← Back to All Groups
      </button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {selectedGroup.reports.map((report) => (
          <div
            key={report.id}
            className="border rounded-xl shadow-md hover:shadow-xl transition bg-white p-5 flex flex-col"
          >
            <div
              className="cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <p className="font-semibold text-gray-800 truncate">
                {report.description || "No description"}
              </p>
              <p className="text-sm text-gray-500 truncate mt-1">
                By: {report.users?.name} ({report.users?.email})
              </p>
              <p className="text-xs text-gray-400 mt-2">
                AI: {report.ai_type} ({report.ai_severity})
              </p>
            </div>
            {role?.toLowerCase() === "admin" && (
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                onClick={() => setAlertReport(report)}
              >
                🚨 Alert
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        {selectedGroup
          ? `Reports in Selected Area (${selectedGroup.reports.length})`
          : "Crowdsourced Report Groups"}
      </h2>

      {reportGroups.length === 0 ? (
        <p className="text-gray-500">No reports available.</p>
      ) : selectedGroup ? (
        renderReportsInGroupView()
      ) : (
        renderGroupView()
      )}

      {/* Report Detail Modal */}
      {selectedReport && !alertReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">Report Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedReport.id}
              </p>
              <p>
                <strong>Reported By:</strong> {selectedReport.users?.name} (
                {selectedReport.users?.email})
              </p>
            </div>
            {selectedReport.report_media?.length > 0 && (
              <div className="mt-4 space-y-4">
                {selectedReport.report_media.map((media) => {
                  if (media.mime_type.startsWith("image/")) {
                    return (
                      <img
                        key={media.id}
                        src={media.url}
                        alt="Report Media"
                        className="w-full h-auto object-cover rounded-lg border"
                      />
                    );
                  } else if (media.mime_type.startsWith("video/")) {
                    return (
                      <video
                        key={media.id}
                        src={media.url}
                        controls
                        className="w-full rounded-lg border"
                      />
                    );
                  } else if (media.mime_type.startsWith("audio/")) {
                    return (
                      <div
                        key={media.id}
                        className="border p-3 rounded-lg bg-gray-50"
                      >
                        <audio src={media.url} controls className="w-full" />
                        <div className="mt-2 p-2 bg-white rounded">
                          <p className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                            Transcription
                          </p>
                          {transcriptionState.isLoading && (
                            <p className="text-sm text-gray-500 animate-pulse">
                              Transcribing audio...
                            </p>
                          )}
                          {transcriptionState.error && (
                            <p className="text-sm text-red-500">
                              {transcriptionState.error}
                            </p>
                          )}
                          {transcriptionState.text && (
                            <blockquote className="text-sm text-gray-800 italic border-l-4 border-blue-500 pl-3">
                              {transcriptionState.text}
                            </blockquote>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setSelectedReport(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {role?.toLowerCase() === "admin" && alertReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-red-600">🚨 Send Alert</h3>

            <div className="space-y-3 mb-4">
              {departments.map((dept) => (
                <label key={dept.email} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(dept.email)}
                    onChange={() => handleDeptChange(dept.email)}
                  />
                  <span>{dept.name}</span>
                </label>
              ))}
            </div>

            {/* Prefill form */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Disaster Type</label>
                <input
                  type="text"
                  value={analystReportForm?.disasterType || ""}
                  onChange={(e) => setAnalystReportForm({ ...analystReportForm, disasterType: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Safe Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={analystReportForm?.safeLat || ""}
                    onChange={(e) => setAnalystReportForm({ ...analystReportForm, safeLat: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Safe Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={analystReportForm?.safeLng || ""}
                    onChange={(e) => setAnalystReportForm({ ...analystReportForm, safeLng: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={analystReportForm?.instructions || ""}
                  onChange={(e) => setAnalystReportForm({ ...analystReportForm, instructions: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" onClick={() => setAlertReport(null)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleSubmitAlert(analystReportForm)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      {showAnalysis && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">ML Model Outputs</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Anomaly ID</th>
                <th className="border p-2">Calamity Type</th>
                <th className="border p-2">Confidence</th>
                <th className="border p-2">Predicted At</th>
                <th className="border p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2">{row.id}</td>
                  <td className="border p-2">{row.anomaly_id}</td>
                  <td className="border p-2">{row.calamity_type}</td>
                  <td className="border p-2">{row.confidence}</td>
                  <td className="border p-2">
                    {new Date(row.predicted_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <pre className="text-xs">{JSON.stringify(row.details, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPredictions && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">INCOIS Predictions</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Prediction Type</th>
                <th className="px-4 py-2 border">Wave Height (m)</th>
                <th className="px-4 py-2 border">Current Speed (knots)</th>
                <th className="px-4 py-2 border">Valid From</th>
                <th className="px-4 py-2 border">Valid To</th>
                <th className="px-4 py-2 border">Issued At</th>
              </tr>
            </thead>
            <tbody>
              {predictions.length > 0 ? (
                predictions.map((p) => (
                  <tr key={p.id} className="text-center">
                    <td className="px-4 py-2 border">{p.location}</td>
                    <td className="px-4 py-2 border">{p.prediction_type}</td>
                    <td className="px-4 py-2 border">{p.wave_height_m ?? "-"}</td>
                    <td className="px-4 py-2 border">{p.current_speed_knots ?? "-"}</td>
                    <td className="px-4 py-2 border">
                      {new Date(p.valid_from).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(p.valid_to).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(p.issued_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 border text-center" colSpan="7">
                    No predictions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showGraphs && <GraphsDashboard />}

      {showReportForm && role?.toLowerCase() === "analyst" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Fill Alert Form</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Disaster Type</label>
                <input
                  type="text"
                  value={analystReportForm?.disasterType || ""}
                  onChange={(e) => setAnalystReportForm({ ...analystReportForm, disasterType: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Safe Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={analystReportForm?.safeLat || ""}
                    onChange={(e) => setAnalystReportForm({ ...analystReportForm, safeLat: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Safe Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={analystReportForm?.safeLng || ""}
                    onChange={(e) => setAnalystReportForm({ ...analystReportForm, safeLng: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={analystReportForm?.instructions || ""}
                  onChange={(e) => setAnalystReportForm({ ...analystReportForm, instructions: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:5000/api/analyst-reports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(analystReportForm),
                  });
                  if (!res.ok) throw new Error("Failed to save report");
                  const saved = await res.json();
                  console.log("Analyst report saved:", saved);
                  alert("Report saved successfully!");
                  setShowReportForm(false);
                  setAnalystReportForm(null); // reset form
                } catch (err) {
                  console.error(err);
                  alert("Failed to save report.");
                }
              }}
            >
              Save
            </button>

          </div>
        </div>
      )}

      {loading && <p>Loading reports...</p>}

      {reports.length > 0 && (
        <div className="mt-4 border p-4 rounded-md bg-gray-50">
          <h3 className="font-bold mb-2">Analyst Reports</h3>
          {reports.map((report) => (
            <div key={report.id} className="mb-2 p-2 border rounded">
              <p>
                <strong>Disaster Type:</strong> {report.disastertype}
              </p>
              <p>
                <strong>Safe Latitude:</strong> {report.safelat}
              </p>
              <p>
                <strong>Safe Longitude:</strong> {report.safelng}
              </p>
              <p>
                <strong>Instructions:</strong> {report.instructions}
              </p>
              <p className="text-gray-500 text-sm">
                Created at: {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}


    </div>
  );
}
