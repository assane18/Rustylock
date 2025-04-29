import { useEffect, useState } from "react";
import "./App.css";

interface SavedEntry {
  site: string;
  user: string;
  pass: string;
}

function App() {
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [phraseMode, setPhraseMode] = useState(false);
  const [wasm, setWasm] = useState<any>(null);
  const [savedPasswords, setSavedPasswords] = useState<SavedEntry[]>([]);
  const [siteName, setSiteName] = useState("");
  const [username, setUsername] = useState("");
  const [show, setShow] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const wasmModule: any = await import("../pkg/rustylock.js").then((m) => m);
      if (typeof wasmModule.default === 'function') {
        await wasmModule.default();
      }    
      setWasm(wasmModule);
      const saved = localStorage.getItem("rustylock_saves");
      if (saved) setSavedPasswords(JSON.parse(saved)); 
    })();
  }, []);

  const handleGenerate = () => {
    if (!wasm) return;
    const pwd = phraseMode
      ? wasm.generate_passphrase(length)
      : wasm.generate_password(length, uppercase, lowercase, numbers, symbols);
    setPassword(pwd);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
  };

  const handleSave = () => {
    if (!siteName || !username || !password) return;
    const newEntry = { site: siteName, user: username, pass: password };
    const updated = [...savedPasswords, newEntry];
    setSavedPasswords(updated);
    localStorage.setItem("rustylock_saves", JSON.stringify(updated));
    setSiteName("");
    setUsername("");
  };

  const handleDelete = (index: number) => {
    const updated = savedPasswords.filter((_, i) => i !== index);
    setSavedPasswords(updated);
    localStorage.setItem("rustylock_saves", JSON.stringify(updated));
  };
  return (
    <>
      <div className="logo-wrapper">
        <img src="/logo.png" alt="Rustylock Logo" className="rustylock-logo" />
      </div>
  
      <div className="dual-card-layout">
        <div className="card left">
          <h1 className="title">Générateur de mots de passe sécurisé</h1>
          <p className="version">Version 1.0.0</p>
          <p className="subtitle">Utilisez ce générateur pour créer des mots de passe forts et uniques.</p>
          <p className="subtitle">Vous pouvez également sauvegarder vos mots de passe pour un accès facile.</p>
          <p className="subtitle">Sélectionnez les options ci-dessous pour personnaliser votre mot de passe.</p>
            <p className="subtitle">Après 30 secondes d'inactivité, vous serez automatiquement déconnecté.</p>
          <label>
            <input type="checkbox" checked={phraseMode} onChange={() => setPhraseMode(!phraseMode)} /> Phrase de passe
          </label>
  
          <label>Longueur:
            <input type="number" value={length} onChange={(e) => setLength(parseInt(e.target.value))} min={4} max={64} />
          </label>
  
          {!phraseMode && (
            <>
              <label><input type="checkbox" checked={uppercase} onChange={() => setUppercase(!uppercase)} /> Majuscules</label>
              <label><input type="checkbox" checked={lowercase} onChange={() => setLowercase(!lowercase)} /> Minuscules</label>
              <label><input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} /> Chiffres</label>
              <label><input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} /> Symboles</label>
            </>
          )}
  
          <div className="field-row">
            <input type="text" placeholder="www.site.com" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            <input type="text" placeholder="User" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
  
          <div className="field-row">
            <button onClick={handleGenerate}>Générer</button>
            <input type="text" readOnly value={password} />
          </div>
  
          <div className="field-row">
            <button onClick={handleCopy}>{copied ? "Copié !" : "Copier"}</button>
            <button onClick={handleSave}>Sauvegarder</button>
          </div>
        </div>
  
        <div className="card right">
          <h3>Sauvegardes :</h3>
          <ul>
            {savedPasswords.map((entry, i) => (
              <li key={i}>
                Site : &nbsp; <strong>{entry.site}</strong> (User : &nbsp; <em>{entry.user}</em>) :
                <input
                  type={show === i ? "text" : "password"}
                  value={entry.pass}
                  readOnly
                />
                <button className="eye" onClick={() => setShow(show === i ? null : i)}>👁️</button>
                <button className="delete" onClick={() => handleDelete(i)}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );  
}

export default App;
