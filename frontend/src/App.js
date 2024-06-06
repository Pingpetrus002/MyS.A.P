// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => setData(data));
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1>React Frontend</h1>
          {data ? <p>{data.message}</p> : <p>Loading...</p>}
        </header>
      </div>
  );
}

export default App;

