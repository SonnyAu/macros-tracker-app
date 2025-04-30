const net = require("net");
const fs = require("fs");
const path = require("path");

// Server configuration
const PORT = 8080;
const HOST = "127.0.0.1";

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
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("Client disconnected");

    if (dataBuffer.length > 0) {
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

          // Save the received image data
          const timestamp = Date.now();
          const imagePath = path.join(
            receivedDir,
            `received_image_${timestamp}.dat`
          );
          fs.writeFileSync(imagePath, dataBuffer);

          console.log(`Saved received data to ${imagePath}`);
          console.log(
            `Image info - Size: ${dataBuffer.length} bytes, Header indicates: ${height}x${width}`
          );
        } catch (err) {
          console.error("Error processing formatted packet:", err);

          // Save as regular image file if header parsing fails
          const timestamp = Date.now();
          const imagePath = path.join(
            receivedDir,
            `received_image_${timestamp}.jpg`
          );
          fs.writeFileSync(imagePath, dataBuffer);

          console.log(`Saved regular image to ${imagePath}`);
        }
      } else {
        // Save as regular image
        const timestamp = Date.now();
        const imagePath = path.join(
          receivedDir,
          `received_image_${timestamp}.jpg`
        );
        fs.writeFileSync(imagePath, dataBuffer);

        console.log(`Saved received image to ${imagePath}`);
      }
    }
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`TCP server running on ${HOST}:${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
