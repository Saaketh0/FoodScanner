"""
Food cache module for fast lookup of common foods.
Uses SQLite database and fuzzy matching for flexible text matching.
"""

import sqlite3
import json
from pathlib import Path
from typing import Optional, Tuple
from rapidfuzz import fuzz, process

class FoodCache:
    """Manages cached food lookup results in SQLite database"""
    
    def __init__(self, db_path: Optional[str] = None):
        """
        Initialize the food cache.
        
        Args:
            db_path: Path to SQLite database file. Defaults to cache/food_cache.db
        """
        if db_path is None:
            # Resolve path relative to backend root
            backend_root = Path(__file__).parent.parent
            cache_dir = backend_root / "cache"
            cache_dir.mkdir(exist_ok=True)
            db_path = str(cache_dir / "food_cache.db")
        
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_database()
        self._load_cache_into_memory()
    
    def _init_database(self):
        """Initialize the database schema if it doesn't exist"""
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS food_cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                food_name TEXT NOT NULL,
                normalized_name TEXT NOT NULL,
                product_name TEXT NOT NULL,
                nutriments_info TEXT,
                code TEXT,
                similarity_score REAL DEFAULT 1.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(food_name)
            )
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_normalized_name 
            ON food_cache(normalized_name)
        """)
        self.conn.commit()
    
    def _load_cache_into_memory(self):
        """Load all cached food names into memory for fast fuzzy matching"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT food_name, normalized_name FROM food_cache")
        rows = cursor.fetchall()
        self.cached_foods = {row['normalized_name']: row['food_name'] for row in rows}
        self.food_names_list = list(self.cached_foods.keys())
    
    def _normalize_name(self, food_name: str) -> str:
        """Normalize food name for matching (lowercase, strip whitespace)"""
        return food_name.lower().strip()
    
    def get_cached_result(self, food_text: str, threshold: float = 85.0) -> Optional[Tuple[str, Optional[dict], float, str]]:
        """
        Get cached result for a food item using exact or fuzzy matching.
        
        Args:
            food_text: Input food text to search for
            threshold: Minimum similarity score for fuzzy matching (0-100)
        
        Returns:
            Tuple of (product_name, nutriments_info, similarity_score, code) if found,
            None otherwise
        """
        normalized = self._normalize_name(food_text)
        
        # Try exact match first
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT product_name, nutriments_info, similarity_score, code
            FROM food_cache
            WHERE normalized_name = ?
        """, (normalized,))
        
        row = cursor.fetchone()
        if row:
            nutriments = json.loads(row['nutriments_info']) if row['nutriments_info'] else None
            return (
                row['product_name'],
                nutriments,
                float(row['similarity_score']),
                row['code']
            )
        
        # If no exact match, try fuzzy matching
        if self.food_names_list:
            # Use rapidfuzz to find best match
            result = process.extractOne(
                normalized,
                self.food_names_list,
                scorer=fuzz.ratio,
                score_cutoff=threshold
            )
            
            if result:
                matched_normalized, score, _ = result
                matched_food_name = self.cached_foods[matched_normalized]
                
                # Get the full result from database
                cursor.execute("""
                    SELECT product_name, nutriments_info, similarity_score, code
                    FROM food_cache
                    WHERE food_name = ?
                """, (matched_food_name,))
                
                row = cursor.fetchone()
                if row:
                    nutriments = json.loads(row['nutriments_info']) if row['nutriments_info'] else None
                    # Use the fuzzy match score as similarity
                    return (
                        row['product_name'],
                        nutriments,
                        score / 100.0,  # Convert to 0-1 range
                        row['code']
                    )
        
        return None
    
    def is_cached(self, food_text: str) -> bool:
        """Check if a food item exists in cache"""
        return self.get_cached_result(food_text) is not None
    
    def add_to_cache(self, food_name: str, product_name: str, 
                     nutriments_info: Optional[dict], code: str, 
                     similarity_score: float = 1.0):
        """
        Add a food item to the cache.
        
        Args:
            food_name: Original food name (key)
            product_name: Matched product name from dataset
            nutriments_info: Nutrition information dictionary
            code: Product code
            similarity_score: Similarity score from semantic search
        """
        normalized = self._normalize_name(food_name)
        nutriments_json = json.dumps(nutriments_info) if nutriments_info else None
        
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO food_cache 
            (food_name, normalized_name, product_name, nutriments_info, code, similarity_score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (food_name, normalized, product_name, nutriments_json, code, similarity_score))
        
        self.conn.commit()
        
        # Update in-memory cache
        self.cached_foods[normalized] = food_name
        if normalized not in self.food_names_list:
            self.food_names_list.append(normalized)
    
    def get_cache_size(self) -> int:
        """Get the number of items in the cache"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM food_cache")
        return cursor.fetchone()['count']
    
    def clear_cache(self):
        """Clear all items from the cache"""
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM food_cache")
        self.conn.commit()
        self.cached_foods = {}
        self.food_names_list = []
    
    def close(self):
        """Close the database connection"""
        self.conn.close()


