from sentence_transformers import SentenceTransformer, util
from pathlib import Path
import json

_model = SentenceTransformer("all-MiniLM-L6-v2")

def best_sentence_per_requirement(text: str, requirements: list[str]) -> dict[str, str]:
    """
    For each requirement, find the most relevant sentence in the text.
    
    Args:
        text: The text to search in (e.g., cover letter content)
        requirements: List of job requirements/qualifications
        
    Returns:
        dict: Mapping of each requirement to the most relevant sentence
    """
    # Split text into sentences (simple approach)
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    if not sentences:
        return {req: "" for req in requirements}

    # Encode all sentences and requirements
    sent_emb = _model.encode(sentences, convert_to_tensor=True)
    
    # Find best match for each requirement
    matches = {}
    for req in requirements:
        req_emb = _model.encode(req, convert_to_tensor=True)
        # Calculate similarity scores
        similarities = util.cos_sim(req_emb, sent_emb)[0]
        # Get index of best matching sentence
        best_match_idx = int(similarities.argmax())
        matches[req] = sentences[best_match_idx]
    
    return matches
