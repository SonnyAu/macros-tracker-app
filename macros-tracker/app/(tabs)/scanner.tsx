import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { DatabaseService } from "../../services/database";
import { NutritionData } from "../../types/nutrition";
import { useIsFocused } from "@react-navigation/native";

interface PhotoData {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

// Helper function to ensure the image data is treated as a 3D array
function processImageTo3DArray(
  imageBase64: string,
  width: number,
  height: number
): Buffer {
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, "base64");

    // Treat the buffer as a 3D array of shape (height, width, 3)
    // where height is the longer dimension in a portrait photo
    // and each pixel has 3 channels (RGB)

    console.log(`Processed image to 3D array format: (${height}, ${width}, 3)`);
    return imageBuffer;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPacketInfo, setLastPacketInfo] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [serverAvailable, setServerAvailable] = useState<boolean>(false);

  // Check if the screen is focused (visible to the user)
  const isFocused = useIsFocused();

  // Check if the Python server is running
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080", {
          method: "OPTIONS",
        });
        setServerAvailable(response.ok);
      } catch (err) {
        console.warn("Python server not detected:", err);
        setServerAvailable(false);

        // Show alert only in development
        if (__DEV__) {
          Alert.alert(
            "Python Server Not Detected",
            "The Python server for food recognition doesn't seem to be running. Please start it with 'npm run start-server' in another terminal.",
            [{ text: "OK" }]
          );
        }
      }
    };

    checkServer();
    // Check server availability every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize database connection
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = DatabaseService.getInstance();
        await db.connect();
      } catch (err) {
        console.error("Failed to connect to database:", err);
        setError("Database connection failed");
      }
    };

    initDatabase();
  }, []);

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

  // Show a blank view if not focused
  if (!isFocused) {
    return <View style={styles.container} />;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        setNutritionData(null);
        setError(null);

        // Check if the server is available first
        if (!serverAvailable) {
          throw new Error(
            "Python server not available. Please start it with 'npm run start-server'"
          );
        }

        // Request base64 data directly
        const photo = (await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        })) as PhotoData;

        console.log(
          `Captured image dimensions: height=${photo.height}, width=${photo.width}`
        );

        let imageData: string;

        // Get base64 data
        if (Platform.OS === "web") {
          if (!photo.base64) {
            throw new Error("Base64 data not available");
          }
          imageData = photo.base64;
        } else {
          imageData = await FileSystem.readAsStringAsync(photo.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        // Ensure proper base64 format with data URI prefix
        if (!imageData.startsWith("data:image/")) {
          imageData = `data:image/jpeg;base64,${imageData}`;
        }

        // Send the image data to our Python server
        const response = await fetch(`http://127.0.0.1:8080`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Image-Height": photo.height.toString(),
            "X-Image-Width": photo.width.toString(),
          },
          body: JSON.stringify({
            image: imageData,
            height: photo.height,
            width: photo.width,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const responseData = await response.json();

        // Validate and process the nutrition data
        if (!responseData.foodItem || !responseData.foodItem.nutrition) {
          throw new Error("Invalid response format from server");
        }

        setNutritionData(responseData);
        setLastPacketInfo(
          `Successfully processed ${responseData.foodItem.name}`
        );

        // Save to database with current date
        const db = DatabaseService.getInstance();
        await db.saveFoodEntry(responseData, new Date());
      } catch (error: any) {
        console.error("Error taking picture:", error);
        setLastPacketInfo(`Error: ${error.message}`);
        setError(error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  }

  async function sendTcpPacket(packet: Buffer): Promise<string | null> {
    try {
      const serverIp = "127.0.0.1"; // Update this with your friend's IP
      const serverPort = 8080; // Sending port

      // Extract image dimensions from the packet
      const height = packet.readUInt16BE(2);
      const width = packet.readUInt16BE(4);

      console.log(`[HTTP] Sending image data to ${serverIp}:${serverPort}`);
      console.log(`[HTTP] Image dimensions: ${width}x${height}`);

      const response = await fetch(`http://${serverIp}:${serverPort}`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Image-Height": height.toString(),
          "X-Image-Width": width.toString(),
          Accept: "text/plain",
        },
        body: packet,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.text();
      console.log("[HTTP] Response received:", responseData);
      return responseData;
    } catch (error: any) {
      console.error("Error sending HTTP request:", error);
      setError(error.message);
      return null;
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              (isProcessing || !serverAvailable) &&
                styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isProcessing || !serverAvailable}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.text}>
                {serverAvailable ? "Take Picture" : "Server Offline"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {!serverAvailable && (
          <View style={styles.serverStatusContainer}>
            <Text style={styles.errorText}>
              Python server not available. Use 'npm run start-server' to start
              it.
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {lastPacketInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{lastPacketInfo}</Text>
          </View>
        ) : null}

        {nutritionData && (
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>
              {nutritionData.foodItem.name}
            </Text>
            <Text style={styles.nutritionText}>
              Calories: {nutritionData.foodItem.nutrition.calories}
            </Text>
            <Text style={styles.nutritionText}>
              Protein: {nutritionData.foodItem.nutrition.macros.protein}g
            </Text>
            <Text style={styles.nutritionText}>
              Carbs: {nutritionData.foodItem.nutrition.macros.carbohydrates}g
            </Text>
            <Text style={styles.nutritionText}>
              Fat: {nutritionData.foodItem.nutrition.macros.fat}g
            </Text>
          </View>
        )}
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
  captureButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
  errorContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
  serverStatusContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 165, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  nutritionContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  nutritionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  nutritionText: {
    color: "white",
    fontSize: 14,
    marginBottom: 2,
  },
});
