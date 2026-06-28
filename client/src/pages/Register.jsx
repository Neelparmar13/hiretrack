import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
        Create your account
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 28, fontSize: 14 }}>
        Start tracking your job hunt today.
      </p>

      {error && (
        <p style={{ color: "var(--color-text-danger)", marginBottom: 16, fontSize: 14 }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Name */}
        <div style={field}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handle}
            style={{ borderColor: errors.name ? "#e24b4a" : undefined }}
          />
          {errors.name && <span style={errText}>{errors.name}</span>}
        </div>

        {/* Email */}
        <div style={field}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handle}
            style={{ borderColor: errors.email ? "#e24b4a" : undefined }}
          />
          {errors.email && <span style={errText}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div style={field}>
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handle}
            style={{ borderColor: errors.password ? "#e24b4a" : undefined }}
          />
          {errors.password && <span style={errText}>{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14, color: "var(--color-text-secondary)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--color-text-info)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

const field   = { display: "flex", flexDirection: "column", gap: 4 };
const errText = { fontSize: 11, color: "#e24b4a", marginTop: 2 };