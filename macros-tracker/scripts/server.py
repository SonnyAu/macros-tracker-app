from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import cv2
import numpy as np
from PIL import Image
import io
import base64
import threading
import os
import traceback
import re
from transformers import pipeline, AutoImageProcessor, AutoModelForImageClassification
import torch
from ai import fillOut

# Initialize the model and processor globally
try:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_name = "eslamxm/vit-base-food101"
    image_processor = AutoImageProcessor.from_pretrained(model_name)
    model = AutoModelForImageClassification.from_pretrained(model_name, trust_remote_code=True)
    model = model.to(device)
    classifier = pipeline("image-classification", model=model, image_processor=image_processor, device=device)
    print(f"Model loaded successfully on {device}")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    print(traceback.format_exc())

class ImageHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Image-Height, X-Image-Width')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        try:
            print("Received POST request")
            
            # Get content length
            content_length = int(self.headers['Content-Length'])
            print(f"Content length: {content_length}")
            
            # Read and parse JSON data
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract base64 image and dimensions
            image_base64 = data['image']
            height = data['height']
            width = data['width']
            print(f"Received dimensions from JSON: {width}x{height}")
            
            # Remove data URI prefix if present
            if image_base64.startswith('data:'):
                print("Removing data URI prefix")
                image_base64 = re.sub('^data:image/.+;base64,', '', image_base64)
            
            # Add padding if necessary
            padding = len(image_base64) % 4
            if padding:
                print(f"Adding {4 - padding} padding characters")
                image_base64 += '=' * (4 - padding)
            
            # Decode base64 to binary
            try:
                image_bytes = base64.b64decode(image_base64)
                print("Successfully decoded base64 data")
                
                # Save directly from bytes first
                with open('received_image.jpg', 'wb') as f:
                    f.write(image_bytes)
                print("Image saved directly from bytes")
                
                # Verify the saved image
                saved_image = Image.open('received_image.jpg')
                print(f"Verified saved image: mode={saved_image.mode}, size={saved_image.size}")
                
            except Exception as e:
                print(f"Image decode/save error: {str(e)}")
                print(f"Traceback: {traceback.format_exc()}")
                raise

            # Process the image and get nutrition data
            try:
                # Load the saved image
                image = cv2.imread('received_image.jpg')
                if image is None:
                    raise Exception("Failed to load saved image")
                print("Successfully loaded saved image with OpenCV")
                
                # Convert BGR to RGB
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                
                # Preprocess image
                pil_image = Image.fromarray(image)
                pil_image = pil_image.resize((224, 224))
                
                # Use the global classifier
                predictions = classifier(pil_image)
                food_type = predictions[0]['label']
                print(f"Detected food: {food_type}")
                
                # Get nutrition data
                nutrition_data = fillOut(food_type)
                print("Raw nutrition data:", nutrition_data)
                
                # Parse the nutrition data to ensure it's valid JSON
                try:
                    nutrition_json = json.loads(nutrition_data)
                    print("Parsed nutrition data:", json.dumps(nutrition_json, indent=2))
                except json.JSONDecodeError as e:
                    print(f"Error parsing nutrition data as JSON: {str(e)}")
                    raise
                
            except Exception as e:
                print(f"Error processing image: {str(e)}")
                raise
            
            # Send success response with nutrition data
            self._set_headers()
            self.wfile.write(nutrition_data.encode())
            
        except Exception as e:
            # Send error response
            error_traceback = traceback.format_exc()
            print(f"Error processing request: {str(e)}")
            print(f"Traceback: {error_traceback}")
            
            self._set_headers(500)
            response = {
                'status': 'error',
                'message': str(e),
                'traceback': error_traceback
            }
            self.wfile.write(json.dumps(response).encode())

def run_server():
    server_address = ('127.0.0.1', 8080)  # Changed to 127.0.0.1 to match client
    httpd = HTTPServer(server_address, ImageHandler)
    print('Server running on port 8080...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server() 