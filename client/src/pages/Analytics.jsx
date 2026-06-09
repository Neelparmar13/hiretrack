import { useState, useEffect } from "react";
import { getJobs } from "../api/jobs";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(({ data }) => setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      <Navbar />
      <p style={{ textAlign: "center", marginTop: 80, color: "#999" }}>Loading analytics...</p>
    </div>
  );

  // ── Stats ──────────────────────────────────────────────
  const total     = jobs.length;
  const offers    = jobs.filter((j) => j.status === "Offer").length;
  const interviews = jobs.filter((j) => j.status === "Interview" || j.status === "Offer").length;
  const rejected  = jobs.filter((j) => j.status === "Rejected").length;
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;

  // Avg days from apply to interview (for jobs that reached Interview/Offer)
  const interviewedJobs = jobs.filter(
    (j) => j.status === "Interview" || j.status === "Offer"
  );
  const avgDays =
    interviewedJobs.length > 0
      ? Math.round(
          interviewedJobs.reduce((sum, j) => {
            return sum + Math.floor((Date.now() - new Date(j.appliedDate)) / (1000 * 60 * 60 * 24));
          }, 0) / interviewedJobs.length
        )
      : 0;

  // ── Bar chart: applications per week ──────────────────
  const weekMap = {};
  jobs.forEach((j) => {
    const d = new Date(j.appliedDate);
    const week = getWeekLabel(d);
    weekMap[week] = (weekMap[week] || 0) + 1;
  });
  const sortedWeeks = Object.keys(weekMap).sort();
  const barData = {
    labels: sortedWeeks.length > 0 ? sortedWeeks : ["No data"],
    datasets: [
      {
        label: "Applications",
        data: sortedWeeks.length > 0 ? sortedWeeks.map((w) => weekMap[w]) : [0],
        backgroundColor: "#378ADD",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0f0f0" } },
      x: { grid: { display: false } },
    },
  };

  // ── Pie chart: status breakdown ────────────────────────
  const statusCounts = {
    Applied:   jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer:     jobs.filter((j) => j.status === "Offer").length,
    Rejected:  jobs.filter((j) => j.status === "Rejected").length,
  };
  const pieData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#378ADD", "#7C75E0", "#5BA85A", "#E05252"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
    },
  };

  // ── Recent activity ────────────────────────────────────
  const recent = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusColor = {
    Applied:   { bg: "#E6F1FB", color: "#0C447C" },
    Interview: { bg: "#EEEDFE", color: "#3C3489" },
    Offer:     { bg: "#EAF3DE", color: "#27500A" },
    Rejected:  { bg: "#FCEBEB", color: "#791F1F" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      <Navbar />

      <div style={{ padding: "24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 20px", color: "#111" }}>
          Analytics
        </h1>

        {/* ── Top stat cards ── */}
        <div style={statsGrid}>
          <StatCard label="Total Applications" value={total}            color="#185FA5" />
          <StatCard label="Interview Rate"      value={`${interviewRate}%`} color="#534AB7" />
          <StatCard label="Offer Rate"          value={`${successRate}%`}   color="#3B6D11" />
          <StatCard label="Avg Days to Interview" value={avgDays > 0 ? `${avgDays}d` : "—"} color="#854F0B" />
        </div>

        {/* ── Charts row ── */}
        <div style={chartsRow}>
          <div style={chartCard}>
            <p style={chartTitle}>Applications per week</p>
            {total === 0 ? (
              <Empty />
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>

          <div style={{ ...chartCard, maxWidth: 340 }}>
            <p style={chartTitle}>Status breakdown</p>
            {total === 0 ? (
              <Empty />
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            )}
          </div>
        </div>

        {/* ── Status summary bars ── */}
        <div style={sectionCard}>
          <p style={chartTitle}>Pipeline overview</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#444" }}>{status}</span>
                  <span style={{ color: "#888" }}>{count} / {total}</span>
                </div>
                <div style={{ background: "#f0f0f0", borderRadius: 4, height: 8 }}>
                  <div style={{
                    width: total > 0 ? `${Math.round((count / total) * 100)}%` : "0%",
                    background: statusColor[status].color,
                    height: 8, borderRadius: 4,
                    transition: "width 0.4s ease",
                    minWidth: count > 0 ? 8 : 0,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent activity ── */}
        <div style={sectionCard}>
          <p style={chartTitle}>Recent applications</p>
          {recent.length === 0 ? (
            <p style={{ color: "#bbb", fontSize: 13 }}>No applications yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {recent.map((job, i) => (
                <div key={job._id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < recent.length - 1 ? "0.5px solid #f0f0f0" : "none",
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{job.role}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>{job.company}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "#aaa" }}>
                      {Math.floor((Date.now() - new Date(job.appliedDate)) / (1000 * 60 * 60 * 24))}d ago
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6,
                      ...statusColor[job.status],
                    }}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 10, padding: "16px 20px" }}>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 500, margin: 0, color }}>{value}</p>
    </div>
  );
}

function Empty() {
  return <p style={{ color: "#ccc", fontSize: 13, textAlign: "center", padding: "32px 0" }}>Add jobs to see data</p>;
}

function getWeekLabel(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // start of week (Sunday)
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

const statsGrid = {
  display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12, marginBottom: 16,
};
const chartsRow = {
  display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap",
};
const chartCard = {
  background: "#fff", border: "0.5px solid #e8e8e8",
  borderRadius: 10, padding: "20px", flex: 1, minWidth: 280,
};
const sectionCard = {
  background: "#fff", border: "0.5px solid #e8e8e8",
  borderRadius: 10, padding: "20px", marginBottom: 16,
};
const chartTitle = {
  fontSize: 14, fontWeight: 500, color: "#333",
  margin: "0 0 16px",
};