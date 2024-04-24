import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import axios from "axios";

const EmployeesTable = ({ employeeData, setEmployeeData }) => {
  const [openEditOverlay, setOpenEditOverlay] = useState([]);
  const [employeesOptions, setEmployeesOptions] = useState({});

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      if (response.status === 200) {
        const options = response.data.map((company) => ({
          value: company.name,
          label: company.name,
        }));
        const optionsObject = {};
        employeeData.forEach((item) => {
          const selectedCompanies = item.companies.map((company) => ({
            value: company,
            label: company,
          }));
          const employeeOptions = options.map((option) => ({ ...option }));

          optionsObject[item._id] = {
            options: employeeOptions,
            selectedCompanies: selectedCompanies,
          };
        });

        setEmployeesOptions(optionsObject);
      } else {
        console.error("Error fetching companies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching companies:", error.message);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [employeeData]);

  const toggleEditOverlay = (employeeId) => {
    setOpenEditOverlay(
      openEditOverlay.includes(employeeId)
        ? openEditOverlay.filter((id) => id !== employeeId)
        : [...openEditOverlay, employeeId]
    );
  };
  const isEditOverlayOpen = (employeeId) =>
    openEditOverlay.includes(employeeId);
  const handleChange = async (selectedOptions, employeeId) => {
    const companies = selectedOptions.map((option) => option.value);
    try {
      const response = await axios.post(
        "http://localhost:4000/update-employee",
        {
          employeeId,
          companies,
        }
      );
      console.log(response.data);

      setEmployeesOptions((prevOptions) => {
        if (!employeeId) return prevOptions; // Check if employeeId is valid
        return {
          ...prevOptions,
          [employeeId]: {
            ...(prevOptions[employeeId] || {}),
            selectedCompanies: selectedOptions,
          },
        };
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditCompanies = async (employeeId) => {
    const selectedCompanies = employeesOptions[employeeId].selectedCompanies;
    const companies = selectedCompanies.map((option) => option.value);
    try {
      const response = await axios.post(
        "http://localhost:4000/update-employee",
        {
          employeeId,
          companies,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const updatedEmployeeData = employeeData.map((employee) => {
          if (employee._id === employeeId) {
            return {
              ...employee,
              companies: companies,
            };
          }

          return employee;
        });
        setEmployeeData(updatedEmployeeData);
        fetchCompanies();
        toggleEditOverlay(employeeId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/employees/${employeeId}`
      );
      if (response.status === 200) {
        const updatedEmployeeData = employeeData.filter(
          (employee) => employee._id !== employeeId
        );
        setEmployeeData(updatedEmployeeData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <table className="employees__table">
      <thead>
        <tr>
          <th className="employees__table__fname employees__table__heading">
            First Name
          </th>
          <th className="employees__table__lname employees__table__heading">
            Last Name
          </th>
          <th className="employees__table__email employees__table__heading">
            Email
          </th>
          <th className="employees__table__designation employees__table__heading">
            Designation
          </th>
          <th className="employees__table__companies employees__table__heading">
            Companies
          </th>
          <th className="employees__table__edit-delete employees__table__heading"></th>
        </tr>
      </thead>
      <tbody>
        {employeeData.map((item, index) => (
          <tr key={index} className={`employees__table__records`}>
            <td
              className={
                index === employeeData.length - 1
                  ? "employees__table__records__last-record__fname"
                  : ""
              }
            >
              <span>{item.fname}</span>
            </td>
            <td>{item.lname}</td>
            <td>{item.email}</td>

            {/* <td>
              {item.extendedDate === null ? "-" : formatDate(item.extendedDate)}
            </td> */}
            <td>{item.designation}</td>

            <td
              className={`employees__table__records__companies
                ${
                  index === employeeData.length - 1
                    ? "employees__table__records__last-record__companies"
                    : ""
                }
              `}
            >
              {item.companies.join(", ")}

              <FaEdit
                className="employees__table__records__companies__edit-icon"
                onClick={() => {
                  toggleEditOverlay(item._id);
                }}
              />

              {isEditOverlayOpen(item._id) && (
                <div className="employees__table__records__companies__info-overlay">
                  <div className="employees__table__records__companies__info-overlay__form-section">
                    <p>Edit companies:</p>
                    {console.log("employeesOptions:", employeesOptions)}
                    {console.log(
                      "employeesOptions[item._id]:",
                      employeesOptions[item._id]
                    )}
                    {employeesOptions && employeesOptions[item._id] && (
                      <Select
                        className="field-input"
                        options={employeesOptions[item._id].options}
                        onChange={(selectedOptions) =>
                          handleChange(selectedOptions, item._id)
                        }
                        value={employeesOptions[item._id].selectedCompanies}
                        isMulti
                      />
                    )}
                    <button
                      className="submit-btn employees__form-section__submit-btn"
                      onClick={() => handleEditCompanies(item._id)}
                    >
                      Edit Companies
                    </button>
                  </div>
                </div>
              )}
            </td>
            <td
              className={`employees__table__records__edit-delete
                ${
                  index === employeeData.length - 1
                    ? "employees__table__records__last-record__edit-delete"
                    : ""
                }
              `}
            >
              <FaTrash
                className="employees__table__records__edit-delete__del-icon"
                onClick={() => handleDeleteEmployee(item._id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeesTable;
