import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

interface PhotoData {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPacketInfo, setLastPacketInfo] = useState<string>("");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        // Request base64 data directly to avoid using FileSystem on web
        const photo = (await cameraRef.current.takePictureAsync({
          base64: true,
        })) as PhotoData;

        // Get image dimensions
        const width = photo.width;
        const height = photo.height;

        let imageData: string;

        // On web platforms, use the base64 data directly
        if (Platform.OS === "web") {
          if (!photo.base64) {
            throw new Error("Base64 data not available");
          }
          imageData = photo.base64;
        } else {
          // On native platforms, we can use FileSystem
          imageData = await FileSystem.readAsStringAsync(photo.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        const imageBuffer = Buffer.from(imageData, "base64");
        const imageSize = Math.min(imageBuffer.length, 65535); // Ensure size fits in 2 bytes (max 65535)

        console.log(
          `Image captured - Width: ${width}, Height: ${height}, Size: ${imageSize} bytes`
        );

        // Create the TCP packet
        // First 2 bytes: size in bytes
        // Next byte: height
        // Next 2 bytes: width
        const packet = Buffer.alloc(5); // We'll create header only, without the image

        // Ensure values are within bounds
        packet.writeUInt16BE(imageSize > 65535 ? 65535 : imageSize, 0); // First 2 bytes for size (max 65535)
        packet.writeUInt8(height > 255 ? 255 : height, 2); // 1 byte for height (max 255)
        packet.writeUInt16BE(width > 65535 ? 65535 : width, 3); // 2 bytes for width (max 65535)

        // Send TCP packet with header only
        await sendTcpPacket(packet);

        // Display info to confirm it worked
        setLastPacketInfo(
          `Packet sent - Size: ${imageSize} bytes, Height: ${Math.min(
            height,
            255
          )}, Width: ${Math.min(width, 65535)}`
        );
        console.log(`TCP packet sent with header: [${packet.toString("hex")}]`);
      } catch (error: any) {
        console.error("Error taking picture:", error);
        setLastPacketInfo(`Error: ${error.message}`);
      }
    }
  }

  async function sendTcpPacket(packet: Buffer) {
    try {
      // Using a fixed localhost IP for development
      const localIp = "127.0.0.1";
      const serverPort = 8080; // Use any port you prefer

      // For development, log the packet details as we can't directly use TCP sockets in React Native
      console.log(
        `[TCP SIMULATION] Sending packet to ${localIp}:${serverPort}`
      );
      console.log(
        `[TCP SIMULATION] Packet header: Size=${packet.readUInt16BE(
          0
        )}, Height=${packet.readUInt8(2)}, Width=${packet.readUInt16BE(3)}`
      );

      // In a real app, you would integrate with a native module or use a service
      // that can handle TCP connections, but for this example we're simulating it
    } catch (error: any) {
      console.error("Error sending TCP packet:", error);
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>

        {lastPacketInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{lastPacketInfo}</Text>
          </View>
        ) : null}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    color: "white",
    textAlign: "center",
  },
});
