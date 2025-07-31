import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await axios.post("http://localhost:8000/token", params);
    localStorage.setItem("token", res.data.access_token);
    onLogin();
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
