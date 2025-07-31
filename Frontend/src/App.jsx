import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
// ... chart imports

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload", formData, authHeader);
    fetchAnalysis();
  };

  const fetchAnalysis = async () => {
    const res = await axios.get("http://localhost:8000/analyze", authHeader);
    setData(res.data);
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <Signup />
        <hr />
        <Login onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h2>Customer Behavior Dashboard (Secure)</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload & Analyze</button>
      {data && (
        <>
          {/* ...analysis and chart logic here... */}
        </>
      )}
    </div>
  );
}

export default App;
