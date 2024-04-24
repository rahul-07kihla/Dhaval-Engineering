import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompaniesCard = ({ entity, setComponent, setEntity }) => {
  const [overLay, setOverLay] = useState(false);
  const navigate = useNavigate();
  const showOverLay = () => {
    setOverLay(true);
  };
  const hideOverLay = () => {
    setOverLay(false);
  };
  const handleClick = () => {
    // if (!entity) {
    //   alert("waitt");
    // } else {
    //   navigate("/company-details", { state: entity });
    // }
    setComponent("companyDetails");
    setEntity(entity);
  };
  return (
    <div
      className="CompaniesCard"
      onMouseEnter={showOverLay}
      onMouseLeave={hideOverLay}
      onClick={handleClick}
    >
      {entity.icon && (
        <img
          className="CompaniesCard__icon"
          src={entity.icon}
          alt={entity.name}
        />
      )}

      <h3>{entity.name}</h3>
      {overLay && (
        <div className="CompaniesCard__overlay">
          <h4>
            <span>View</span> <span>Details</span>
          </h4>
        </div>
      )}
    </div>
  );
};

export default CompaniesCard;
