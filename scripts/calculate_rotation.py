import yfinance as yf
import pandas as pd
import json
import os
import requests
from io import StringIO

BENCHMARK = "SPY"

# Mapping GICS Sectors to their tradable State Street ETFs (Standard Industry Benchmarks)
SECTOR_ETF_MAP = {
    "Information Technology": "XLK",
    "Health Care": "XLV",
    "Financials": "XLF",
    "Consumer Discretionary": "XLY",
    "Communication Services": "XLC",
    "Industrials": "XLI",
    "Consumer Staples": "XLP",
    "Energy": "XLE",
    "Real Estate": "XLRE",
    "Utilities": "XLU",
    "Materials": "XLB"
}

def get_sp500_structure():
    print("Scraping S&P 500 structure from Wikipedia...")
    
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    headers = {
        'User-Agent': 'MarketRotationBot/1.0 (Contact: your-email@example.com)'
    }
    
    response = requests.get(url, headers=headers)
    
    # CRITICAL FIX: Wrap response.text in StringIO()
    # This forces pandas to read the string as a data stream
    html_data = StringIO(response.text)
    
    table = pd.read_html(html_data)
    df = table[0]
    
    # Clean tickers for yfinance
    df['Symbol'] = df['Symbol'].str.replace('.', '-', regex=False)
    
    sector_map = {}
    for sector in df['GICS Sector'].unique():
        tickers = df[df['GICS Sector'] == sector]['Symbol'].tolist()
        sector_map[sector] = tickers
    return sector_map

def get_rotation_data():
    sector_map = get_sp500_structure()
    all_sector_etfs = list(SECTOR_ETF_MAP.values())
    
    # 1. Download data (7 months gives us enough buffer for a 100-day MA)
    print("Downloading Sector ETF data...")
    price_data = yf.download(all_sector_etfs + [BENCHMARK], period="7mo")['Close']
    
    # 2. Download all 500 stocks for Breadth
    all_stocks = [t for sublist in sector_map.values() for t in sublist]
    print(f"Downloading data for {len(all_stocks)} stocks for Breadth calculation...")
    breadth_data = yf.download(all_stocks, period="65d")['Close']

    results = []

    for sector_name, etf_ticker in SECTOR_ETF_MAP.items():
        print(f"Analyzing {sector_name} ({etf_ticker})...")
        
        try:
            # --- IMPROVED RRG MATH SECTION ---
            # 1. Base Relative Strength
            rs_raw = (price_data[etf_ticker] / price_data[BENCHMARK])

            # 2. RS-Ratio (X-Axis): Normalize so 100 is the benchmark trend
            # We divide current RS by its 100-day moving average
            rs_ratio_series = (rs_raw / rs_raw.rolling(window=100).mean()) * 100
            
            # 3. RS-Momentum (Y-Axis): Rate of change of the Ratio
            # We compare the Ratio to its own 10-day average
            rs_momentum_series = (rs_ratio_series / rs_ratio_series.rolling(window=10).mean()) * 100
            
            cur_ratio = rs_ratio_series.iloc[-1]
            cur_mom = rs_momentum_series.iloc[-1]
            
            # --- QUADRANT LOGIC (Stays the same, but now uses normalized 100) ---
            status = "Lagging"
            if cur_ratio > 100 and cur_mom > 100: status = "Leading"
            elif cur_ratio > 100 and cur_mom < 100: status = "Weakening"
            elif cur_ratio < 100 and cur_mom > 100: status = "Improving"

            # --- BREADTH MATH (Keep your existing code below) ---
            sector_symbols = sector_map.get(sector_name, [])
            count_above = 0
            valid_symbols = 0
            
            for sym in sector_symbols:
                if sym in breadth_data.columns:
                    series = breadth_data[sym].dropna()
                    if len(series) > 50:
                        ma50 = series.rolling(window=50).mean().iloc[-1]
                        if series.iloc[-1] > ma50:
                            count_above += 1
                        valid_symbols += 1
            
            breadth_pct = (count_above / valid_symbols * 100) if valid_symbols > 0 else 0

            results.append({
                "name": sector_name,
                "ticker": etf_ticker,
                "score": round(cur_ratio, 1), # This will now be near 100
                "momentum": round(cur_mom, 1), # This will now be near 100
                "status": status,
                "breadth": round(breadth_pct, 1),
                "change": round(price_data[etf_ticker].pct_change().iloc[-1] * 100, 2)
            })
        except Exception as e:
            print(f"Error processing {sector_name}: {e}")

    # Save output
    output_path = os.path.join(os.path.dirname(__file__), '..', 'data.json')
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)
    print(f"Successfully updated data.json with {len(results)} sectors.")
    

if __name__ == "__main__":
    get_rotation_data()