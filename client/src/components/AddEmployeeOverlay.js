import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAddressCard, FaIndustry } from "react-icons/fa6";
import { FaHatCowboy } from "react-icons/fa";
import { MdEmail, MdClear } from "react-icons/md";
import Select from "react-select";

const AddEmployeeOverlay = ({
  hideAddEmployeeForm,
  companyId,
  prefilledName,
  prefilledLocation,
}) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [options, setOptions] = useState([]);

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      if (response.status === 200) {
        const options = response.data.map((company) => ({
          value: company.name,
          label: company.name,
        }));
        setOptions(options);
        setCompanies(response.data);
      } else {
        console.error("Error fetching companies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching companies:", error.message);
    }
  };

  const handleAddEmployee = async () => {
    const companies = selectedCompanies.map((option) => option.value);
    const employeeData = {
      fname,
      lname,
      email,
      designation,
      companies,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/employees",
        employeeData
      );

      if (response.status === 201) {
        console.log("Employee added successfully");
        setFname("");
        setLname("");
        setEmail("");
        setDesignation("");
        setCompanies([]);
        hideAddEmployeeForm();
      } else {
        console.error("Error adding company:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding company:", error.message);
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedCompanies(selectedOptions);
  };

  return (
    <div className="employees__overlay" onClick={hideAddEmployeeForm}>
      <div className="employees__overlay__card" onClick={handleContainerClick}>
        <div className="employees__add-employee">
          <MdClear
            className="employees__add-employee__close-icon"
            onClick={hideAddEmployeeForm}
            size={20}
          />
          <section>
            <h1>Add Employee</h1>
            <p>Enter employee details</p>
          </section>
          <section className="employees__form-section">
            <div className="fieldset">
              <FaAddressCard size={18} />
              <input
                type="text"
                placeholder="First name"
                className="field-input"
                value={fname}
                disabled={!!prefilledName}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <FaAddressCard size={18} />
              <input
                type="text"
                placeholder="Last name"
                className="field-input"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="fieldset">
              <MdEmail size={18} />
              <input
                type="text"
                placeholder="Email id"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="fieldset">
              <FaHatCowboy size={18} />
              <input
                type="text"
                placeholder="Designation"
                className="field-input"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>

            <div className="fieldset employees__form-section__last-fieldset">
              <FaIndustry />

              <Select
                className="field-input"
                options={options}
                onChange={handleChange}
                value={selectedCompanies}
                isMulti
              />
            </div>

            <button
              className="submit-btn employees__form-section__submit-btn"
              onClick={handleAddEmployee}
            >
              Add Employee
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeOverlay;
