const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.handler = async function(event, context) {
  try {
    if (!event.body) throw new Error('No event body.');

    console.log('Received event:', event.body);
    const incomingData = JSON.parse(event.body);

    if (!incomingData.customData || !incomingData.customData.document) {
      throw new Error('Missing customData or document URL.');
    }
    const documentUrl = incomingData.customData.document;
    console.log('Document URL:', documentUrl);

    // Download the PDF document
    const response = await axios({
      method: 'get',
      url: documentUrl,
      responseType: 'arraybuffer'
    });
    fs.writeFileSync('/tmp/letter.pdf', response.data);

    // Prepare the PDF for sending to Lob
    const form = new FormData();
    form.append('description', 'Letter from GoHighLevel');
    form.append('to[name]', 'Recipient Name');
    form.append('to[address_line1]', 'Recipient Address Line 1');
    form.append('to[address_city]', 'Recipient City');
    form.append('to[address_state]', 'Recipient State');
    form.append('to[address_zip]', 'Recipient Zip');
    form.append('from[name]', 'Your Name or Company');
    form.append('from[address_line1]', 'Your Address Line 1');
    form.append('from[address_city]', 'Your City');
    form.append('from[address_state]', 'Your State');
    form.append('from[address_zip]', 'Your Zip');
    form.append('file', fs.createReadStream('/tmp/letter.pdf'));
    form.append('color', true);

    const lobApiKey = process.env.LOB_API_KEY;
    const lobResponse = await axios.post('https://api.lob.com/v1/letters', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Basic ${Buffer.from(`${lobApiKey}:`).toString('base64')}`
      }
    });

    console.log('Lob response:', lobResponse.data);

    // Extract the tracking number from Lob response (assuming it's in the response)
    const trackingNumber = lobResponse.data.tracking_number;

    // Update GoHighLevel with the tracking information
    const webhookUrl ="https://services.leadconnectorhq.com/hooks/dG3FsvCYnI8qISnp4jfv/webhook-trigger/80a4f41b-d083-4b54-acc4-c53580d8b86c";
    await axios.post(webhookUrl, {
      trackingNumber: trackingNumber,
      documentUrl: documentUrl
    });

    console.log('Tracking number sent to Go High Level.');

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
