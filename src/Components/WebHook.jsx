import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SimulatedWebhookReceiver() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate receiving webhook data by fetching from a mock API
    const fetchData = async () => {
      const url = 'https://jsonplaceholder.typicode.com/posts/1'; // Mock API endpoint
      try {
        const response = await axios.get(url);
        console.log('Simulated received data:', response.data);
        setData(response.data); // Simulate handling received webhook data
      } catch (error) {
        console.error('Error simulating webhook data reception:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Simulated Webhook Data Reception</h1>
      {data ? (
        <div>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Body:</strong> {data.body}</p>
        </div>
      ) : (
        <p>No data received yet.</p>
      )}
    </div>
  );
}

export default SimulatedWebhookReceiver;
