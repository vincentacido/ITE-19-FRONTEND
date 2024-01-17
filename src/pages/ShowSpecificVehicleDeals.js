import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ShowVehicleDeals from "../components/ShowVehicleDeals";
import styles from "../components/Vehicle.module.css";
import Brandlist from "../components/Brandlist";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";

function ShowSpecificVehicleDeals() {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modelInfo, setModelInfo] = useState({}); // State for dealer information
  const vehiclesPerPage = 8; // Define the number of vehicles per page
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(""); // State to hold selected style filter

  const { modelId } = useParams();

  const getVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `http://localhost:8000/api/dealerVehicle/${modelId}?page=${currentPage}&limit=${vehiclesPerPage}`;

      if (selectedPrice) {
        url += `&price=${selectedPrice}`;
      }

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
        setModelInfo(
          dealerVehicles.length > 0 ? dealerVehicles[0].modelInfo : {}
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [modelId, currentPage, vehiclesPerPage, selectedPrice]); // Remove currentPage from the dependency array

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleStyleChange = (e) => {
    setSelectedPrice(e.target.value); // Update selected style when dropdown value changes
  };

  return (
    <>
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
          {vehicles.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "50px",
                fontWeight: "900",
                color: " rgb(102, 98, 98)",
                marginTop: "20vh",
                wordWrap: "break-word",
              }}
            >
              No {modelInfo.modelName} Price less than ${selectedPrice}
            </div>
          ) : (
            <div className={styles["home-page"]}>
              <h1 style={{ fontWeight: "900", color: " rgb(102, 98, 98)" }}>
                {modelInfo.modelName}'s Dealers{" "}
              </h1>
              {/* Consider rendering a specific vehicle's image */}
              {/* <img src={vehicles.modelName} alt={vehicles.modelName} /> */}

              <Brandlist />
              <div style={{ margin: "10px 40px" }}>
                <select value={selectedPrice} onChange={handleStyleChange}>
                  <option value="">All</option>
                  <option value="500000">less than 500k</option>
                  <option value="450000">less than 450k</option>
                  <option value="400000">less than 400k</option>
                  <option value="350000">less than 350k</option>
                  <option value="300000">less than 300k</option>
                  <option value="250000">less than 250k</option>
                  <option value="200000">less than 200k</option>
                  <option value="150000">less than 150k</option>
                  <option value="100000">less than 100k</option>
                  <option value="50000">less than 50k</option>
                  {/* Add other style options as needed */}
                </select>
              </div>
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
      )}
    </>
  );
}
export default ShowSpecificVehicleDeals;
