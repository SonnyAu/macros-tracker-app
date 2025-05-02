const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Check if Python is installed
 */
function checkPythonInstalled() {
  try {
    // Determine which Python command to use
    const pythonCommand =
      process.platform === "win32" ? "python --version" : "python3 --version";
    const output = execSync(pythonCommand, { encoding: "utf8" });
    console.log(`Python detected: ${output.trim()}`);
    return true;
  } catch (error) {
    console.error("Python is not installed or not in PATH");
    console.error(
      "Please install Python 3.8 or later: https://www.python.org/downloads/"
    );
    return false;
  }
}

/**
 * Install Python dependencies
 */
function installPythonDependencies() {
  try {
    const scriptsDir = path.join(__dirname);
    const requirementsPath = path.join(scriptsDir, "requirements.txt");

    // Check if requirements.txt exists
    if (!fs.existsSync(requirementsPath)) {
      console.error("requirements.txt not found");
      return false;
    }

    // Determine which pip command to use
    const pipCommand = process.platform === "win32" ? "pip" : "pip3";

    // Install dependencies
    console.log("Installing Python dependencies...");
    execSync(`${pipCommand} install -r "${requirementsPath}"`, {
      stdio: "inherit",
      cwd: scriptsDir,
    });

    console.log("Python dependencies installed successfully");
    return true;
  } catch (error) {
    console.error("Failed to install Python dependencies:", error.message);
    return false;
  }
}

/**
 * Setup the Python environment
 */
function setup() {
  // Check if Python is installed
  const pythonInstalled = checkPythonInstalled();
  if (!pythonInstalled) {
    return false;
  }

  // Install Python dependencies
  const dependenciesInstalled = installPythonDependencies();
  if (!dependenciesInstalled) {
    return false;
  }

  console.log("Setup completed successfully!");
  return true;
}

// Run setup if this script is executed directly
if (require.main === module) {
  const success = setup();
  if (!success) {
    console.error("Setup failed");
    process.exit(1);
  }
}

module.exports = { setup };
