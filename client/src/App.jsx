import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

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
        .replace(/:\s*\*\*\s*/g, ': ')       // remove "**" after colons
        .replace(/\*\*(.*?)\*\*/g, '$1')     // remove surrounding **bold**
        .replace(/^\*+\s?/gm, '')            // remove lines starting with "*"
        .replace(/\n{2,}/g, '\n\n')          // normalize multiple line breaks
        .trim();                             // remove leading/trailing whitespace

      setResponse(cleanText);
    } catch (err) {
      console.error("Error uploading file:", err);
      setResponse("Error uploading file.");
    }
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Get Description</button>

      <div style={{ whiteSpace: 'pre-line', marginTop: '20px' }}>
        {response}
      </div>
    </div>
  )
}

export default App;
