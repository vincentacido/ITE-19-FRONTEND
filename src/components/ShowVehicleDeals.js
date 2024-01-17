import React from "react";
import styles from "./Vehicle.module.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";


function ShowDealerVehicle({ vehicle, isMaxPrice, isMinPrice}) {
  const handleContactClick = () => {
    window.location.href = `mailto:${vehicle.dealer.dealerEmail}`;
  };

  const formattedModelName = vehicle.modelInfo.modelName.replace(/\s+/g, "-");

  return (
    <>
      <div className={styles["card-container"]}>
      <Link to={`/${formattedModelName}-dealers/${vehicle.modelInfo._id}`}>
        <img
          className={styles["card-image"]}
          src={vehicle.modelInfo.image}
          alt={vehicle.modelInfo.modelName}
        />
         </Link>
        <div className={styles["card-text-content"]}>
          <h2>
            {vehicle.modelInfo.modelName}
            <FaLongArrowAltRight className={styles["arrow"]} />
            <span>{vehicle.brandInfo.brandName}</span>
          </h2>
          <div className={styles["vehicle-status-price"]}>
            <h4 className={styles["status"]}>{vehicle.vehicleStatus}</h4>
            <h4 className={styles["status"]}>{vehicle.modelInfo.style}</h4>
            <h4> $ {vehicle.price}</h4>
            {isMaxPrice && (
              <p className={styles["max-indicator"]}>Highest Price</p>
            )}
            {isMinPrice && (
              <p className={styles["min-indicator"]}>Lowest Price</p>
            )}
          </div>
          <div className={styles["dealer-info"]}>
            <h4>{vehicle.dealerInfo.dealerName}</h4>
            <h4>{vehicle.dealer.dealerAddr}</h4>
            <h4>{vehicle.dealerInfo.dealerPhone}</h4>
          </div>

          <div className={styles["center-button"]}>
            <button
              className={styles["contact-me"]}
              onClick={handleContactClick}
            >
              Email Me
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowDealerVehicle;
