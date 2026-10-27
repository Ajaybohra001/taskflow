import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    fetch("/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return <p>API status: {status}</p>;
}

export default App;
