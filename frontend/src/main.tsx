// src/Main.tsx
import { useEffect, useState } from "react";
import App from "./App";
import Login from "./Login";
import "./index.css";
import init, * as wasm from "../pkg/rustylock";

function Main() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginTime, setLoginTime] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      await init(); // initialise le wasm
    })();
  }, []);

  useEffect(() => {
    if (!authenticated || !loginTime) return;

    const interval = setInterval(() => {
      const expired = wasm.has_expired(loginTime, 30000);
      if (expired) {
        setAuthenticated(false);
        setLoginTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authenticated, loginTime]);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setLoginTime(Date.now());
  };

  return authenticated ? (
    <App />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

export default Main;
