const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    if (!event.body) throw new Error('No event body.');

    const incomingData = JSON.parse(event.body);
    const customData = incomingData.customData;

    if (!customData || !customData.document) {
      throw new Error('Missing required fields.');
    }

    const documentUrl = customData.document;
    // Basic validation of URL
    if (!documentUrl.startsWith('http://') && !documentUrl.startsWith('https://')) {
      throw new Error('Invalid document URL.');
    }

    // Download the document
    const responseDocument = await axios.get(documentUrl, { responseType: 'arraybuffer' });
    const documentContent = responseDocument.data;

    // Prepare Lob API request
    const lobApiKey = 'your_lob_api_key';
    const lobUrl = 'https://api.lob.com/v1/letters';

    const lobPayload = {
      description: 'Mail Delivery Document',
      to: {
        // Add recipient details
      },
      from: {
        // Add sender details
      },
      file: Buffer.from(documentContent).toString('base64'),
      color: true // Example parameter, customize as needed
    };

    const lobResponse = await axios.post(lobUrl, lobPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(lobApiKey + ':').toString('base64')}`
      }
    });

    console.log('Document sent to Lob successfully:', lobResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Document processed and sent to Lob successfully" }),
    };
  } catch (error) {
    console.error('Error in process:', error.message);

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ message: "Failed to process data", error: error.message }),
    };
  }
};
