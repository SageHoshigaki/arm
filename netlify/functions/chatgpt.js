// Import necessary libraries
const { PDFDocument } = require('pdf-lib');

// Function to edit PDF sections
async function editPDF(pdfData) {
    try {
        // Log PDF data
        console.log('Original PDF data:', pdfData);

        // Process PDF data as needed
        // For example, you can use pdf-lib to edit the PDF
        
        // Load the PDF data
        const pdfDoc = await PDFDocument.load(pdfData);
        
        // Example: Add text to the first page
        const firstPage = pdfDoc.getPages()[0];
        firstPage.drawText('Edited by Netlify Function', {
            x: 50,
            y: 50,
            size: 30,
        });
        
        // Serialize the modified PDF
        const modifiedPdfBytes = await pdfDoc.save();

        // Return the edited PDF bytes
        return modifiedPdfBytes;
    } catch (error) {
        console.error('Error editing PDF:', error);
        throw new Error('Error editing PDF');
    }
}

// Function to handle HTTP requests
exports.handler = async function(event, context) {
    try {
        // Extract PDF data from request body
        const pdfData = event.body;

        // Log received PDF data
        console.log('Received PDF data:', pdfData);

        // Edit PDF
        const editedPdfBytes = await editPDF(pdfData);

        // Return edited PDF
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
            body: editedPdfBytes.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while editing the PDF' }),
        };
    }
};
