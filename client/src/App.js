import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );
      setStatus("Upload successful: " + res.data.path);
    } catch (error) {
      setStatus("Upload failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload PDF Document</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default App;
