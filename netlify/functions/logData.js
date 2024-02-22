// Inside your Netlify function file, e.g., logData.js

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
      // Only allow POST requests
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }
  
    try {
      const data = JSON.parse(event.body); // Parse the incoming JSON data
      console.log('Received data:', data); // Log the received data to Netlify function logs
  
      // You can process the data here as needed
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data logged successfully' }),
      };
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad request' }),
      };
    }
  };
  