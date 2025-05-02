# 📸 Macros Tracker App: Comprehensive Setup and Testing Guide

This guide walks you through setting up and running the Macros Tracker App — a React Native + Python application that allows users to scan food items and get nutritional data using AI and computer vision.

---

## 🔧 Prerequisites

Before starting, ensure the following are installed on your computer:

### 1. **Node.js and npm (Version 14.0 or higher)**
- To check if Node.js is installed:
  ```bash
  node --version
  ```
- If not installed or outdated, download from: [https://nodejs.org](https://nodejs.org)

### 2. **Python (Version 3.8 or higher)**
- To check if Python is installed:
  ```bash
  python --version
  # or
  python3 --version
  ```
- If not installed or outdated, download from: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- ✅ **Important**: During installation, make sure to check "Add Python to PATH"

---

## 📂 Project Setup Instructions

### Step 1: Navigate to the Project Folder

Open **Command Prompt** (Windows) or **Terminal** (Mac), then run:

```bash
cd path/to/macros-tracker
```

Examples:
- Windows:
  ```bash
  cd C:\Users\YourUsername\Desktop\macros-tracker
  ```
- macOS:
  ```bash
  cd /Users/YourUsername/Desktop/macros-tracker
  ```

---

### Step 2: Install JavaScript Dependencies

Install the frontend dependencies:

```bash
npm install
```

Wait until the installation completes and your prompt returns.

---

### Step 3: Set Up Python Environment

Run the Python environment setup script:

```bash
npm run setup-python
```

This command:
- Installs required Python packages like `opencv-python`, `transformers`, and the Mistral AI client.
- Downloads any necessary ML models.
- Displays `Setup completed successfully!` when done.

This may take several minutes.

---

### Step 4: Start the Application

Start both the backend (Python) and frontend (React Native web) with:

```bash
npm run start-direct
```

You should see:
- `Starting Python server...`
- `Server running on port 8080...`
- `Starting Expo app...`
- `Expo DevTools is running at http://localhost:8081`

---

### Step 5: Open the Application in a Web Browser

> **Why the Web Version?**  
> We use the **web version** of the app instead of **Expo Go** because Expo Go requires the **exact matching SDK version**, which can lead to compatibility issues. The web version avoids these problems and simplifies testing.

To open the app:

1. Open your browser (Google Chrome recommended)
2. Navigate to:

```text
http://localhost:8081
```

Or click the link displayed in your terminal.

---

## 📷 Using the Scanner Feature

### Step 6: Navigate to the Scanner Tab

1. Once the app loads, locate the bottom navigation bar
2. Click on the **Scanner** tab (camera icon)

---

### Step 7: Allow Camera Access

1. When prompted, **click "Allow"** to grant camera access
2. If you click "Block" by accident:
   - Click the camera/lock icon in the browser's address bar
   - Change the permission to **Allow**

---

### Step 8: Take a Picture of a Food Item

1. Hold up a food item to your webcam
2. Click the **"Take Picture"** button
3. Wait 5–15 seconds while the app processes the image

---

### Step 9: View Nutrition Information

Once the image is processed, you’ll see:
- **Food Name**
- **Calories**
- **Protein (g)**
- **Carbohydrates (g)**
- **Fat (g)**

If no data appears:
- Try using better lighting
- Try again with a more common food item (e.g. apple, banana)

---

## 🛠️ Troubleshooting Guide

### ❌ Python Server Doesn’t Start

1. Confirm Python installation:
   ```bash
   python --version
   ```
2. Try running the server directly:
   ```bash
   cd path/to/macros-tracker/scripts
   python server.py
   ```

---

### ❌ Web Page Doesn’t Load

- Ensure both Python and Expo servers are running
- Check for port conflicts (especially port `8081`)
- Try using a private/incognito window
- Ensure your firewall isn’t blocking local ports

---

### ❌ Camera Doesn’t Work

- Make sure browser has camera permission
- Try Google Chrome
- Ensure your webcam works in other apps

---

### ❌ Food Not Recognized

- Use clear lighting and angles
- Try again with simple, common food items
- Confirm that the Python server is still running

---
