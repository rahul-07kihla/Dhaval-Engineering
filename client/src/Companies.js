import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderSearchBar from "./components/HeaderSearchBar";
import { LuFilter } from "react-icons/lu";
import CompaniesTable from "./components/CompaniesTable";
import CompaniesCard from "./components/CompaniesCard";
import { BsGrid3X3 } from "react-icons/bs";
import { TfiViewListAlt } from "react-icons/tfi";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import AddCompanyOverlay from "./components/AddCompanyOverlay";
import Pagination from "./components/Pagination";

const Companies = ({ showSidebar, setComponent, setEntity }) => {
  const [view, setView] = useState("grid");
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName");
  if (!userName) {
    navigate("/login");
  }
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      if (response.status === 200) {
        setCompanyData(response.data);
      } else {
        console.error("Error fetching company data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching company data:", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const addCompanyClick = () => {
    setShowAddCompanyForm(true);
  };
  const selectGridView = () => {
    setView("grid");
  };
  const selectListView = () => {
    setView("list");
  };
  const hideAddCompanyForm = () => {
    setShowAddCompanyForm(false);
    fetchData();
  };
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const totalPages = Math.ceil(companyData.length / recordsPerPage);
  const currentRecords = companyData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className={`companies ${showSidebar ? "" : "companies-expanded"}`}>
      <HeaderSearchBar
        hideIcon={showSidebar}
        showAddCompanyForm={showAddCompanyForm}
      />
      <div className="companies__toolbar">
        <div className="companies__toolbar__categories">
          <button className="companies__toolbar__categories__companies">
            Companies
          </button>
        </div>
        <div className="companies__toolbar__options">
          <button
            className="companies__toolbar__options__add"
            onClick={addCompanyClick}
          >
            <span className="companies__toolbar__options__add__icon">+</span>
            Add Company
          </button>
          <button className="companies__toolbar__options__filter">
            <LuFilter
              size={20}
              className="companies__toolbar__options__filter__icon"
            />
            Filter
          </button>
          <div className="companies__toolbar__options__view-selection">
            <div className="companies__toolbar__options__view-selection__grid">
              <BsGrid3X3
                className="companies__toolbar__options__view-selection__grid-icon"
                size={20}
                onClick={selectGridView}
              />
              {view === "grid" ? (
                <MdDone
                  className="companies__toolbar__options__view-selection__tick-icon"
                  size={20}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="companies__toolbar__options__view-selection__list">
              {view === "list" ? (
                <MdDone
                  className="companies__toolbar__options__view-selection__tick-icon"
                  size={20}
                />
              ) : (
                <></>
              )}
              <TfiViewListAlt
                className="companies__toolbar__options__view-selection__list-icon"
                size={20}
                onClick={selectListView}
              />
            </div>
          </div>
        </div>
      </div>
      {view === "grid" ? (
        <div className="companies__cards">
          {companyData &&
            companyData.map((entity, index) => (
              <CompaniesCard
                key={index}
                entity={entity}
                setComponent={setComponent}
                setEntity={setEntity}
              />
            ))}
        </div>
      ) : (
        <></>
      )}
      {view === "list" && companyData && (
        <CompaniesTable
          companyData={currentRecords}
          setComponent={setComponent}
          setEntity={setEntity}
        />
      )}
      {totalPages > 1 && (
        <div className="companies__pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`companies__pagination__arrows ${
              currentPage === 1 ? "companies__pagination__arrows__disabled" : ""
            }`}
          >
            {"<"}
          </button>
          {companyData && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(companyData.length / recordsPerPage)
            }
            className={`companies__pagination__arrows ${
              currentPage === 1 ? "companies__pagination__arrows__disabled" : ""
            }`}
          >
            {">"}
          </button>
        </div>
      )}

      {showAddCompanyForm && (
        <AddCompanyOverlay hideAddCompanyForm={hideAddCompanyForm} />
      )}
    </div>
  );
};

export default Companies;
