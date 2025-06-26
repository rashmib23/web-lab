import React, { useState } from 'react';

function App() {
  const [name, setName] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Live Name Updater</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />
      <h1>{name}</h1>
    </div>
  );
}

export default App;
