
import React, { useEffect, useState } from 'react';

const StockDataComponent = () => {
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://192.168.1.17:8000/ws/market-data/');

        // WebSocket is connected
        socket.onopen = function(event) {
            console.log("WebSocket connection established.");
        };
        
        // WebSocket receives a message from the server
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("Market data from server:", data);
        
            // Update the stock data state with the received data
            setStockData((prevData) => {
                // If you are receiving multiple stocks, you may want to overwrite or update based on token or stock_name.
                // Assuming the data is an object with stock tokens as keys:
                const updatedStockData = Object.entries(data).map(([token, stockInfo]) => ({
                    name: stockInfo.stock_name,
                    ltp: stockInfo.ltp,
                }));
                console.log("updated",updatedStockData)
                return updatedStockData;

            });
        };
        
        // WebSocket is closed
        socket.onclose = function(event) {
            console.log("WebSocket connection closed:", event);
        };
        
        // Handle WebSocket errors
        socket.onerror = function(error) {
            console.log("WebSocket error:", error);
        };
        
        // Clean up the WebSocket connection when the component unmounts
        return () => {
            socket.close();

        };
    }, []);

    return (
        <div>
            <h1>Live Stock Data</h1>
            {stockData.length > 0 ? (
                stockData.map((stock, index) => (
                    <div key={index}>
                        <strong>{stock.name}</strong>: {stock.ltp}
                    </div>
                ))
            ) : (
                <p>No stock data available.</p>
            )}
        </div>
    );
};

export default StockDataComponent;
