# similarity.py

import numpy as np

def calculate_similarity(vec1: list[float], vec2: list[float]) -> float:
    """
    Calculates the cosine similarity between two vectors and returns it as a percentage.
    """
    np_vec1 = np.array(vec1)
    np_vec2 = np.array(vec2)
    
    dot_product = np.dot(np_vec1, np_vec2)
    norm_vec1 = np.linalg.norm(np_vec1)
    norm_vec2 = np.linalg.norm(np_vec2)
    
    if norm_vec1 == 0 or norm_vec2 == 0:
        return 0.0
        
    cosine_similarity = dot_product / (norm_vec1 * norm_vec2)
    similarity_percentage = (cosine_similarity + 1) / 2 * 100
    
    return similarity_percentage

# --- TEST BLOCK ---
# This code now performs a full end-to-end test.
if __name__ == "__main__":
    # Import the embedding generation function from your other module
    from embedding import generate_embedding

    print("--- Running end-to-end similarity test ---")
    
    # Define two semantically similar pieces of text
    text_A = "database management system"
    text_B = "Data : raw, unstructured, and unprocessed facts Information : Structured & Processed Data-- has meaningful insights . A database is an organized collection of structured information, or data, typically stored electronically in a computer system"
    
    print(f"\nText A: '{text_A}'")
    print(f"Text B: '{text_B}'")

    # Generate live embeddings for both texts using your embedding.py module
    print("\nGenerating embedding for Text A...")
    vec_A = generate_embedding(content=text_A)
    
    print("Generating embedding for Text B...")
    vec_B = generate_embedding(content=text_B)

    # Check if both embeddings were generated successfully
    if vec_A and vec_B:
        print("\n✅ Embeddings generated successfully.")
        
        # Calculate and print the similarity
        similarity_score = calculate_similarity(vec_A, vec_B)
        print(f"\nSimilarity between Text A and Text B: {similarity_score:.2f}%")
    else:
        print("\n❌ Failed to generate one or both embeddings. Check API key and error messages.")