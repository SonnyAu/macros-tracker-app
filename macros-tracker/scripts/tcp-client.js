const net = require("net");
const fs = require("fs");
const path = require("path");

// Server IP and port
const serverIP = "127.0.0.1";
const serverPort = 8080;

// Function to send the image over TCP
function sendImage(imagePath) {
  console.log(`Sending image: ${imagePath}`);

  // Create a socket connection
  const client = new net.Socket();

  client.connect(serverPort, serverIP, () => {
    console.log("Connected to server");

    // Read the image file as binary data
    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`Image size: ${imageBuffer.length} bytes`);

    // Send the image buffer as a TCP packet
    client.write(imageBuffer);
    console.log("Image sent");

    // Close the connection after sending
    client.end();
  });

  client.on("close", () => {
    console.log("Connection closed");
  });

  client.on("error", (err) => {
    console.error("Error:", err);
  });
}

// Function to create a sample image if none exists
function createSampleImage() {
  // Look in received_images directory first
  const receivedDir = path.join(__dirname, "../received_images");
  const sampleDir = path.join(__dirname, "../assets");

  // First check if there are any images in received_images directory
  if (fs.existsSync(receivedDir)) {
    const receivedFiles = fs.readdirSync(receivedDir);
    const receivedImages = receivedFiles.filter((file) =>
      [".jpg", ".jpeg", ".png", ".dat"].includes(
        path.extname(file).toLowerCase()
      )
    );

    if (receivedImages.length > 0) {
      const imagePath = path.join(receivedDir, receivedImages[0]);
      console.log(`Using previously received image: ${imagePath}`);
      return imagePath;
    }
  }

  // If no images in received_images, check assets directory
  const samplePath = path.join(sampleDir, "sample_image.jpg");

  // Check if we already have a sample image
  if (fs.existsSync(samplePath)) {
    return samplePath;
  }

  // Ensure assets directory exists
  if (!fs.existsSync(sampleDir)) {
    console.log("Creating assets directory...");
    fs.mkdirSync(sampleDir, { recursive: true });
  }

  // Create a dummy test image (1x1 pixel JPEG)
  console.log("No image found. Creating a test image...");
  const testImageData = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
    0x7f, 0x3f, 0xff, 0xd9,
  ]);

  fs.writeFileSync(samplePath, testImageData);
  console.log(`Created test image at ${samplePath}`);
  return samplePath;

  // No sample image exists, check if there are any images in the assets directory
  if (!fs.existsSync(sampleDir)) {
    console.error(
      "Assets directory not found. Please place an image in the assets directory."
    );
    process.exit(1);
  }

  const files = fs.readdirSync(sampleDir);
  const imageFiles = files.filter((file) =>
    [".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length > 0) {
    return path.join(sampleDir, imageFiles[0]);
  }

  console.error(
    "No images found in assets directory. Please add an image to test with."
  );
  process.exit(1);
}

// Get image path from command line or use sample
const imagePath = process.argv[2] || createSampleImage();

// Send the image
sendImage(imagePath);

console.log("\nHow to know this works:");
console.log(
  "1. Make sure the tcp-server.js is running in another terminal window"
);
console.log(
  "2. Check the console output for successful connection and image sending"
);
console.log(
  "3. The server will save the received image in the received_images directory"
);
console.log(
  "4. Compare the size of the original and received files to verify data integrity\n"
);
