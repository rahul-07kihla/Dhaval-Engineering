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
  Data
}) => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    woNo: "",
    woValue: "",
    startDate: "",
    endDate: "",
    extendedDate: "",
    location: "",
    RCM: "",
    RCMemail: "",
    icon: ""
  });

  const [errors, setErrors] = useState({
    companyName: "",
    woNo: "",
    woValue: "",
    startDate: "",
    endDate: "",
    extendedDate: "",
    location: "",
    RCM: "",
    RCMemail: "",
    icon: ""
  });
  // const [companyName, setCompanyName] = useState();
  // const [woNo, setWoNo] = useState("");
  // const [woValue, setWoValue] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [extendedDate, setExtendedDate] = useState("");
  const [location, setLocation] = useState("");
  // const [RCM, setRCM] = useState("");
  // const [RCMemail, setRCMEmail] = useState("");
  // const [icon, setIcon] = useState("");

  useEffect(() => {
    if (Data) {
      setCompanyData(Data);
    }
    // setCompanyName(prefilledName);
    setLocation(prefilledLocation);
  }, [companyId, prefilledLocation, Data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value
    });
    if(name === 'name') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          name: "Name is required"
        })
      }
    }
    if(name === 'woNo') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          woNo: "WO No is required"
        })
      }
    }
    if(name === 'woValue') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          woValue: "Wo Value is required"
        })
      }
    }
    if(name === 'startDate') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          startDate: "Start Date is required"
        })
      }
    }
    if(name === 'endDate') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          endDate: "End Date is required"
        })
      }
    }
    if(name === 'extendedDate') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          extendedDate: "Extended Date is required"
        })
      }
    }
    if(name === 'location') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          location: "Location is required"
        })
      }
    }
    if(name === 'RCM') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          RCM: "RCM is required"
        })
      }
    }
    if(name === 'RCMemail') {
      if(value.trim() === '') {
        setErrors({
          ...errors,
          RCMemail: "RCMemail is required"
        })
      }
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const handleAddCompany = async () => {
    // const companyData = {
    //   name: companyName,
    //   woNo,
    //   woValue,
    //   startDate,
    //   endDate,
    //   extendedDate,
    //   location,
    //   RCM,
    //   RCMemail,
    //   icon,
    // };

    try {
      const url = prefilledName ? "http://localhost:4000/update-companies" : "http://localhost:4000/companies";
      
      const modifiedCompanyData = {
        ...companyData,
        name: 'companyName' // Change the name field as needed
      };
      const response = await axios.post(
        url,
        modifiedCompanyData
      );
      if (response.status === 200) {
        // console.log("Company added successfully");
        // setCompanyName("");
        // setWoNo("");
        // setWoValue("");
        // setStartDate("");
        // setEndDate("");
        // setExtendedDate("");
        // setLocation("");
        // setRCM("");
        // setRCMEmail("");
        // setIcon("");
        hideAddCompanyForm();
      } else if(response.status === 201) {
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
            <h1>{prefilledName ? 'Update' : 'Add'} Company</h1>
            <p>Enter company details</p>
          </section>

          <section className="companies__form-section">
            <div className="fieldset">
              <FaAddressCard size={18} />
              <input
                type="text"
                placeholder="Company name"
                className="field-input"
                value={companyData.name}
                name="companyName"
                disabled={!!prefilledName}
                onChange={handleChange}
              />
            </div>
            {errors.name && <div className="error">{errors.name}</div>}
            <div className="fieldset">
              <AiOutlineNumber size={18} />
              <input
                type="text"
                placeholder="WO No."
                className="field-input"
                name="woNo"
                value={companyData.woNo ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.woNo && <div className="error">{errors.woNo}</div>}
            <div className="fieldset">
              <LuIndianRupee size={18} />
              <input
                type="text"
                placeholder="WO Value"
                className="field-input"
                value={companyData.woValue ?? ''}
                name="woValue"
                onChange={handleChange}
              />
            </div>
            {errors.woValue && <div className="error">{errors.woValue}</div>}
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="Start Date"
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                name="startDate"
                value={companyData.startDate ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.startDate && <div className="error">{errors.startDate}</div>}
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="End Date"
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                name="endDate"
                value={companyData.endDate ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.endDate && <div className="error">{errors.endDate}</div>}
            <div className="fieldset">
              <MdDateRange size={18} />
              <input
                type="text"
                placeholder="Extended Date"
                onFocus={(e) => (e.target.type = "date")}
                className="field-input"
                name="extendedDate"
                value={companyData.extendedDate ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.extendedDate && <div className="error">{errors.extendedDate}</div>}
            <div className="fieldset">
              <FaLocationDot size={18} />
              <input
                type="text"
                placeholder="Location"
                className="field-input"
                name="location"
                value={companyData.location ?? ''}
                disabled={!!prefilledLocation}
                onChange={handleChange}
              />
            </div>
            {errors.location && <div className="error">{errors.location}</div>}
            <div className="fieldset">
              <FaHatCowboy size={18} />
              <input
                type="text"
                placeholder="RCM"
                className="field-input"
                name="RCM"
                value={companyData.RCM ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.RCM && <div className="error">{errors.RCM}</div>}
            <div className="fieldset ">
              <MdEmail size={18} />
              <input
                type="email"
                placeholder="RCM email"
                className="field-input"
                name="RCMemail"
                value={companyData.RCMemail ?? ''}
                onChange={handleChange}
              />
            </div>
            {errors.RCMemail && <div className="error">{errors.RCMemail}</div>}
            <div className="fieldset companies__form-section__last-fieldset">
              <FaImage size={18} />
              <input
                type="text"
                placeholder="icon"
                className="field-input"
                name="icon"
                value={companyData.icon ?? ''}
                onChange={handleChange}
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
