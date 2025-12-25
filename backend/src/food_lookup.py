from sentence_transformers import SentenceTransformer, util
import pandas as pd
import numpy as np
from pathlib import Path
from datasets import load_from_disk
import torch
from src.food_cache import FoodCache

# Resolve paths relative to backend root
backend_root = Path(__file__).parent.parent
embeddings_dir = backend_root / "embeddings"

# Load the dataset and model
loaded_dataset = load_from_disk(str(embeddings_dir / 'total_dataset')) # Total dataset
model = SentenceTransformer("all-MiniLM-L6-v2")
embeds = np.load(str(embeddings_dir / 'embeddings_only.npy')) # Only embeddings

# Initialize cache
food_cache = FoodCache()

def lookup(input_text):
    """
    Look up food information based on input text using semantic similarity.
    First checks cache for fast lookup, then falls back to semantic search.
    
    Args:
        input_text (str): The food description to search for
        
    Returns:
        tuple: (product_name, nutriments_info, similarity_score, code)
    """
    # Check cache first for fast lookup
    cached_result = food_cache.get_cached_result(input_text)
    if cached_result:
        return cached_result
    
    # If not in cache, perform semantic search
    try:
        # Encode the input text
        sentences = [input_text]
        embeddings = model.encode(sentences, convert_to_tensor=True, dtype=torch.float32)
        
        # Move to CPU to match the stored embeddings
        embeddings = embeddings.cpu()
        
        # Ensure embeddings are 2D (batch_size x embedding_dim)
        if embeddings.dim() == 1:
            embeddings = embeddings.unsqueeze(0)
        
        # Convert numpy embeddings to tensor and ensure proper shape
        embeds_tensor = torch.tensor(embeds, dtype=torch.float32)
        if embeds_tensor.dim() == 1:
            embeds_tensor = embeds_tensor.unsqueeze(0)
        
        # Calculate cosine similarity
        cosine_scores = util.cos_sim(embeddings, embeds_tensor)
        
        # Get the best match
        max_index = torch.argmax(cosine_scores).item()
        similarity_score = float(torch.max(cosine_scores).item())
        
        # Get the product information
        product_name = loaded_dataset["product_name"][max_index]
        nutriments_info = loaded_dataset["nutriments"][max_index][0] if loaded_dataset["nutriments"][max_index] else None
        code = loaded_dataset["code"][max_index]
        
        return product_name, nutriments_info, similarity_score, code
        
    except Exception as e:
        return None, None, 0.0, None

# Test function (can be removed in production)
if __name__ == "__main__":
    test_input = "Peanut Butter"
    result = lookup(test_input)
    print(f"Test result for '{test_input}':")
    print(f"Product: {result[0]}")
    print(f"Nutriments: {result[1]}")
    print(f"Similarity: {result[2]:.2f}")


