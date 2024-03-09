const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  try {
    if (!event.body) throw new Error('No event body.');

    const incomingData = JSON.parse(event.body);
    if (!incomingData.customData || !incomingData.customData.document) {
      throw new Error('Missing customData or document URL.');
    }

    // Sanitize the document URL
    let documentUrl = incomingData.customData.document.replace(/["'()]/g, "");

    // Download the PDF document
    const response = await axios.get(documentUrl, { responseType: 'arraybuffer' });
    const tempFilePath = path.join('/tmp', 'letter.pdf');
    fs.writeFileSync(tempFilePath, response.data);

    // Setup for Lob API
    const lobApiKey = process.env.LOB_API_KEY; // Ensure this is set in your Netlify environment variables
    const form = new FormData();
    form.append('description', 'Letter from GoHighLevel');
    form.append('to[name]', 'Recipient Name'); // Replace placeholder values
    form.append('to[address_line1]', 'Recipient Address Line 1');
    form.append('to[address_city]', 'Recipient City');
    form.append('to[address_state]', 'Recipient State');
    form.append('to[address_zip]', 'Recipient Zip');
    form.append('from[name]', 'Your Name or Company');
    form.append('from[address_line1]', 'Your Address Line 1');
    form.append('from[address_city]', 'Your City');
    form.append('from[address_state]', 'Your State');
    form.append('from[address_zip]', 'Your Zip');
    form.append('file', fs.createReadStream(tempFilePath));
    form.append('color', true);

    // Send the letter through Lob
    const lobResponse = await axios.post('https://api.lob.com/v1/letters', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Basic ${Buffer.from(lobApiKey + ':').toString('base64')}`
      }
    });

    // Process Lob's response (e.g., log the tracking number or send it back to GoHighLevel)
    console.log('Lob response:', lobResponse.data);
    const trackingNumber = lobResponse.data.tracking_number;
    console.log('Tracking Number:', trackingNumber);

    // Example: Update GoHighLevel with the tracking information
    // Replace 'your_gohighlevel_webhook_url_here' with your actual webhook URL
    const webhookUrl = 'your_gohighlevel_webhook_url_here';
    await axios.post(webhookUrl, {
      trackingNumber: trackingNumber,
      message: "Document sent successfully."
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Document processed and sent via Lob successfully" }),
    };
  } catch (error) {
    console.error('Error in process:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process data", error: error.message }),
    };
  }
};
