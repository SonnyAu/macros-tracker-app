import os
from mistralai import Mistral
import json

api_key = "YkudnjZ2VtCgmP1njCH5m0npy780RKZI"
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

def fillOut(foodItem:str) -> str:
    template = """{
    "foodItem": {
        "name": "FOOD_ITEM",
        "servingSize": {
            "amount": 100,
            "unit": "grams"
        },
        "nutrition": {
            "calories": 0,
            "macros": {
                "protein": 0,
                "carbohydrates": 0,
                "fat": 0,
                "fiber": 0
            },
            "micronutrients": {
                "sodium": 0,
                "potassium": 0,
                "cholesterol": 0,
                "vitaminA": 0,
                "vitaminC": 0,
                "calcium": 0,
                "iron": 0
            }
        }
    }
}"""

    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": f"Estimate the nutrition facts for a medium portion size of {foodItem}. Return ONLY a JSON object in this exact format, replacing the values with realistic estimates: {template}. Do not include any other text or explanation. Make sure all numeric values are integers."
            },
        ]
    )
    
    # Get the response content
    response_content = chat_response.choices[0].message.content
    
    # Clean up the response to ensure it's valid JSON
    try:
        # Remove any markdown code block markers if present
        response_content = response_content.replace("```json", "").replace("```", "").strip()
        
        # Parse and re-stringify to ensure valid JSON
        json_data = json.loads(response_content)
        return json.dumps(json_data)
    except json.JSONDecodeError as e:
        print(f"Error parsing response as JSON: {str(e)}")
        print(f"Raw response: {response_content}")
        # Return a default response if parsing fails
        return template.replace("FOOD_ITEM", foodItem) 