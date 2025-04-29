// src/Login.tsx
import { useEffect, useState } from "react";
import "./App.css";

interface LoginProps {
  onLoginSuccess: () => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [masterPassword, setMasterPassword] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const wasmModule: any = await import("../pkg/rustylock.js").then((m) => m);
      if (typeof wasmModule.default === "function") {
        await wasmModule.default();
      }
      setWasm(wasmModule);
    })();
  }, []);

  const handleLogin = () => {
    if (!wasm) return;

    const storedHash = localStorage.getItem("master_hash");
    const inputHash = wasm.hash_password(masterPassword); // Rust hash

    if (!storedHash) {
      // Première fois : on enregistre le hash
      localStorage.setItem("master_hash", inputHash);
      onLoginSuccess();
    } else if (storedHash === inputHash) {
      onLoginSuccess();
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <>
      <div className="logo-wrapper">
        <img src="/logo.png" alt="Rustylock Logo" className="rustylock-logo" />
      </div>
  
      <div className="card" style={{ width: "400px", margin: "auto", marginTop: "1rem" }}>
        <h2> Connexion</h2>
        <input
          type="password"
          placeholder="Mot de passe maître"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button onClick={handleLogin}>Connecter</button>
        {error && <p style={{ color: "#ff6b6b", marginTop: "0.5rem" }}>{error}</p>}
      </div>
    </>
  );  
}

export default Login;
