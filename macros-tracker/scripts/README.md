# TCP Image Transfer Testing

This directory contains scripts to test TCP image transfer functionality for the macros-tracker app.

## Prerequisites

Before running these scripts, make sure you have the required dependencies:

```bash
npm install sharp
```

## Scripts Overview

1. `tcp-server.js` - A TCP server that listens for image data and saves it
2. `tcp-client.js` - A simple TCP client that sends an image file
3. `formatted-client.js` - A client that sends images in the same format as the scanner.tsx component

## How to Test

### 1. Start the TCP Server

In one terminal window, run:

```bash
node scripts/tcp-server.js
```

The server will start listening on port 8080 by default.

### 2. Send an Image Using a Client

In another terminal window, run one of the client scripts:

**For simple image transfer:**

```bash
node scripts/tcp-client.js [path/to/image.jpg]
```

**To test formatted image packets (like scanner.tsx):**

```bash
node scripts/formatted-client.js [path/to/image.jpg]
```

If you don't specify an image path, the script will try to use an image from the assets directory.

### 3. Verify Success

- Check both terminal windows for successful connection messages
- The server will save received images in the `received_images` directory
- If using the formatted client, the server will attempt to parse the header and display the image dimensions

## How This Relates to scanner.tsx

The scanner.tsx component in the app is designed to take photos and send them over TCP with a specific format:

- First 2 bytes: image size (capped at 65535)
- Next 2 bytes: height
- Next 2 bytes: width
- Remaining bytes: image data as a 3D array

The `formatted-client.js` creates packets in this same format, so you can test how the server handles these specially formatted images before implementing the actual server for your app.

## Troubleshooting

- If you get "Connection refused" errors, make sure the server is running
- If you get "EADDRINUSE" errors, another process might be using port 8080. Change the port in both server and client scripts.
