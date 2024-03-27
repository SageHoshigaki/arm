const axios = require('axios');

exports.handler = async function(event) {
  try {
    if (!event.body) throw new Error('No event body.');

    const body = JSON.parse(event.body);
    const documentUrl = body.customData?.document;
    if (!documentUrl) throw new Error('No document URL found.');

    // Fetch the PDF from the URL
    const response = await axios({
      url: documentUrl,
      method: 'GET',
      responseType: 'arraybuffer' // Necessary for binary content like PDF
    });

    // Log that the PDF has been fetched; you can log more details if needed
    console.log('PDF fetched successfully. Size:', response.data.length, 'bytes');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF fetched and logged" }),
    };
  } catch (error) {
    console.error('Error in process:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process PDF", error: error.message }),
    };
  }
};
