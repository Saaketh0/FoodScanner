#!/usr/bin/env python3
"""
Test script for the food lookup functionality
"""

import sys
from pathlib import Path

# Add parent directory to path to import from src
backend_root = Path(__file__).parent.parent
sys.path.insert(0, str(backend_root))

from src.food_lookup import lookup

def test_lookup():
    """Test the lookup function with various food inputs"""
    
    test_inputs = [
        "Peanut Butter",
        "Apple",
        "Chicken Breast",
        "Milk",
        "Bread"
    ]
    
    print("🧪 Testing Food Lookup Function")
    print("=" * 50)
    
    for test_input in test_inputs:
        print(f"\n🔍 Testing: '{test_input}'")
        try:
            product_name, nutriments_info, similarity_score, code = lookup(test_input)
            
            if product_name:
                print(f"✅ Found: {product_name}")
                print(f"📊 Similarity: {similarity_score:.2f} ({similarity_score*100:.1f}%)")
                if nutriments_info:
                    print(f"🍎 Nutriments: {nutriments_info}")
                else:
                    print("🍎 Nutriments: No data available")
            else:
                print("❌ No product found")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")

if __name__ == "__main__":
    test_lookup()


