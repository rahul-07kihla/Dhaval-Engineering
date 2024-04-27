import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { LuFilter } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import InvoicesTable from "./components/InvoicesTable";
import NewInvoiceOverlay from "./components/NewInvoiceOverlay";
import AddCompanyOverlay from "./components/AddCompanyOverlay";

const Invoices = ({ showSidebar, entity }) => {
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState();
  const [showResumeWorkButton, setShowResumeWorkButton] = useState(false);
  const [showCompanyOverlay, setShowCompanyOverlay] = useState(false);
const [addeditstate, setAddeditstate] = useState('');

  const hideAddCompanyForm = () => {
    setShowCompanyOverlay(false);
  };
  useEffect(() => {
    const currentDate = new Date();
    const endDate = new Date(entity.endDate);

    const extendedDate = entity.extendedDate
      ? new Date(entity.extendedDate)
      : null;

    const laterDate = endDate > extendedDate ? endDate : extendedDate;
    if (currentDate > laterDate) {
      setShowResumeWorkButton(true);
    }
  }, [selectedInvoice]);

  const newInvoiceClick = () => {
    setAddeditstate('add');
    const currentDate = new Date();
    const endDate = new Date(entity.endDate);
    console.log(addeditstate);
    const extendedDate = entity.extendedDate
      ? new Date(entity.extendedDate)
      : null;

    const laterDate = endDate > extendedDate ? endDate : extendedDate;
    const oneMonthLaterDate = new Date(laterDate);

    oneMonthLaterDate.setMonth(oneMonthLaterDate.getMonth() + 1);
    console.log("End Date:", endDate);
    console.log("Extended Date:", extendedDate);
    console.log("Later Date:", laterDate);
    console.log("One Month Later Date:", oneMonthLaterDate);

    if (currentDate > oneMonthLaterDate) {
      console.log("Showing alert: Cannot create invoice after end date");
      alert("Cannot create invoice after end date");
    } else {
      setSelectedInvoice(null);

      setShowNewInvoiceForm(!showNewInvoiceForm);
    }
  };

  const [invoices, setInvoices] = useState();
  const [filteredInvoices, setFilteredInvoices] = useState();
  const [fetchDataFlag, setFetchDataFlag] = useState(true); // Flag to control data fetching

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      if (response.status === 200) {
        const companyData = response.data;
        const matchingCompany = companyData.find(
          (company) => company.name === entity.name
        );
        if (matchingCompany) {
          setInvoices(matchingCompany.invoices);
        }
      } else {
        console.error("Error fetching company data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching company data:", error.message);
    }
  };
  useEffect(() => {
    if (fetchDataFlag) {
      fetchData();
      setFetchDataFlag(false);
    }
  }, [fetchDataFlag]);

  const hideAddInvoiceForm = () => {
    setShowNewInvoiceForm(false);
    fetchData();
  };
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    biller: "",
    minAmount: "",
    maxAmount: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    setFilteredInvoices(
      invoices
        ? invoices.filter((invoice) => {
            return (
              // Add your filtering logic here
              // For example:
              // invoice.biller.toLowerCase().includes(filter.biller.toLowerCase()) &&
              (filter.minAmount === "" ||
                invoice.invoiceAmount >= filter.minAmount) &&
              (filter.maxAmount === "" ||
                invoice.invoiceAmount <= filter.maxAmount) &&
              (filter.date === "" || invoice.invoiceRaisedDate === filter.date)
            );
          })
        : []
    );
  }, [invoices, filter]);

  const resetFilter = () => {
    setFilter({
      biller: "",
      minAmount: "",
      maxAmount: "",
      date: "",
    });
  };
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  const closeFilter = () => {
    setShowFilters(false);
  };
  const handleResumeWork = () => {
    setShowCompanyOverlay(true);
  };
  return (
    <div className={`Invoices ${showSidebar ? "" : "Invoices-expanded"}`}>
      <section className="Invoices__header">
        <div className="Invoices__header__container">
          <div className="Invoices__header__detail-container">
            Invoices -{" "}
            <img
              className="CompanyDetails__header__container__icon"
              src={entity.icon}
              alt={entity.name}
            />
            {entity && <span> {entity.name}</span>}
          </div>
          <div className="Invoices__header__btn-container">
            {showResumeWorkButton && (
              <button
                className="Invoices__header__container__resume-work-btn"
                onClick={handleResumeWork}
              >
                Resume Work
              </button>
            )}
            <button
              className="Invoices__header__container__filter-btn"
              onClick={() => setShowFilters(true)}
            >
              <LuFilter
                size={20}
                className="Invoices__header__container__filter-btn__icon"
              />
              Filter
            </button>
            <button
              className="Invoices__header__container__invoice-btn"
              onClick={newInvoiceClick}
            >
              New Invoice
            </button>
          </div>
        </div>
      </section>
      <section className="Invoices__main">
        <div className="Invoices__main__options"></div>
        {filteredInvoices && filteredInvoices.length > 0 ? (
          <InvoicesTable
            filteredInvoices={filteredInvoices}
            entity={entity}
            setShowNewInvoiceForm={setShowNewInvoiceForm}
            setSelectedInvoice={setSelectedInvoice}
            setFilteredInvoices={setFilteredInvoices}
            setFetchDataFlag={setFetchDataFlag}
setAddeditstate={setAddeditstate}
          />
        ) : (
          <div className="Invoices__main__no-invoice">No invoice exists</div>
        )}
        {/* <div className="Invoices__main__list">
          <ol>
            {filteredInvoices.map((invoice, index) => (
              <li key={index}>
                <strong>Biller:</strong>
                <span> {invoice.biller}</span> |<strong> Amount:</strong>{" "}
                <span>{invoice.amount}</span> |<strong> Date:</strong>{" "}
                <span>{invoice.date}</span>
              </li>
            ))}
          </ol>
        </div> */}
      </section>
      {showCompanyOverlay && (
        <AddCompanyOverlay
          hideAddCompanyForm={hideAddCompanyForm}
          companyId={entity._id}
          prefilledName={entity.name}
          prefilledLocation={entity.location}
        />
      )}
      {showNewInvoiceForm && (
        <NewInvoiceOverlay
          hideNewInvoiceForm={hideAddInvoiceForm}
          entity={entity}
          selectedInvoice={selectedInvoice}
          addeditstate={addeditstate}
        />
      )}
      {showFilters && (
        <div
          className="Invoices__main__options__filter-overlay"
          onClick={closeFilter}
        >
          <div
            className="Invoices__main__options__filter-container"
            onClick={handleContainerClick}
          >
            <div className="Invoices__main__options__filter-container__cancel-btn-container">
              <RxCross1
                className="Invoices__main__options__filter-container__cancel-btn-container__btn"
                size={30}
                onClick={closeFilter}
              />
            </div>
            {/* <input
              type="text"
              name="biller"
              placeholder="Enter biller name"
              value={filter.biller}
              onChange={handleFilterChange}
              className="fieldset"
            /> */}
            <input
              type="number"
              name="minAmount"
              placeholder="Min amount"
              value={filter.minAmount}
              onChange={handleFilterChange}
              className="fieldset"
            />
            <input
              type="number"
              name="maxAmount"
              placeholder="Max amount"
              value={filter.maxAmount}
              onChange={handleFilterChange}
              className="fieldset"
            />
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={filter.date}
              onChange={handleFilterChange}
              className="Invoices__main__options__filter-container__last-input"
            />
            <div className="Invoices__main__options__filter-container__btn-container">
              <button onClick={closeFilter}>Filter</button>
              <button onClick={resetFilter}>Reset filter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
