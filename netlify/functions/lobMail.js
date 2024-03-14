exports.handler = async function(event) {
  try {
    if (!event.body) throw new Error('No event body.');

    console.log('Event body:', event.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event body logged successfully" }),
    };
  } catch (error) {
    console.error('Error in process:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to log event body", error: error.message }),
    };
  }
};
