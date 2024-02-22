
const axios = require('axios'); // Make sure axios is installed

exports.handler = async function(event) {
  console.log("Received event body:", event.body);

  let customData;
  try {
    const payload = JSON.parse(event.body);
    customData = payload.customData;
    console.log("Extracted customData:", customData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad request" })
    };
  }

  const queryParams = new URLSearchParams({
    name: `${customData['first name']} ${customData['last name']}`,
    email: customData.email,
    country: customData.Country,
    zip: customData.Zip
  }).toString();

  const thinkificUrl = `https://www.askjensanford.com/order?${queryParams}`;
  console.log('Constructed Thinkific URL:', thinkificUrl);

  // Define the GoHighLevel webhook URL
  const goHighLevelWebhookUrl = "https://services.leadconnectorhq.com/hooks/dG3FsvCYnI8qISnp4jfv/webhook-trigger/36af9f0b-14f6-4bd1-a139-653f83d90011"

  try {
    // Sending the constructed Thinkific URL to GoHighLevel webhook
    const response = await axios.post(goHighLevelWebhookUrl, {
      thinkificUrl: thinkificUrl,
    });

    console.log('Response from GoHighLevel webhook:', response.data);

    // Responding to indicate success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "URL sent to GoHighLevel successfully", response: response.data })
    };
  } catch (error) {
    console.error('Error sending URL to GoHighLevel:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending URL to GoHighLevel" })
    };
  }
};
