import React, { useEffect, useState } from 'react';

const StockUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const intervalMap = {};

    useEffect(() => {
        const socket = new WebSocket('wss://socket.polygon.io'); // Replace with your backend WebSocket URL
        // Replace 'YOUR_API_KEY' with your actual Polygon.io API key
        const apiKey = process.env.POLYGON_API_KEY;

        socket.onopen = () => {
            console.log('WebSocket connected');
            
            // Subscribe to stock symbols and set different intervals for each
            symbols.forEach(({ symbol, interval }) => {
              socket.send(JSON.stringify({
                action: 'subscribe',
                params: `T.${symbol}`,
                apiKey: apiKey,
              }));

            // Update data for the stock symbol at the specified interval
            intervalMap[symbol] = setInterval(() => {
                // Fetch and update stock data here
                console.log(`Fetching updates for ${symbol}`);
                // Add logic to handle stock updates
            }, interval);
            });
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            // Process received data as needed and update state
            setUpdates(prevUpdates => [...prevUpdates, data]);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
          };


        return () => {
            socket.close();

            // Clear intervals when component unmounts
            symbols.forEach(({ symbol }) => {
            clearInterval(intervalMap[symbol]);
            });
            };
            }, []);

    return (
        <div>
      <h2>Stock Updates</h2>
      <ul>
        {updates.map((update, index) => (
          <li key={index}>{JSON.stringify(update)}</li>
        ))}
      </ul>
    </div>
    );
};

export default StockUpdates;
