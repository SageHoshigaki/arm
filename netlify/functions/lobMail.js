const axios = require("axios");

exports.handler = async function (event) {
  try {
    if (!event.body) throw new Error("No event body.");

    const body = JSON.parse(event.body);

    console.log("Custom Data:", body.customData);
    console.log("Full Body:", body);

    // Set a timeout for the Axios request
    const axiosConfig = {
      timeout: 5000, // timeout after 5 seconds
    };

    const response = await axios.post(
      "https://mailer-vert-delta.vercel.app/api/scraper",
      {
        MailData: body.customData,
      },
      axiosConfig
    );

    console.log("Response from API:", response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data posted successfully",
        data: response.data,
      }),
    };
  } catch (error) {
    console.error("Error in process:", error);

    // Handle specific timeout error
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out:", error.message);
      return {
        statusCode: 408, // Request Timeout
        body: JSON.stringify({
          message: "Request timed out",
          error: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to post data",
        error: error.message,
      }),
    };
  }
};
