import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const rawText = data.msg;

      const cleanText = rawText
        .replace(/:\s*\*\*\s*/g, ': ')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/^\*+\s?/gm, '')
        .replace(/\n{2,}/g, '\n\n')
        .trim();

      setResponse(cleanText);
    } catch (err) {
      console.error("Error uploading file:", err);
      setResponse("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="root">
      <h1>Image Description Generator</h1>

      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="file-input"
      />

      <button onClick={uploadFile} className="upload-button">
        {loading ? "Processing..." : "Get Description"}
      </button>

      <div className="response-box">
        {response || "Your file description will appear here..."}
      </div>
    </div>
  )
}

export default App;
