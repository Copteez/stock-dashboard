import yfinance as yf
import pandas as pd
import json
import os

# 1. Define your Themes (matching the tickers in your photo)
THEMES = [
    {"name": "Cybersecurity", "tickers": ["CIBR", "HACK", "BUG"], "main": "CIBR"},
    {"name": "Oil Services", "tickers": ["OIH", "XLE", "CRAK"], "main": "OIH"},
    {"name": "Solar Energy", "tickers": ["TAN", "FSLR", "ENPH"], "main": "TAN"},
    {"name": "Semiconductors", "tickers": ["SOXX", "NVDA", "AMD"], "main": "SOXX"}
]

BENCHMARK = "SPY"

def get_rotation_data():
    results = []
    
    for theme in THEMES:
        print(f"Processing {theme['name']}...")
        
        # Download 6 months of data for the Theme and SPY
        tickers_to_fetch = [theme['main'], BENCHMARK]
        data = yf.download(tickers_to_fetch, period="6mo", interval="1d")['Close']
        
        # --- MATH SECTION ---
        # RS-Raw = (Sector / SPY) * 100
        rs_raw = (data[theme['main']] / data[BENCHMARK]) * 100
        
        # RS-Ratio (X-Axis): 10-day smoothing
        rs_ratio = rs_raw.ewm(span=10, adjust=False).mean()
        
        # RS-Momentum (Y-Axis): ROC of the Ratio
        rs_momentum = (rs_ratio.pct_change(periods=10) * 100) + 100
        
        # Latest Values
        current_ratio = rs_ratio.iloc[-1]
        current_mom = rs_momentum.iloc[-1]
        
        # --- QUADRANT LOGIC ---
        status = "Lagging"
        if current_ratio > 100 and current_mom > 100: status = "Leading"
        elif current_ratio > 100 and current_mom < 100: status = "Weakening"
        elif current_ratio < 100 and current_mom > 100: status = "Improving"

        results.append({
            "name": theme['name'],
            "tickers": ", ".join(theme['tickers']),
            "score": round(current_ratio, 1),
            "momentum": round(current_mom, 1),
            "status": status,
            "change": round(data[theme['main']].pct_change().iloc[-1] * 100, 2)
        })

    # Save to the root of your project so React can find it
    output_path = os.path.join(os.path.dirname(__file__), '..', 'data.json')
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)
    print("Successfully updated data.json")

if __name__ == "__main__":
    get_rotation_data()