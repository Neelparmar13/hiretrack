import { useState } from "react";
import { createJob } from "../api/jobs";

const initialForm = {
  company: "",
  role: "",
  status: "Applied",
  appliedDate: new Date().toISOString().split("T")[0],
  deadline: "",
  salary: "",
  link: "",
  notes: "",
};

const initialErrors = {
  company: "",
  role: "",
  appliedDate: "",
};

export default function AddJobModal({ onClose, onAdded }) {
  const [form, setForm]       = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [errors, setErrors]   = useState(initialErrors);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear field error on type
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = { company: "", role: "", appliedDate: "" };
    let isValid = true;

    if (!form.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }
    if (!form.role.trim()) {
      newErrors.role = "Job role is required";
      isValid = false;
    }
    if (!form.appliedDate) {
      newErrors.appliedDate = "Applied date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return; // stop if validation fails

    setLoading(true);
    try {
      const { data } = await createJob(form);
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Add job application</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && <p style={{ color: "#e24b4a", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={row}>
            <div style={field}>
              <label style={label}>Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handle}
                placeholder="Google"
                style={{ borderColor: errors.company ? "#e24b4a" : undefined }}
              />
              {errors.company && <span style={errText}>{errors.company}</span>}
            </div>
            <div style={field}>
              <label style={label}>Role *</label>
              <input
                name="role"
                value={form.role}
                onChange={handle}
                placeholder="Frontend Developer"
                style={{ borderColor: errors.role ? "#e24b4a" : undefined }}
              />
              {errors.role && <span style={errText}>{errors.role}</span>}
            </div>
          </div>

          <div style={row}>
            <div style={field}>
              <label style={label}>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div style={field}>
              <label style={label}>Applied date *</label>
              <input
                type="date"
                name="appliedDate"
                value={form.appliedDate}
                onChange={handle}
                style={{ borderColor: errors.appliedDate ? "#e24b4a" : undefined }}
              />
              {errors.appliedDate && <span style={errText}>{errors.appliedDate}</span>}
            </div>
          </div>

          <div style={row}>
            <div style={field}>
              <label style={label}>Salary (optional)</label>
              <input name="salary" value={form.salary} onChange={handle} placeholder="₹8 LPA" />
            </div>
            <div style={field}>
              <label style={label}>Follow-up deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handle} />
            </div>
          </div>

          <div style={field}>
            <label style={label}>Job link (optional)</label>
            <input name="link" value={form.link} onChange={handle} placeholder="https://careers.google.com/..." />
          </div>

          <div style={field}>
            <label style={label}>Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handle}
              placeholder="Referral from Priya, 3 rounds..."
              rows={3}
              style={{ resize: "vertical", fontFamily: "inherit", fontSize: 14, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ccc", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Adding..." : "Add job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem",
};
const modal = {
  background: "#fff", borderRadius: 12,
  padding: "1.5rem", width: "100%", maxWidth: 560,
  maxHeight: "90vh", overflowY: "auto",
};
const row    = { display: "flex", gap: 10 };
const field  = { display: "flex", flexDirection: "column", gap: 4, flex: 1 };
const label  = { fontSize: 12, color: "#666", fontWeight: 500 };
const errText = { fontSize: 11, color: "#e24b4a", marginTop: 2 };
const closeBtn = {
  background: "none", border: "none",
  fontSize: 18, cursor: "pointer", color: "#666",
};