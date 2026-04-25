// client/src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "signup") await signup(form);
      else await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not continue.");
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <article className="card auth-card">
          <h2>{mode === "signup" ? "Create account" : "Welcome back"}</h2>
          <p className="muted">Users need an account to like, comment, review, and track their orders.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <input className="input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            )}
            <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input className="input" name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
            {error && <div className="notice">{error}</div>}
            <button className="btn">{mode === "signup" ? "Sign up" : "Log in"}</button>
          </form>
          <div className="auth-switch" style={{ marginTop: 12 }}>
            <span className="muted">{mode === "signup" ? "Already have an account?" : "Need an account?"}</span>
            <button className="btn-secondary" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Log in" : "Sign up"}</button>
          </div>
        </article>
      </div>
    </section>
  );
}
