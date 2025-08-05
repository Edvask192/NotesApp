import "./AuthForm.css";
import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Slaptažodžiai nesutampa");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      setError("Vartotojas su šiuo el. paštu jau egzistuoja");
      return;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    navigate("/login");
  };

  return (
    <div className="login-page fade-slide">
      <div className="auth-container">
        <h2>Edvino Užrašinė</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="El. paštas"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Slaptažodis"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Pakartokite slaptažodį"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Registruotis</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>
          Jau turite paskyrą?{" "}
          <a href="/login" style={{ color: "blue" }}>
            Prisijunkite
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
