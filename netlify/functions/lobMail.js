const axios = require("axios");

exports.handler = async function (event) {
  try {
    if (!event.body) throw new Error("No event body.");

    const body = JSON.parse(event.body);

    // Log the entire body to see what's received
    console.log("Custom Data:", body.customData);
    console.log("Full Body:", body);

    const response = await axios.post(
      "https://mailer-vert-delta.vercel.app/api/scraper",
      {
        MailData: body.customData,
      }
    );

    console.log("Response from API:", response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data posted successfully" }),
    };
  } catch (error) {
    console.error("Error in process:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to post data",
        error: error.message,
      }),
    };
  }
};
