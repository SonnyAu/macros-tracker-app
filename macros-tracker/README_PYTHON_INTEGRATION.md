# Python Server Integration for Macros Tracker

This README explains how to set up and use the integrated Python server for food recognition in the Macros Tracker app.

## Prerequisites

Before you start, make sure you have:

1. **Python 3.8 or later** installed on your system

   - Verify with `python --version` or `python3 --version`
   - If not installed, download from [python.org](https://www.python.org/downloads/)

2. **Node.js and npm** (already required for the React Native app)

## Setup Instructions

1. **Install JavaScript dependencies**

   ```
   npm install
   ```

2. **Install Python dependencies**

   ```
   npm run setup-python
   ```

   This will install all required Python packages including:

   - opencv-python
   - numpy
   - pillow
   - transformers
   - torch
   - mistralai
   - requests

   Note: The first run may take some time as it downloads model files.

## Running the App with Python Integration

You have two options to run the app:

### Option 1: All-in-one (Recommended)

Run both the Python server and React Native app with a single command:

```
npm run start-all
```

This will start the Python server and the React Native app concurrently.

### Option 2: Run Separately

1. **Start the Python server in one terminal**

   ```
   npm run start-server
   ```

2. **Start the React Native app in another terminal**
   ```
   npm start
   ```

## How It Works

The integration consists of three main components:

1. **React Native App**: The front-end that captures images using the device camera.

2. **Python Server**: A local HTTP server that:

   - Receives images from the app
   - Uses a pre-trained model to classify food items
   - Retrieves nutrition information using Mistral AI
   - Returns the nutrition data to the app

3. **Integration Scripts**: Node.js scripts that:
   - Set up the Python environment
   - Start the Python server
   - Manage communication between the app and server

When you take a photo in the app, it gets sent to the Python server for processing, and the nutrition information is returned and displayed in the app.

## Troubleshooting

If you encounter issues:

1. **Server Not Running**: If the app shows "Server Offline", make sure the Python server is running with `npm run start-server`.

2. **Python Not Found**: If you get errors about Python not being found, make sure Python is installed and in your PATH.

3. **Missing Dependencies**: Run `npm run setup-python` to install all required Python packages.

4. **Port Already in Use**: If the server can't start because port 8080 is already in use, check for other processes using that port.

## Advanced Configuration

- **API Key**: The Mistral AI API key is set in `scripts/ai.py`. You may need to replace it with your own.
- **Model**: The food classification model is set to `eslamxm/vit-base-food101` but you can change it in `scripts/server.py`.
- **Server Port**: The server runs on port 8080 by default. To change it, update both `scripts/server.py` and the server URL in `app/(tabs)/scanner.tsx`.
