const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Determine if we're in development or production
const isDev = process.env.NODE_ENV !== "production";

/**
 * Start the Python server
 */
function startPythonServer() {
  console.log("Starting Python server...");

  // Get the path to the Python script
  const scriptsDir = path.join(__dirname);
  const pythonScript = path.join(scriptsDir, "server.py");

  // Check if Python is installed
  const pythonCommand = process.platform === "win32" ? "python" : "python3";

  // Make sure the received_images directory exists
  const receivedImagesDir = path.join(__dirname, "..", "received_images");
  if (!fs.existsSync(receivedImagesDir)) {
    fs.mkdirSync(receivedImagesDir, { recursive: true });
  }

  // Start the Python server
  const pythonProcess = spawn(pythonCommand, [pythonScript], {
    cwd: scriptsDir,
    stdio: "inherit",
    shell: true, // Explicitly use shell for Windows compatibility
  });

  // Log errors and exit
  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python server:", err);
  });

  // Log when the process exits
  pythonProcess.on("close", (code) => {
    console.log(`Python server exited with code ${code}`);
  });

  // Handle application shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down Python server...");
    pythonProcess.kill("SIGINT");
    process.exit(0);
  });

  return pythonProcess;
}

// Start the server if this script is run directly
if (require.main === module) {
  startPythonServer();
}

module.exports = { startPythonServer };
