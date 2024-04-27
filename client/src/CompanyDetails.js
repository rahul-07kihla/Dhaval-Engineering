import React, { useState, useEffect } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import axios from "axios";
import AddCompanyOverlay from "./components/AddCompanyOverlay";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const CompanyDetails = ({ showSidebar, entity, setComponent }) => {
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [companydata, setCompanyData] = useState({
    name: entity.name,
    woNo: entity.woNo,
    woValue: entity.woValue,
    startDate: entity.startDate,
    endDate: entity.endDate,
    extendedDate: entity.extendedDate,
    location: entity.location,
    RCM: entity.RCM,
    RCMemail: entity.RCMemail,
    icon: entity.icon
  });
  const goToInvoices = () => {
    setComponent("invoices");
  };

  const addCompanyClick = () => {
    setShowAddCompanyForm(true);
  };
  const hideAddCompanyForm = () => {
    setShowAddCompanyForm(false);
    fetchData()
  };

  useEffect(() => {
    fetchData()
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:4000/companies/"+entity._id);
      setCompanyData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className={`CompanyDetails ${
        showSidebar ? "" : "CompanyDetails-expanded"
      }`}
    >
      <section className="CompanyDetails__header">
        <div className="CompanyDetails__header__container">
          {companydata && companydata.icon && (
            <img
              className="CompanyDetails__header__container__icon"
              src={companydata.icon}
              alt={companydata.name}
            />
          )}
          {companydata && <span>{companydata.name}</span>}
          <BsFillPencilFill style={{ float: 'right' }} onClick={addCompanyClick}/>
          <button
            className="CompanyDetails__header__container__invoice-btn"
            onClick={goToInvoices}
          >
            Show Invoices
          </button>
        </div>
      </section>
      <section className="CompanyDetails__info">
        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            Work Order No
            <p className="CompanyDetails__info__record__value">{companydata.woNo}</p>
          </div>

          <div className="CompanyDetails__info__record__field">
            Work Order Value
            <p className="CompanyDetails__info__record__value">
              {companydata.woValue}
            </p>
          </div>
        </div>

        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            Start Date
            <p className="CompanyDetails__info__record__value">
              {formatDate(companydata.startDate)}
            </p>
          </div>
          <div className="CompanyDetails__info__record__field">
            End Date
            <p className="CompanyDetails__info__record__value">
              {formatDate(companydata.endDate)}
            </p>
          </div>
          <div className="CompanyDetails__info__record__field">
            Extended Date
            <p className="CompanyDetails__info__record__value">
              {companydata.extendedDate === null
                ? "-"
                : formatDate(companydata.extendedDate)}
            </p>
          </div>
        </div>
        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            Location
            <p className="CompanyDetails__info__record__value">
              {companydata.location}
            </p>
          </div>
        </div>
        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            RCM
            <p className="CompanyDetails__info__record__value">{companydata.RCM}</p>
          </div>
          <div className="CompanyDetails__info__record__field">
            RCM email id
            <p className="CompanyDetails__info__record__value">
              {companydata.RCMemail}
            </p>
          </div>
        </div>
      </section>
      {showAddCompanyForm && (
        <AddCompanyOverlay Data={companydata} prefilledName={true} hideAddCompanyForm={hideAddCompanyForm} />
      )}
    </div>
  );
};

export default CompanyDetails;
