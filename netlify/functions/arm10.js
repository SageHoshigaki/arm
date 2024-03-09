const axios = require('axios');

exports.handler = async function(event, context) {
  // Assuming 'event' contains the incoming webhook data as shown in your log
  const incomingData = JSON.parse(event.body);

  // Extracting customData and other relevant information from the incomingData
  const customData = incomingData.customData;
  const documentUrl = customData.document; // Document URL from customData
  const userData = {
    firstName: customData['first name'],
    lastName: customData['last name'],
    email: customData.Email,
    country: customData.Country,
    zip: customData.Zip,
    city: incomingData.city,
    state: incomingData.state,
    country: incomingData.country,
    postalCode: incomingData.postalCode,
    fullAddress: incomingData.fullAddress,
    document: documentUrl // Including the document URL
  };

  // Construct the payload to send to another service
  const payloadToSend = {
    ...userData,
    // Add any additional data or formatting here
  };

  // URL to the webhook or API where you want to send the data
  const webhookUrl = 'https://services.leadconnectorhq.com/hooks/dG3FsvCYnI8qISnp4jfv/webhook-trigger/20db08e8-18ef-4585-a842-5ba404d58d6c';

  try {
    // Sending the payload to the specified webhook URL
    const response = await axios.post(webhookUrl, payloadToSend);

    // Log the response to console for debugging
    console.log('Data sent successfully:', response.data);

    // Respond back to the original caller if needed
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data sent successfully" }),
    };
  } catch (error) {
    console.error('Error sending data:', error);

    // Respond back with error message
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ message: "Failed to send data", error: error.message }),
    };
  }
};
