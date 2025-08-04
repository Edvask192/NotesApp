import "./AuthForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError("Neteisingas el. paštas arba slaptažodis");
      return;
    }

    login(user); 
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2>Prisijungimas</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Prisijungti</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Neturi paskyros?{" "}
        <a href="/register" style={{ color: "blue" }}>
          Registruokis
        </a>
      </p>
    </div>
  );
}

export default Login;
