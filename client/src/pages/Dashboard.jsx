import { useState, useEffect } from "react";
import { getJobs } from "../api/jobs";
import KanbanBoard from "../components/KanbanBoard";
import AddJobModal from "../components/AddJobModal";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdded = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:     jobs.length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer:     jobs.filter((j) => j.status === "Offer").length,
    rejected:  jobs.filter((j) => j.status === "Rejected").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      <Navbar />

      <div style={{ padding: "24px 24px 0" }}>
        {/* Stats row */}
        <div style={statsRow}>
          <StatCard label="Total applications" value={stats.total}    color="#185FA5" />
          <StatCard label="Interviews"          value={stats.interview} color="#534AB7" />
          <StatCard label="Offers"              value={stats.offer}    color="#3B6D11" />
          <StatCard label="Rejected"            value={stats.rejected} color="#A32D2D" />
        </div>

        {/* Toolbar */}
        <div style={toolbar}>
          <input
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280, fontSize: 13 }}
          />
          <button onClick={() => setShowModal(true)} style={addBtn}>
            + Add job
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ padding: "16px 24px 40px" }}>
        {loading ? (
          <p style={{ color: "#999", textAlign: "center", marginTop: 60 }}>Loading jobs...</p>
        ) : (
          <KanbanBoard jobs={filteredJobs} setJobs={setJobs} />
        )}
      </div>

      {showModal && (
        <AddJobModal onClose={() => setShowModal(false)} onAdded={handleAdded} />
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={statCard}>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 500, margin: 0, color }}>{value}</p>
    </div>
  );
}

const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12, marginBottom: 16,
};
const statCard = {
  background: "#fff",
  border: "0.5px solid #e8e8e8",
  borderRadius: 10, padding: "14px 18px",
};
const toolbar = {
  display: "flex", justifyContent: "space-between",
  alignItems: "center", marginBottom: 8,
};
const addBtn = {
  background: "#185FA5", color: "#fff",
  border: "none", borderRadius: 8,
  padding: "8px 18px", fontSize: 13,
  cursor: "pointer", fontWeight: 500,
};