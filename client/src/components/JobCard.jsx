import { deleteJob } from "../api/jobs";

const statusColors = {
  Applied:   { bg: "#E6F1FB", color: "#0C447C" },
  Interview: { bg: "#EEEDFE", color: "#3C3489" },
  Offer:     { bg: "#EAF3DE", color: "#27500A" },
  Rejected:  { bg: "#FCEBEB", color: "#791F1F" },
};

export default function JobCard({ job, onDeleted, onUpdated }) {
  const handleDelete = async () => {
    if (!window.confirm(`Delete ${job.role} at ${job.company}?`)) return;
    try {
      await deleteJob(job._id);
      onDeleted(job._id);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.appliedDate)) / (1000 * 60 * 60 * 24)
  );

  const isOverdue =
    job.deadline && new Date(job.deadline) < new Date() && job.status !== "Offer" && job.status !== "Rejected";

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {job.role}
          </p>
          <p style={{ fontSize: 13, color: "#555", margin: "2px 0 0" }}>{job.company}</p>
        </div>
        <button onClick={handleDelete} style={deleteBtn} title="Delete">✕</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        <span style={{ ...badge, ...statusColors[job.status] }}>{job.status}</span>
        {job.salary && (
          <span style={{ ...badge, bg: "#f5f5f5", background: "#f1f1f1", color: "#444" }}>
            {job.salary}
          </span>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "#888", display: "flex", justifyContent: "space-between" }}>
        <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
        {isOverdue && (
          <span style={{ color: "#e24b4a", fontWeight: 500 }}>⚠ Follow-up overdue</span>
        )}
        {job.link && (
          <a href={job.link} target="_blank" rel="noreferrer" style={{ color: "#185FA5", textDecoration: "none" }}>
            View →
          </a>
        )}
      </div>

      {job.notes && (
        <p style={{ fontSize: 12, color: "#777", marginTop: 8, borderTop: "0.5px solid #eee", paddingTop: 8, margin: "8px 0 0" }}>
          {job.notes.length > 80 ? job.notes.slice(0, 80) + "..." : job.notes}
        </p>
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  border: "0.5px solid #e0e0e0",
  borderRadius: 10,
  padding: "12px 14px",
  marginBottom: 8,
  cursor: "grab",
};
const badge = {
  fontSize: 11, fontWeight: 500,
  padding: "2px 8px", borderRadius: 6,
  display: "inline-block",
};
const deleteBtn = {
  background: "none", border: "none",
  color: "#bbb", cursor: "pointer",
  fontSize: 13, padding: "0 2px",
  flexShrink: 0,
};