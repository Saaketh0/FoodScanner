#!/usr/bin/env python3
"""
Initialize and build the food cache database.
This script generates the common foods list and populates the cache.
"""

import subprocess
import sys
from pathlib import Path

def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}\n")
    
    # Scripts are in the same directory
    script_path = Path(__file__).parent / script_name
    
    if not script_path.exists():
        print(f"❌ Error: {script_name} not found!")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            check=True,
            capture_output=False
        )
        print(f"\n✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error running {script_name}: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False

def main():
    """Main initialization function"""
    print("="*60)
    print("Food Cache Initialization")
    print("="*60)
    print("\nThis script will:")
    print("  1. Generate the common foods list (1000 foods)")
    print("  2. Build the cache database from the list")
    print("\nThis may take several minutes...")
    
    # Step 1: Generate common foods list
    if not run_script("generate_common_foods.py", "Step 1: Generating common foods list"):
        print("\n❌ Failed to generate common foods list. Exiting.")
        sys.exit(1)
    
    # Step 2: Build cache
    if not run_script("build_cache.py", "Step 2: Building cache database"):
        print("\n❌ Failed to build cache. Exiting.")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("✅ Cache initialization complete!")
    print("="*60)
    print("\nThe cache is now ready to use.")
    print("Common food lookups will be much faster now!")

if __name__ == "__main__":
    main()


