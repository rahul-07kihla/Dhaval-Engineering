import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const CompanyDetails = ({ showSidebar, entity, setComponent }) => {
  const goToInvoices = () => {
    setComponent("invoices");
  };

  return (
    <div
      className={`CompanyDetails ${
        showSidebar ? "" : "CompanyDetails-expanded"
      }`}
    >
      <section className="CompanyDetails__header">
        <div className="CompanyDetails__header__container">
          {entity && entity.icon && (
            <img
              className="CompanyDetails__header__container__icon"
              src={entity.icon}
              alt={entity.name}
            />
          )}
          {entity && <span>{entity.name}</span>}
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
            <p className="CompanyDetails__info__record__value">{entity.woNo}</p>
          </div>

          <div className="CompanyDetails__info__record__field">
            Work Order Value
            <p className="CompanyDetails__info__record__value">
              {entity.woValue}
            </p>
          </div>
        </div>

        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            Start Date
            <p className="CompanyDetails__info__record__value">
              {formatDate(entity.startDate)}
            </p>
          </div>
          <div className="CompanyDetails__info__record__field">
            End Date
            <p className="CompanyDetails__info__record__value">
              {formatDate(entity.endDate)}
            </p>
          </div>
          <div className="CompanyDetails__info__record__field">
            Extended Date
            <p className="CompanyDetails__info__record__value">
              {entity.extendedDate === null
                ? "-"
                : formatDate(entity.extendedDate)}
            </p>
          </div>
        </div>
        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            Location
            <p className="CompanyDetails__info__record__value">
              {entity.location}
            </p>
          </div>
        </div>
        <div className="CompanyDetails__info__record">
          <div className="CompanyDetails__info__record__field">
            RCM
            <p className="CompanyDetails__info__record__value">{entity.RCM}</p>
          </div>
          <div className="CompanyDetails__info__record__field">
            RCM email id
            <p className="CompanyDetails__info__record__value">
              {entity.RCMemail}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyDetails;
