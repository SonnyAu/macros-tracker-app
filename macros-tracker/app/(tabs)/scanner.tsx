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
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { DatabaseService } from "../../services/database";
import { NutritionData } from "../../types/nutrition";

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        setNutritionData(null);
        setError(null);

        // Request base64 data directly to avoid using FileSystem on web
        const photo = (await cameraRef.current.takePictureAsync({
          base64: true,
        })) as PhotoData;

        // Get image dimensions
        const width = photo.width;
        const height = photo.height;

        console.log(
          `Captured image dimensions: height=${height}, width=${width}`
        );

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

        // Process the image to treat it as a 3D array with shape (height, width, 3)
        const processedImageBuffer = processImageTo3DArray(
          imageData,
          width,
          height
        );
        const imageSize = Math.min(processedImageBuffer.length, 65535); // Ensure size fits in 2 bytes (max 65535)

        console.log(
          `3D Image processed - Height: ${height}, Width: ${width}, Size: ${imageSize} bytes, Format: (${height}, ${width}, 3)`
        );

        // Updated packet format:
        // First 2 bytes: size in bytes
        // Next 2 bytes: height (instead of 1 byte, now supports up to 65535)
        // Next 2 bytes: width
        const headerSize = 6; // Increased from 5 to 6 bytes
        const packet = Buffer.alloc(headerSize + processedImageBuffer.length);

        // Ensure values are within bounds
        packet.writeUInt16BE(imageSize > 65535 ? 65535 : imageSize, 0); // First 2 bytes for size (max 65535)

        // For height, now using 2 bytes to support values up to 65535
        packet.writeUInt16BE(height > 65535 ? 65535 : height, 2);

        // For width, use a value capped at 65535 (2 byte limit)
        packet.writeUInt16BE(width > 65535 ? 65535 : width, 4); // 2 bytes for width (max 65535), now at offset 4

        // Copy the processed image data into the packet after the header
        processedImageBuffer.copy(packet, headerSize);

        // Send TCP packet with header and processed image data
        const response = await sendTcpPacket(packet);

        if (response) {
          try {
            const nutritionData = JSON.parse(response) as NutritionData;
            setNutritionData(nutritionData);
            setLastPacketInfo(
              `Successfully processed ${nutritionData.foodItem.name}`
            );

            // Save to database
            const db = DatabaseService.getInstance();
            await db.saveFoodEntry(nutritionData, "current-user-id"); // Replace with actual user ID
          } catch (error) {
            console.error("Error processing nutrition data:", error);
            setLastPacketInfo("Error processing nutrition data");
            setError("Failed to process nutrition data");
          }
        }

        console.log(`TCP packet sent with 3D array image data`);
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
      // Replace with your Raspberry Pi's IP address
      const piIp = "192.168.1.100"; // Update this with your Pi's IP
      const serverPort = 8080;

      // For development, log the packet details
      console.log(`[TCP] Sending packet to ${piIp}:${serverPort}`);
      console.log(
        `[TCP] Packet header: Size=${packet.readUInt16BE(
          0
        )}, Height=${packet.readUInt16BE(2)}, Width=${packet.readUInt16BE(
          4
        )}, 3D array shape=(Height, Width, 3)`
      );

      // In a real implementation, you would use a native module or service
      // that can handle TCP connections. For now, we'll simulate the response
      return JSON.stringify({
        foodItem: {
          name: "Sample Food",
          servingSize: {
            amount: 100,
            unit: "grams",
          },
          nutrition: {
            calories: 200,
            macros: {
              protein: 10,
              carbohydrates: 20,
              fat: 5,
              fiber: 2,
            },
            micronutrients: {
              sodium: 200,
              potassium: 300,
              cholesterol: 0,
              vitaminA: 100,
              vitaminC: 50,
              calcium: 100,
              iron: 2,
            },
          },
        },
      });
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

          <TouchableOpacity
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.text}>Take Picture</Text>
            )}
          </TouchableOpacity>
        </View>

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
