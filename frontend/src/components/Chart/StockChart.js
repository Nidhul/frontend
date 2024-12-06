// StockChart.js
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const StockChart = ({ stockName }) => {
  console.log("stockName", stockName);
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const lineSeries = chart.addLineSeries({
      color: "blue",
      lineWidth: 2,
    });

    const fetchStockData = async () => {
      try {
        const response = await fetch(
          // `http://192.168.1.3:8080/live-stock-list/?stock_name=${stockName}`
          // `http://192.168.1.3:8080/live-stock-list/?stock_name=GRSE`
        );
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const stockData = data.data.map((item) => ({
            time: Math.floor(parseInt(item.Timestamp, 10) / 1000), // Convert milliseconds to seconds
            value: parseFloat(item.Last_traded_price), // Convert string to float
          }));

          // Sort the stock data by time in ascending order
          stockData.sort((a, b) => a.time - b.time);

          // Ensure unique timestamps
          const uniqueStockData = [];
          const timeSet = new Set();

          stockData.forEach((item) => {
            if (!timeSet.has(item.time)) {
              timeSet.add(item.time);
              uniqueStockData.push(item);
            }
          });

          lineSeries.setData(uniqueStockData);
        } else {
          console.error("No stock data found for the given stock name");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    // Initial fetch
    fetchStockData();

    // Set interval for fetching stock data every 0.5 seconds
    const intervalId = setInterval(fetchStockData, 300); // 500 milliseconds

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
      chart.remove(); // Remove the chart on component unmount
    };
  }, [stockName]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "600px" }}
    />
  );
};

export default StockChart;
