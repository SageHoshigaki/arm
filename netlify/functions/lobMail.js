const axios = require('axios');

exports.handler = async function(event) {
  try {
    if (!event.body) throw new Error('No event body.');

    const body = JSON.parse(event.body);
    let documentUrl = body.customData?.document;

    if (!documentUrl) throw new Error('No document URL found.');

    // Trim whitespace and encode the URL
    documentUrl = encodeURI(documentUrl.trim());
    console.log('Fetching PDF from:', documentUrl);

    const response = await axios.get(documentUrl, {
      responseType: 'arraybuffer'
    });

    const pdfBuffer = response.data;
    console.log('PDF fetched successfully');
    // Additional processing can be done here

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF fetched and stored successfully" }),
    };
  } catch (error) {
    console.error('Error in process:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process PDF", error: error.message }),
    };
  }
};
