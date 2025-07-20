import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [file, setFile] = useState(0);
  const [response,setResponse]=useState("");
 const uploadFile=async(e)=>{
  const formData=new FormData();
  formData.append("file",file);
  const response=await fetch("http://localhost:3000/upload",{
    method:"POST",
    body:formData,
  });
 const data = await response.json();
const rawText = data.msg;

const cleanText = rawText
  .replace(/:\s*\*\*\s*/g, ': ')       // remove "**" after colons (e.g., "Key Elements: **")
  .replace(/\*\*(.*?)\*\*/g, '$1')     // remove surrounding **bold** if any
  .replace(/^\*+\s?/gm, '')            // remove lines starting with "*"
  .replace(/\n{2,}/g, '\n\n')          // normalize multiple line breaks
  .trim();                             // remove leading/trailing whitespace

setResponse(cleanText);

 };

  return (
    <>
     <div>
      <input onChange={(e)=>{setFile(e.target.files[0])}}type ="file" name="file"></input>
      <button onClick={uploadFile}>Get Description</button>
      <div style={{ whiteSpace: 'pre-line', marginTop: '20px' }}>
  {response}
</div>
     </div>
    </>
  )
}

export default App
