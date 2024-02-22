
import './App.css';
import React from 'react';
import WebhookTest from './WebhookTest'; // Import your webhook component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React App with Netlify Function</h1>
      </header>
      <main>
        <WebhookTest /> {/* Use your webhook component */}
      </main>
    </div>
  );
}

export default App;
