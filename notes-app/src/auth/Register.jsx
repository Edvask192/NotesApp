import "./AuthForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      setError("Toks el. paštas jau užregistruotas");
      return;
    }

    if (password !== repeatPassword) {
      setError("Slaptažodžiai nesutampa");
      return;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    login(newUser); // ✅ Pranešame AuthContext'ui
    navigate("/");  // ✅ Leidžiame patekti į MainApp
  };

  return (
    <div className="auth-container">
      <h2>Registracija</h2>
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
          placeholder="Pakartoti slaptažodį"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />
        <button type="submit">Registruotis</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Jau turi paskyrą?{" "}
        <a href="/login" style={{ color: "blue" }}>
          Prisijunk
        </a>
      </p>
    </div>
  );
}

export default Register;
