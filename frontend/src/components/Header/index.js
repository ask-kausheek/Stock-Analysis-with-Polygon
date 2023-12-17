import React, { useState, useEffect } from 'react';
import './Header.css'; // Import your CSS file for styling

const YourComponent = () => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchfilter, setSearchFilter] = useState("");
  
console.log(searchfilter)
  useEffect(() => {
    // Fetching the JSON data from the file
    fetch('/Top20_items.json') // Fetching the JSON file from the public folder
      .then(response => response.json())
      .then(data => {
        setJsonData(data);
        console.log(data)
        //console.log(data.results)
        setFilteredData(data); // Set initial filtered data as all results
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  

  useEffect(() => {
    const filtered = jsonData.filter(stock => stock.T.includes(searchfilter.toUpperCase()));
    setFilteredData(filtered);
  }, [searchfilter,jsonData]);




  const resetFilter = () => {
    // Reset filter to show all results
    setFilteredData(jsonData);
    setSearchFilter("");
  };



  return (
    <div className="container">
      <h1>Stock Data</h1>
      <div className="filter-section">
       
        <input onChange={e=> setSearchFilter(e.target.value) } value={searchfilter}/>
        <button onClick={resetFilter}>Reset Filter</button>
        

      </div>
      {jsonData ? (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Ticker</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((stock, index) => (
              <tr key={index} className="table-row"  >
              <td>{index + 1}</td>
                <td>{stock.T}</td>
                <td>{stock.o}</td>
                <td>{stock.h}</td>
                <td>{stock.l}</td>
                <td>{stock.c}</td>
                <td>{stock.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default YourComponent;
