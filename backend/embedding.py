# embedding.py

import os
import voyageai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()
vo = None
try:
    api_key = os.getenv("VOYAGE_API_KEY")
    if not api_key:
        raise ValueError("VOYAGE_API_KEY not found in .env file.")
    vo = voyageai.Client(api_key=api_key)
except Exception as e:
    print(f"Could not initialize Voyage AI Client: {e}")

def generate_embedding(content: str | Image.Image) -> list[float] | None:
    """
    Generates a multimodal embedding for a single piece of content (text or image).
    """
    if not vo:
        raise ConnectionError("Voyage AI client is not initialized.")

    try:
        
        inputs_to_embed = [[content]]
        result = vo.multimodal_embed(
            inputs_to_embed, 
            model="voyage-multimodal-3"
        )  
        return result.embeddings[0]

    except Exception as e:
        print(f"Error generating Voyage AI embedding: {e}")
        return None