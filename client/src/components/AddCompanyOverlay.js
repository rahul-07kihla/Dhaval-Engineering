import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAddressCard, FaLocationDot, FaImage } from "react-icons/fa6";
import { FaHatCowboy } from "react-icons/fa";
import { MdDateRange, MdEmail, MdClear } from "react-icons/md";
import { AiOutlineNumber } from "react-icons/ai";
import { LuIndianRupee } from "react-icons/lu";

const AddCompanyOverlay = ({
  hideAddCompanyForm,
  companyId,
  prefilledName,
  prefilledLocation,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [woNo, setWoNo] = useState("");
  const [woValue, setWoValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [extendedDate, setExtendedDate] = useState("");
  const [location, setLocation] = useState("");
  const [RCM, setRCM] = useState("");
  const [RCMemail, setRCMEmail] = useState("");
  const [icon, setIcon] = useState("");
  useEffect(() => {
    setCompanyName(prefilledName);
    setLocation(prefilledLocation);
  }, [companyId, prefilledLocation, prefilledName]);
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const handleAddCompany = async () => {
    const companyData = {
      name: companyName,
      woNo,
      woValue,
      startDate,
      endDate,
      extendedDate,
      location,
      RCM,
      RCMemail,
      icon,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/companies",
        companyData
      );

      if (response.status === 201) {
        console.log("Company added successfully");
        setCompanyName("");
        setWoNo("");
        setWoValue("");
        setStartDate("");
        setEndDate("");
        setExtendedDate("");
        setLocation("");
        setRCM("");
        setRCMEmail("");
        setIcon("");
        hideAddCompanyForm();
      } else {
        console.error("Error adding company:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding company:", error.message);
    }
  };

  return (
    <div className="companies__overlay" onClick={hideAddCompanyForm}>
      <div className="companies__overlay__card" onClick={handleContainerClick}>
        <div className="companies__add-company">
          <MdClear
            className="companies__add-company__close-icon"
            onClick={hideAddCompanyForm}
            size={20}
          />
          <section>
            <h1>Add Company</h1>
            <p>Enter company details</p>
          </section>
          <section className="companies__form-section">
            <div className="fieldset">
              <FaAddressCard size={18} />
              <input
                type="text"
                placeholder="Company name"
                className="field-input"
                value={companyName}
                disabled={!!prefilledName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <AiOutlineNumber size={18} />
              <input
                type="text"
                placeholder="WO No."
                className="field-input"
                value={woNo}
                onChange={(e) => setWoNo(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <LuIndianRupee size={18} />
              <input
                type="text"
                placeholder="WO Value"
                className="field-input"
                value={woValue}
                onChange={(e) => setWoValue(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="Start Date"
                on
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="End Date"
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="Extended Date"
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                value={extendedDate}
                onChange={(e) => setExtendedDate(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <FaLocationDot size={18} />
              <input
                type="text"
                placeholder="Location"
                className="field-input"
                value={location}
                disabled={!!prefilledLocation}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <FaHatCowboy size={18} />
              <input
                type="text"
                placeholder="RCM"
                className="field-input"
                value={RCM}
                onChange={(e) => setRCM(e.target.value)}
              />
            </div>

            <div className="fieldset ">
              <MdEmail size={18} />
              <input
                type="email"
                placeholder="RCM email"
                className="field-input"
                value={RCMemail}
                onChange={(e) => setRCMEmail(e.target.value)}
              />
            </div>
            <div className="fieldset companies__form-section__last-fieldset">
              <FaImage size={18} />
              <input
                type="text"
                placeholder="icon"
                className="field-input"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>

            <button
              className="submit-btn companies__form-section__submit-btn"
              onClick={handleAddCompany}
            >
              {prefilledName ? "Update Company" : "Add Company"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyOverlay;
