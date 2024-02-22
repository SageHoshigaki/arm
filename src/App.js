
import './App.css';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React App with Netlify Function</h1>
      </header>
      <main>
        <webhookTest /> {/* Use your webhook component */}
      </main>
    </div>
  );
}

export default App;
