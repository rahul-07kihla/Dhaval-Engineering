import React, { useState, useEffect } from "react";
import HeaderSearchBar from "./components/HeaderSearchBar";
import EmployeesTable from "./components/EmployeesTable";
import AddEmployeeOverlay from "./components/AddEmployeeOverlay";
import axios from "axios";

const Employees = ({ showSidebar }) => {
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const addEmployeeClick = () => {
    setShowAddEmployeeForm(true);
  };
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/employees");
      if (response.status === 200) {
        setEmployeeData(response.data);
        console.log(response.data);
      } else {
        console.error("Error fetching company data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching company data:", error.message);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
  }, []);
  const hideAddEmployeeForm = () => {
    setShowAddEmployeeForm(false);
    fetchEmployeeData();
  };
  return (
    <div className={`employees ${showSidebar ? "" : "employees-expanded"}`}>
      <HeaderSearchBar hideIcon={showSidebar} />
      <div className="employees__toolbar">
        <div className="employees__toolbar__categories">
          <button className="employees__toolbar__categories__companies">
            Employees
          </button>
        </div>
        <div className="employees__toolbar__options">
          <button
            className="employees__toolbar__options__add"
            onClick={addEmployeeClick}
          >
            <span className="employees__toolbar__options__add__icon">+</span>
            Add Employee
          </button>
        </div>
      </div>

      <EmployeesTable
        employeeData={employeeData}
        setEmployeeData={setEmployeeData}
      />
      {showAddEmployeeForm && (
        <AddEmployeeOverlay hideAddEmployeeForm={hideAddEmployeeForm} />
      )}
    </div>
  );
};

export default Employees;
