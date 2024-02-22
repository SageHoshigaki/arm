exports.handler = async function(event, context) {
    // Assuming you're receiving JSON data in the body of the request
    const data = JSON.parse(event.body);
    
    console.log("Received Document Data:", data);
  
    // Responding to the request indicating success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Document data logged successfully" })
    };
  };
  