import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function doLogin() {
    const ok = await login(password);
    if (!ok) {
      setError(true);
    } else {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="brand">SUNIKET</div>
        <p>Admin panel</p>
        <input
          type="password"
          placeholder="Heslo"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") doLogin();
          }}
        />
        {error && <div className="error">Špatné heslo</div>}
        <button onClick={doLogin}>Přihlásit se</button>
      </div>
    </div>
  );
}
