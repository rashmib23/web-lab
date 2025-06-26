import React, { useState } from 'react';

function App() {
  const [employee, setEmployee] = useState({
    name: "John Doe",
    address: "123 Main St",
    company: "Tech Corp"
  });

  const handleChange = () => {
    setEmployee({
      name: "Jane Smith",
      address: "456 Park Ave",
      company: "Tech Corp"
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Employee Info</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Address:</strong> {employee.address}</p>
      <p><strong>Company:</strong> {employee.company}</p>
      <button onClick={handleChange}>CHANGE</button>
    </div>
  );
}

export default App;