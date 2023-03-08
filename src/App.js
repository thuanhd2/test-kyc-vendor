import React from 'react';
import './App.css';
import { fileToBase64, verifyDocument } from './lib/shufti';
import { saveVerifyResult } from './lib/db';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [verifyResult, setVerifyResult] = React.useState(null);
  const handleSelectFile = async (e) => {
    setLoading(true);
    setVerifyResult(null);
    const file = e.target.files[0];
    const imageBase64 = await fileToBase64(file);
    const verifyResult = await verifyDocument(imageBase64);
    setLoading(false);
    setVerifyResult(verifyResult);
    saveVerifyResult(verifyResult);
  }
  return (
    <div className="App">
      {
        loading ? <div>Loading, please wait!</div> : <input type='file' accept='image/*' onChange={handleSelectFile} text="Select file" />
      }
      {
        <pre className='output'>{verifyResult ? JSON.stringify(verifyResult, null, 2) : "output will show here..."}</pre>
      }
    </div>
  );
}

export default App;
