import React, { useState, useEffect } from "react";
import jsonData from "./mockData.json";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortingCriteria, setSortingCriteria] = useState("");

  useEffect(() => {
    let apiRes = fetch("https://dummyjson.com/products").then((response) =>
      response.json()
    );
    apiRes.then((data) => setData(jsonData));
  }, []);

  const toggleAssetSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    let sortedData = [...data];

    sortedData.sort((a, b) => {
      if (sortOrder === "asc") {
        if (a.assetClass < b.assetClass) return -1;
        if (a.assetClass > b.assetClass) return 1;
      } else {
        if (a.assetClass < b.assetClass) return 1;
        if (a.assetClass > b.assetClass) return -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const sortData = (criteria) => {
    setSortingCriteria(criteria);
    let sortedData = [...jsonData];

    if (criteria === "priceDescending") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (criteria === "tickerAscending") {
      sortedData.sort((a, b) => a.ticker.localeCompare(b.ticker));
    }

    setData(sortedData);
  };

  const getRowClassName = (assetClass) => {
    switch (assetClass) {
      case "Macro":
        return "row-red";
      case "Equities":
        return "row-blue";
      case "Credit":
        return "row-green";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="reset-order">
        <button onClick={() => setData(jsonData)} className="btn">
          Reset Sorting
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              Ticker
              <button
                onClick={() => sortData("tickerAscending")}
                className="btn"
              >
                Sort (Alpha)
              </button>
            </th>
            <th>
              Price
              <button
                onClick={() => sortData("priceDescending")}
                className="btn"
              >
                Sort (Desc)
              </button>
            </th>
            <th>
              Asset Class
              <button onClick={toggleAssetSortOrder} className="btn">
                {sortOrder === "asc" ? "Sort (Asc)" : "Sort (Desc)"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={getRowClassName(item.assetClass)}>
              <td>{item.ticker}</td>
              <td style={{ color: item.price >= 0 ? "black" : "red" }}>
                {item.price}
              </td>
              <td>{item.assetClass}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
