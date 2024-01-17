import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "../components/Vehicle.module.css";
import Brandlist from "../components/Brandlist";
import Loader from "../components/loader";
import ShowVehicleDeals from "../components/ShowVehicleDeals";
// import MinMax from "../components/MinMax";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(""); // State to hold selected style filter
  const [totalPages, setTotalPages] = useState(0);
  const [maxVehiclePrice, setMaxVehiclePrice] = useState(0);
  const [minVehiclePrice, setMinVehiclePrice] = useState(0);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        setIsLoading(true);
        let url = `http://localhost:8000/api/dealerVehicle-pagination?page=${currentPage}&limit=${vehiclesPerPage}`;

        if (selectedStyle) {
          url += `&style=${selectedStyle}`;
        }

        const response = await axios.get(url);
        const { data } = response;

        if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
          setVehicles([]);
          setCurrentPage(1);
          setTotalPages(0);
          setIsLoading(false);
        } else {
          const { dealerVehicles, currentPage, totalPages } = data;
          setVehicles(dealerVehicles);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);

          // Calculate maxPrice and minPrice here
          // const prices = dealerVehicles.map((vehicle) => vehicle.price);
          // const newMaxPrice = Math.max(...prices);
          // const newMinPrice = Math.min(...prices);
          // setMaxVehiclePrice(newMaxPrice);
          // setMinVehiclePrice(newMinPrice);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    getVehicles();
  }, [currentPage, vehiclesPerPage, selectedStyle]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value); // Update selected style when dropdown value changes
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles["loader-container"]}>
          <Loader />
        </div>
      ) : (
        <div className={styles["home-page"]}>
          <h1 className={styles["page-title"]}>VEHICLE LIST</h1>
          <Brandlist />
          {/* <MinMax /> */}
          <div className={styles["filter-container"]}>
            <select
              value={selectedStyle}
              onChange={handleStyleChange}
              className={styles["custom-select"]}
            >
              <option value="">All Styles</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="COUPE">Coupe</option>
            </select>
          </div>

          <div className={styles["vehicle-grid"]}>
            {vehicles.map((vehicle) => (
              <ShowVehicleDeals
                key={vehicle._id}
                vehicle={vehicle}
                // isMaxPrice={vehicle.price === maxVehiclePrice}
                // isMinPrice={vehicle.price === minVehiclePrice}
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
                disabled={vehicles.length < vehiclesPerPage}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

