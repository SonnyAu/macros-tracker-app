const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Start Python server
const startPythonServer = () => {
  console.log("Starting Python server...");

  const scriptsDir = path.join(__dirname);
  const pythonCommand = process.platform === "win32" ? "python" : "python3";
  const pythonScript = path.join(scriptsDir, "server.py");

  // Make sure the received_images directory exists
  const receivedImagesDir = path.join(__dirname, "..", "received_images");
  if (!fs.existsSync(receivedImagesDir)) {
    fs.mkdirSync(receivedImagesDir, { recursive: true });
  }

  // Start the Python server
  const pythonProcess = spawn(pythonCommand, [pythonScript], {
    cwd: scriptsDir,
    stdio: "inherit",
    shell: true, // Explicitly use shell
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python server:", err);
  });

  return pythonProcess;
};

// Start Expo app
const startExpoApp = () => {
  console.log("Starting Expo app...");

  // Wait a moment to let the Python server initialize
  setTimeout(() => {
    const expoProcess = spawn("npx", ["expo", "start"], {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      shell: true, // Explicitly use shell
    });

    expoProcess.on("error", (err) => {
      console.error("Failed to start Expo app:", err);
    });
  }, 2000);
};

// Start both
const startAll = () => {
  const pythonProcess = startPythonServer();

  // Start Expo app after Python server
  startExpoApp();

  // Handle shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    process.exit(0);
  });
};

// Run if this script is called directly
if (require.main === module) {
  startAll();
}

module.exports = { startAll };
