import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";import styles from "../components/Vehicle.module.css";
import Brandlist from "../components/Brandlist";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
import ShowVehicleDeals from "../components/ShowVehicleDeals";

function CarModelByBrand() {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const vehiclesPerPage = 8; // Define the number of vehicles per page
  const [isLoading, setIsLoading] = useState(false);

  const { brandId } = useParams();

  const getVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `http://localhost:8000/api/dealerVehicle-brand/${brandId}?page=${currentPage}&limit=${vehiclesPerPage}`;

      
      const response = await axios.get(url);
      const { data } = response; // Destructure the response
      console.log(data);
      if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
        setVehicles([]);
        setCurrentPage(1);
        setTotalPages(0);
        setIsLoading(false);
      } else {
        const { dealerVehicles, currentPage, totalPages } = data; // Destructure from data

        setVehicles(dealerVehicles);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [brandId, currentPage, vehiclesPerPage]); // Remove currentPage from the dependency array

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
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
        <div className={styles["home-page"]}>
         <h1 style={{ fontWeight: "900", color: "rgb(102, 98, 98)", textAlign: "center" }}>
            CAR LIST
          </h1>
          <Brandlist />
          <div className={styles["vehicle-grid"]}>
                {vehicles.map((vehicle) => (
                  <ShowVehicleDeals key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>
          <div className={styles["pagination-container"]}>
            <span>Page: {currentPage}</span>
            <div className={styles["pagination-buttons"]}>
              <button onClick={prevPage} disabled={currentPage === 1}>
                Prev Page
              </button>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarModelByBrand;
