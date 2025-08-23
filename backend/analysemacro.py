import pandas as pd
import numpy as np
from pathlib import Path
import torch
import openfoodfacts

api = openfoodfacts.API(user_agent="MyAwesomeApp/1.0")

def analyse_macro(code):
    product =  api.product.get(code)
    return product
