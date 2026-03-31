import yfinance as yf
import pandas as pd
import json
import os
import requests
from io import StringIO

BENCHMARK = "SPY"

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
    print("Scraping S&P 500 structure...")
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    headers = {'User-Agent': 'MarketRotationBot/1.0'}
    response = requests.get(url, headers=headers)
    html_data = StringIO(response.text)
    df = pd.read_html(html_data)[0]
    df['Symbol'] = df['Symbol'].str.replace('.', '-', regex=False)
    df['GICS Sector'] = df['GICS Sector'].str.strip()
    
    sector_map = {}
    for sector in df['GICS Sector'].unique():
        tickers = df[df['GICS Sector'] == sector]['Symbol'].tolist()
        sector_map[sector] = tickers
    return sector_map

def get_rotation_data():
    sector_map = get_sp500_structure()
    all_sector_etfs = list(SECTOR_ETF_MAP.values())
    
    print("Downloading Sector ETF data...")
    price_data = yf.download(all_sector_etfs + [BENCHMARK], period="1y")['Close']
    
    all_stocks = [t for sublist in sector_map.values() for t in sublist]
    print(f"Downloading {len(all_stocks)} stocks with OHLC (1Y period)...")
    
    # CRITICAL CHANGE: Download full OHLC data, not just ['Close']
    raw_data = yf.download(all_stocks, period="1y")

    results = []

    for sector_name, etf_ticker in SECTOR_ETF_MAP.items():
        sector_symbols = sector_map.get(sector_name, [])
        print(f"Analyzing {sector_name}: Found {len(sector_symbols)} stocks.")

        try:
            # --- RRG MATH ---
            rs_raw = (price_data[etf_ticker] / price_data[BENCHMARK])
            rs_ratio_series = (rs_raw / rs_raw.rolling(window=100).mean()) * 100
            rs_momentum_series = (rs_ratio_series / rs_ratio_series.rolling(window=10).mean()) * 100
            
            cur_ratio = float(rs_ratio_series.iloc[-1])
            cur_mom = float(rs_momentum_series.iloc[-1])
            
            status = "Lagging"
            if cur_ratio > 100 and cur_mom > 100: status = "Leading"
            elif cur_ratio > 100 and cur_mom < 100: status = "Weakening"
            elif cur_ratio < 100 and cur_mom > 100: status = "Improving"

            symbol_rankings = []
            setup_count = 0
            extended_count = 0
            count_above_50ma = 0
            valid_symbols = 0

            for sym in sector_symbols:
                # Check if symbol exists in the MultiIndex columns
                if sym in raw_data['Close'].columns:
                    # Get the specific data for this symbol
                    s_close = raw_data['Close'][sym].dropna()
                    s_open = raw_data['Open'][sym].dropna()
                    s_high = raw_data['High'][sym].dropna()
                    s_low = raw_data['Low'][sym].dropna()

                    if len(s_close) >= 250:
                        valid_symbols += 1
                        curr = float(s_close.iloc[-1])
                        prev = float(s_close.iloc[-2])
                        ma50 = float(s_close.rolling(window=50).mean().iloc[-1])
                        high_52w = float(s_close.tail(252).max())

                        rs_score = round((curr / ma50) * 100, 1)
                        change_1d = round(((curr - prev) / prev) * 100, 2)
                        dist_52w = round(((curr - high_52w) / high_52w) * 100, 1)
                        
                        if curr > ma50: count_above_50ma += 1
                        if curr > ma50 and (curr / ma50 < 1.02): setup_count += 1
                        if curr / ma50 > 1.15: extended_count += 1

                        # --- REAL OHLC FOR CANDLESTICKS ---
                        # Get last 30 days
                        ohlc_tail = []
                        last_30_indices = s_close.tail(30).index
                        
                        for date in last_30_indices:
                            ohlc_tail.append({
                                "time": date.strftime('%Y-%m-%d'),
                                "o": round(float(s_open.loc[date]), 2),
                                "h": round(float(s_high.loc[date]), 2),
                                "l": round(float(s_low.loc[date]), 2),
                                "c": round(float(s_close.loc[date]), 2)
                            })

                        symbol_rankings.append({
                            "symbol": sym,
                            "ohlc": ohlc_tail,
                            "close": round(curr, 2),
                            "rs_score": rs_score,
                            "change_1d": change_1d,
                            "dist_52w": dist_52w
                        })

            symbol_rankings.sort(key=lambda x: x['rs_score'], reverse=True)
            breadth_pct = round((count_above_50ma / valid_symbols * 100), 1) if valid_symbols > 0 else 0

            # --- TRAIL ---
            trail = []
            clean_ratio = rs_ratio_series.dropna()
            clean_mom = rs_momentum_series.dropna()
            if len(clean_ratio) >= 5:
                for i in range(-5, 0):
                    trail.append({
                        "x": round(float(clean_ratio.iloc[i]), 2),
                        "y": round(float(clean_mom.iloc[i]), 2)
                    })

            daily_pct = round(float(((price_data[etf_ticker].iloc[-1] - price_data[etf_ticker].iloc[-2]) / price_data[etf_ticker].iloc[-2]) * 100), 2)

            results.append({
                "name": sector_name,
                "ticker": etf_ticker,
                "score": round(cur_ratio, 1),
                "momentum": round(cur_mom, 1),
                "status": status,
                "breadth": breadth_pct,
                "setups": setup_count,
                "extended": extended_count,
                "rankings": symbol_rankings[:10], 
                "trail": trail,
                "change": daily_pct
            })
            
        except Exception as e:
            print(f"Error in {sector_name}: {str(e)}")

    output_path = os.path.join(os.path.dirname(__file__), '..', 'data.json')
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)
    
    print(f"Done. Saved to {output_path}")

if __name__ == "__main__":
    get_rotation_data()