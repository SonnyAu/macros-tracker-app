import cv2
import numpy as np
from transformers import pipeline
from PIL import Image
import sys
import json
import threading
import time
import os

import server as tcp
from ai import fillOut

file_path = 'received_image.jpg'

def send_json_to_localhost(json_string, host='localhost', port=5001):
    """
    Sends a JSON string to a specified host and port via HTTP POST.
    
    Args:
        json_string (str): The JSON string to send.
        host (str): The host address (default: 'localhost').
        port (int): The port number to send to (default: 5001).
    """
    try:
        import requests
        response = requests.post(f'http://{host}:{port}', json=json.loads(json_string))
        print(f"JSON string sent to {host}:{port}")
        return response.text
    except Exception as e:
        print(f"Error sending JSON: {str(e)}")
        return None

def load_image(file_path):
    # Read image from file
    image = cv2.imread(file_path)
    if image is None:
        raise Exception(f"Failed to load image from {file_path}")
    
    # Convert BGR (OpenCV) to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image

def preprocess_image(image, target_size=(224, 224)):
    # Convert NumPy array to PIL Image
    pil_image = Image.fromarray(image)
    
    # Resize image to match model input
    pil_image = pil_image.resize(target_size)
    
    # Convert to NumPy array and normalize
    image_array = np.array(pil_image) / 255.0  # Normalize to [0,1]
    
    # Ensure correct shape (1, height, width, channels)
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def classify_food(image_array):
    # Load a food-specific model
    classifier = pipeline("image-classification", model="eslamxm/vit-base-food101")
    
    # Convert preprocessed image back to PIL
    pil_image = Image.fromarray((image_array[0] * 255).astype(np.uint8))
    
    # Get predictions
    predictions = classifier(pil_image)
    
    # Print all predictions for debugging
    print("All predictions:", predictions)
    
    # Return top prediction
    top_prediction = predictions[0]
    return top_prediction['label'], top_prediction['score']

def process_image():
    try:
        # Step 1: Load image from file
        print(f"Loading image from {file_path}...")
        image = load_image(file_path)
        
        # Step 2: Preprocess image
        print("Preprocessing image...")
        processed_image = preprocess_image(image)
        
        # Step 3: Classify image
        print("Classifying food...")
        food_type, confidence = classify_food(processed_image)
        
        # Step 4: Display result
        print(f"Predicted food: {food_type} (Confidence: {confidence:.2f})")

        # Step 5: Run through GPT Mistral model
        jsonRet = fillOut(food_type)
        
        # Step 6: Send JSON string to localhost on a different port
        print("Sending JSON to localhost...")
        response = send_json_to_localhost(jsonRet, port=5001)
        if response:
            print(f"Response from server: {response}")

    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    # Start the HTTP server in a separate thread
    server_thread = threading.Thread(target=tcp.run_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Main loop to process images
    while True:
        try:
            # Wait for a new image to be received
            while not os.path.exists(file_path):
                time.sleep(0.1)
            
            # Process the image
            process_image()
            
            # Remove the processed image
            os.remove(file_path)
            
        except Exception as e:
            print(f"Error in main loop: {str(e)}")
            time.sleep(1)  # Wait a bit before retrying

if __name__ == "__main__":
    main() 