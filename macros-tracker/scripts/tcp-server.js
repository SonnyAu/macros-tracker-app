const net = require("net");
const fs = require("fs");
const path = require("path");

// Server configuration
const PORT = 8081;
const HOST = "127.0.0.1";

// Mock AI model response data
const mockAIResponse = {
  foodItem: {
    name: "Pancakes",
    servingSize: {
      amount: 138,
      unit: "grams",
    },
    nutrition: {
      calories: 300,
      macros: {
        protein: 8,
        carbohydrates: 40,
        fat: 11,
        fiber: 1,
      },
      micronutrients: {
        sodium: 600,
        potassium: 200,
        cholesterol: 70,
        vitaminA: 100,
        vitaminC: 1,
        calcium: 150,
        iron: 2,
      },
    },
  },
};

// Create directory for received images if it doesn't exist
const receivedDir = path.join(__dirname, "../received_images");
if (!fs.existsSync(receivedDir)) {
  console.log(`Creating directory: ${receivedDir}`);
  fs.mkdirSync(receivedDir, { recursive: true });
}

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("Client connected:", socket.remoteAddress);

  let dataBuffer = Buffer.alloc(0);

  // Handle incoming data
  socket.on("data", (chunk) => {
    console.log(`Received ${chunk.length} bytes of data`);
    dataBuffer = Buffer.concat([dataBuffer, chunk]);

    // Process the image after receiving the data
    // Set a small timeout to allow any final packets to arrive
    setTimeout(() => {
      processImage(dataBuffer, socket);
    }, 100);
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("Client has ended the connection");
  });

  socket.on("close", () => {
    console.log("Client connection closed");
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Function to process the image and send AI response
function processImage(dataBuffer, socket) {
  // Check if we've already processed this connection
  if (!socket.writable || socket._processed) {
    return;
  }

  // Mark as processed to avoid processing multiple times
  socket._processed = true;

  if (dataBuffer.length > 0) {
    // Save the received image data (for debugging/verification)
    const timestamp = Date.now();
    let imagePath;

    // Check if data appears to be our formatted packet
    if (dataBuffer.length >= 6) {
      try {
        // Try to parse the header as created in the scanner.tsx
        const imageSize = dataBuffer.readUInt16BE(0);
        const height = dataBuffer.readUInt16BE(2);
        const width = dataBuffer.readUInt16BE(4);

        console.log(
          `Parsed header: size=${imageSize}, height=${height}, width=${width}`
        );

        imagePath = path.join(receivedDir, `received_image_${timestamp}.dat`);
        fs.writeFileSync(imagePath, dataBuffer);

        console.log(`Saved received data to ${imagePath}`);
        console.log(
          `Image info - Size: ${dataBuffer.length} bytes, Header indicates: ${height}x${width}`
        );
      } catch (err) {
        console.error("Error processing formatted packet:", err);

        // Save as regular image file if header parsing fails
        imagePath = path.join(receivedDir, `received_image_${timestamp}.jpg`);
        fs.writeFileSync(imagePath, dataBuffer);

        console.log(`Saved regular image to ${imagePath}`);
      }
    } else {
      // Save as regular image
      imagePath = path.join(receivedDir, `received_image_${timestamp}.jpg`);
      fs.writeFileSync(imagePath, dataBuffer);

      console.log(`Saved received image to ${imagePath}`);
    }

    // Simulate AI processing delay
    console.log("Processing image with AI model...");
    setTimeout(() => {
      // Send the mock AI response as JSON
      const responseData = JSON.stringify(mockAIResponse, null, 2);
      console.log("Sending AI model response to client");

      try {
        if (socket.writable) {
          socket.write(responseData);
          console.log("Response data sent successfully");
        } else {
          console.error("Socket not writable, can't send response");
        }
      } catch (err) {
        console.error("Error sending response to client:", err);
        console.log(
          "Client may have disconnected. Would have sent:",
          responseData
        );
      }
    }, 500);
  }
}

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`TCP server running on ${HOST}:${PORT}`);
  console.log(`This server simulates an AI food recognition model`);
  console.log(`It will return nutritional information for food images`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
