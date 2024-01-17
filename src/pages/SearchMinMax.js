import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loader from "../components/loader";
import styles from "../components/Vehicle.module.css";
import ShowVehicleDeals from "../components/ShowVehicleDeals";

function SearchResult() {
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search);
    const minPrice = queryParams.get("minPrice");
    const maxPrice = queryParams.get("maxPrice");
  const [priceResult, setPriceResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const vehiclesPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  console.log(minPrice, maxPrice)
  useEffect(() => {
    const fetchPriceResult = async () => {
      try {
        setIsLoading(true);
        let url = `http://localhost:8000/api/get-dealer-vehicle-price-search?page=${currentPage}&limit=${vehiclesPerPage}`;
       
        if (minPrice) {
            url += `&minPrice=${minPrice}`;
          }
  
          if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
          }
          
        console.log(url)
        const response = await axios.get(url);
        const { data } = response;

        if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
          setPriceResult([]);
          setCurrentPage(1);
          setTotalPages(0);
        } else {
          const { dealerVehicles, currentPage, totalPages } = data;

          setPriceResult(dealerVehicles);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error("Error fetching dealer vehicles:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceResult();
  }, [minPrice, maxPrice, currentPage, vehiclesPerPage]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  
  console.log(priceResult)

  const max = Math.max(...priceResult.map((vehicle) => vehicle.price));
  const min = Math.min(...priceResult.map((vehicle) => vehicle.price));
  return (
    <>
      <div>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <h1
              style={{
                textAlign: "center",
                fontWeight: "900",
                color: "rgb(102, 98, 98)",
                margin: "50px 0",
              }}
            >
            Minimum Price {minPrice || 0} To  Maximum Price {max || Infinity}
            </h1>
            <div className={styles["vehicle-grid"]}>
              {priceResult.map((priceResult, index) => (
                <ShowVehicleDeals
                  key={index}
                  vehicle={priceResult}
                  // isMaxPrice={priceResult.price === max}
                  // isMinPrice={priceResult.price === min}
                />
              ))}
            </div>
            <div className={styles["pagination-container"]}>
              <span>Page: {currentPage}</span>
              <div className={styles["pagination-buttons"]}>
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Prev Page
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchResult;
