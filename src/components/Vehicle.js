import React from "react";
import styles from "./Vehicle.module.css"; // Import the CSS module
import { Link } from "react-router-dom";

function Vehicle({ vehicle }) {
  const formattedModelName = vehicle.modelName.replace(/\s+/g, "-");

  return (
    <div className={styles["card-container"]}>
      <Link to={`/${formattedModelName}-dealers/${vehicle._id}`}>
        <img
          className={styles["card-image"]}
          src={vehicle.image}
          alt={vehicle.modelName}
        />
      </Link>
      <div className={styles["card-text-content"]}>
        <Link to={`/${formattedModelName}-dealers/${vehicle._id}`}>
          <h2 className={styles["vehicle-model"]}>{vehicle.modelName}</h2>
        </Link>
        <div>
          <h4 className={styles["brand-name"]}>{vehicle.brand.brandName}</h4>
        </div>
        {/* <p className={styles["price"]}>Price: ${vehicle.price}</p>
        <button className={styles["contact-button"]}>Contact Dealer</button> */}
      </div>
    </div>
  );
}

export default Vehicle;