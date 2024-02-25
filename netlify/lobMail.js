const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    if (!event.body) throw new Error('No event body.');

    const incomingData = JSON.parse(event.body);
    const customData = incomingData.customData;

    if (!customData || !customData.document || !customData.Email) {
      throw new Error('Missing required fields.');
    }

    const documentUrl = customData.document;
    // Basic validation of URL
    if (!documentUrl.startsWith('http://') && !documentUrl.startsWith('https://')) {
      throw new Error('Invalid document URL.');
    }

    const userData = {
      firstName: customData['first name'],
      lastName: customData['last name'],
      email: customData.Email,
      phone: customData.Phone, // Assuming phone number is under "Phone"
      document: documentUrl
    };

    const webhookUrl = 'YOUR_WEBHOOK_URL';

    // Sending reduced payload to the specified webhook URL
    await axios.post(webhookUrl, userData);
    console.log('Data sent successfully');

    // Download the document
    const responseDocument = await axios({
      url: documentUrl,
      method: 'GET',
      responseType: 'stream'
    });

    const tempPath = path.join('/tmp', path.basename(documentUrl));
    const writer = fs.createWriteStream(tempPath);

    responseDocument.data.pipe(writer);

    return await new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "Data and document processed successfully" }),
      }));
      writer.on('error', () => reject({
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to write document" }),
      }));
    });
  } catch (error) {
    console.error('Error in process:', error.message);

    // Return a response with appropriate status code and error message
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ message: "Failed to process data", error: error.message }),
    };
  }
};
