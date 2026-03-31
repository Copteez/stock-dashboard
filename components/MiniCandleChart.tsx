"use client";
import { useEffect, useRef } from 'react';
import { 
  createChart, 
  ColorType, 
  CandlestickSeries, 
  Time, 
  IChartApi 
} from 'lightweight-charts';

export default function MiniCandleChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Create the chart instance
    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      width: 360,
      height: 56,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { 
        visible: false,
        borderVisible: false,
      },
      timeScale: { 
        visible: false, 
        borderVisible: false,
      },
      // Disable all interactions for a "sparkline" look
      handleScroll: false,
      handleScale: false,
    });

    // 2. Add the Candlestick series using the constructor
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // 3. Format the data precisely for LWC
    const formattedData = data.map((d, index) => {
      // LWC is very strict: time must be a string 'YYYY-MM-DD' or a Unix timestamp
      // If your Python script sends '2026-03-31', use it. Otherwise, use index.
      return {
        time: (d.time || (1700000000 + index * 86400)) as Time,
        open: Number(d.o),
        high: Number(d.h),
        low: Number(d.l),
        close: Number(d.c),
      };
    });

    // 4. Set data and fit to container width
    candleSeries.setData(formattedData);
    chart.timeScale().fitContent();

    // 5. Cleanup on unmount
    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full flex items-center justify-center"
    />
  );
}