const axios = require("axios");

exports.handler = async function (event) {
  try {
    // Check if the event has a body
    if (!event.body) throw new Error("No event body.");

    // Parse the event body
    const body = JSON.parse(event.body);

    // Log the entire body to see what's received
    console.log(body.customData);
    console.log(body);

    const Clientdata = {};

    // Continue processing as needed
    let documentUrl = body.customData?.document;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF fetched and stored successfully" }),
    };
  } catch (error) {
    console.error("Error in process:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to process PDF",
        error: error.message,
      }),
    };
  }
};
