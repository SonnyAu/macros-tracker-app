# 📸 Macros Tracker App: Comprehensive Setup and Testing Guide

This guide will walk you through installing, running, and testing the Macros Tracker app, which integrates a React Native front-end with a Python-based backend for AI-powered food recognition and nutrition analysis.

---

## 📦 Prerequisites

Before starting, ensure you have the following installed:

### ✅ Node.js and npm (v14.0 or higher)

- Check by running:
  ```bash
  node --version
  ```
- If not installed, download from: [https://nodejs.org](https://nodejs.org)

### ✅ Python (v3.8 or higher)

- Check by running:
  ```bash
  python --version
  ```
  or
  ```bash
  python3 --version
  ```
- If not installed, download from: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **IMPORTANT:** During installation, make sure to check **“Add Python to PATH”**

---

## 📂 Clone the Repository

Use Git to clone the repository to your local machine:

```bash
git clone https://github.com/SonnyAu/macros-tracker-app.git
cd macros-tracker
```
---

## 🚀 Setup Instructions

### Step 1: Navigate to the Project Directory

```bash
cd path/to/macros-tracker
```

Example:

- **Windows:**
  ```bash
  cd C:\Users\YourUsername\Desktop\macros-tracker
  ```
- **Mac:**
  ```bash
  cd /Users/YourUsername/Desktop/macros-tracker
  ```

---

### Step 2: Install JavaScript Dependencies

```bash
npm install
```

Wait for the installation to complete. This may take a few minutes.

---

### Step 3: Set Up the Python Environment

```bash
npm run setup-python
```

This will:
- Install Python packages (e.g., OpenCV, `transformers`, Mistral client)
- Download necessary ML models

> This may take several minutes. You'll see `Setup completed successfully!` when done.

---

### Step 4: Start the Application

```bash
npm run start-direct
```

You should see:

- `Starting Python server...`
- `Starting Expo app...`
- `Server running on port 8080...`
- `Expo DevTools is running at http://localhost:8081`
- `Web is waiting on http://localhost:8081`

---

### Step 5: Open the Application in a Web Browser

**IMPORTANT:**  
We are using the **web version** of the app instead of Expo Go due to SDK version compatibility issues with mobile.  
Expo Go requires **exact SDK matches**, which can cause unexpected errors during grading or testing.  
Using the web version avoids these problems and provides consistent cross-platform behavior.

To open the app:
1. Launch **Google Chrome**
2. Navigate to:
   ```
   http://localhost:8081
   ```

---

### Step 6: Navigate to the Scanner Tab

1. On the home screen, look at the bottom navigation tabs.
2. Click the **“Scanner”** tab (camera icon).
3. The Scanner page will load and request camera access.

---

### Step 7: Allow Camera Access

1. When prompted, click **“Allow”** to grant camera access.
2. If you accidentally click **“Block”**, click the **camera/lock icon** in your browser’s address bar to change the permission.

---

### Step 8: Take a Picture of a Food Item

1. Hold a food item in front of your webcam.
2. Click the **“Take Picture”** button.
3. Wait for the image to process (5–15 seconds).

---

### Step 9: View Nutrition Information

After processing, you’ll see:
- Food Name
- Calories
- Protein (g)
- Carbohydrates (g)
- Fat (g)

If no information appears:
- Try better lighting
- Use a more recognizable food item
- Ensure the Python server is running

---

## 🛠️ Troubleshooting

### 🔧 Python Server Won’t Start

1. Ensure Python is installed correctly:
   ```bash
   python --version
   ```
2. Run the server manually:
   ```bash
   cd scripts
   python server.py
   ```
   Look for: `Server running on port 8080...`

---

### 🔧 Web Page Doesn’t Load

- Ensure **both servers** are running
- Check if **port 8081** is available
- Try opening the app in **Incognito Mode**
- Disable any local firewalls temporarily

---

### 🔧 Camera Isn’t Working

- Make sure you **allowed camera access**
- Try **Google Chrome**
- Test the camera in another app to confirm functionality

---

### 🔧 Food Recognition Doesn’t Work

- Ensure **food is clearly visible**
- Improve **lighting**
- Try basic items like an **apple** or **banana**
- Double-check that the **Python server is active**

---

## 🧠 Technical Notes (For Grading)

This app integrates:

- **React Native** front-end (running in web mode)
- **Python** backend for image processing and AI inference
- **OpenCV** and **HuggingFace Transformers** for recognition
- **Mistral AI** for nutrition prediction

✅ Before testing, verify that the terminal prints:
```
Server running on port 8080...
```

---

> For any setup issues, please reach out to the development team or open a GitHub issue.

