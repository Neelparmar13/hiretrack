import { useState, useEffect } from "react";
import { getJobs } from "../api/jobs";
import KanbanBoard from "../components/KanbanBoard";
import AddJobModal from "../components/AddJobModal";
import Navbar from "../components/Navbar";
import Toast, { useToast } from "../components/Toast";

export default function Dashboard() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder]       = useState("newest");
  const { toast, showToast }            = useToast();

  useEffect(() => { fetchJobs(); }, []);

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
    showToast(`Added "${newJob.role}" at ${newJob.company}`);
  };

  const handleUpdated = (updatedJob) => {
    setJobs((prev) => prev.map((j) => j._id === updatedJob._id ? updatedJob : j));
    showToast(`Updated "${updatedJob.role}"`, "info");
  };

  const handleDeleted = (id) => {
    const job = jobs.find((j) => j._id === id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
    showToast(`Deleted "${job?.role}"`, "error");
  };

  let filteredJobs = jobs;
  if (filterStatus !== "All") filteredJobs = filteredJobs.filter((j) => j.status === filterStatus);
  if (search) filteredJobs = filteredJobs.filter((j) => j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase()));
  filteredJobs = [...filteredJobs].sort((a, b) => {
    const dateA = new Date(a.appliedDate);
    const dateB = new Date(b.appliedDate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const stats = {
    total:     jobs.length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer:     jobs.filter((j) => j.status === "Offer").length,
    rejected:  jobs.filter((j) => j.status === "Rejected").length,
  };

  const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      <Navbar />
      <div style={{ padding: "24px 24px 0" }}>
        <div style={statsRow}>
          <StatCard label="Total applications" value={stats.total}     color="#185FA5" />
          <StatCard label="Interviews"          value={stats.interview} color="#534AB7" />
          <StatCard label="Offers"              value={stats.offer}    color="#3B6D11" />
          <StatCard label="Rejected"            value={stats.rejected} color="#A32D2D" />
        </div>
        <div style={toolbar}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input placeholder="Search company or role..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 220, fontSize: 13 }} />
            <div style={{ display: "flex", gap: 4 }}>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, cursor: "pointer", border: "0.5px solid #ddd", background: filterStatus === s ? "#185FA5" : "#fff", color: filterStatus === s ? "#fff" : "#555", fontWeight: filterStatus === s ? 500 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ fontSize: 13, padding: "5px 10px", borderRadius: 8, border: "0.5px solid #ddd" }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <button onClick={() => setShowModal(true)} style={addBtn}>+ Add job</button>
        </div>
      </div>
      <div style={{ padding: "16px 24px 40px" }}>
        {loading ? (
          <p style={{ color: "#999", textAlign: "center", marginTop: 60 }}>Loading jobs...</p>
        ) : (
          <KanbanBoard jobs={filteredJobs} setJobs={setJobs} onUpdated={handleUpdated} onDeleted={handleDeleted} />
        )}
      </div>
      {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdded={handleAdded} />}
      <Toast toast={toast} />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 10, padding: "14px 18px" }}>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 500, margin: 0, color }}>{value}</p>
    </div>
  );
}

const statsRow = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 };
const toolbar  = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 10 };
const addBtn   = { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontWeight: 500 };