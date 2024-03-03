const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Check if event body is present
    if (!event.body) throw new Error('No event body.');

    // Log incoming data
    console.log('Received event:', event.body);
    const incomingData = JSON.parse(event.body);

    // Ensure customData is present and log it
    if (!incomingData.customData) throw new Error('Missing customData.');
    console.log('Custom data:', incomingData.customData);

    // Extract and log the document URL
    const documentUrl = incomingData.customData.document;
    if (!documentUrl) throw new Error('Document URL is missing.');
    console.log('Document URL:', documentUrl);

    // Simulate document download by logging the URL
    // In a real scenario, you might download or process the document here
    console.log(`Simulated document download from URL: ${documentUrl}`);

    // Optionally, fetch and log the document content (simulated here)
    // Commented out because we're focusing on logging, not real downloading
    // const response = await axios.get(documentUrl, { responseType: 'arraybuffer' });
    // console.log('Downloaded document content:', response.data);

    // Log success message
    console.log('Document processed successfully.');

    // Send processed document URL back to Go High Level webhook
    const webhookUrl = 'https://services.leadconnectorhq.com/hooks/dG3FsvCYnI8qISnp4jfv/webhook-trigger/80a4f41b-d083-4b54-acc4-c53580d8b86c';
    await axios.post(webhookUrl, { documentUrl });

    console.log('Processed document URL sent to Go High Level webhook.');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Document processed successfully" }),
    };
  } catch (error) {
    console.error('Error in process:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process data", error: error.message }),
    };
  }
};
