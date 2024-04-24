import React from "react";

const CompaniesTable = ({ companyData, setEntity, setComponent }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <table className="companies__table">
      <thead>
        <tr>
          <th className="companies__table__name companies__table__heading">
            Name
          </th>
          <th className="companies__table__wo-no companies__table__heading">
            WO No
          </th>
          <th className="companies__table__wo-value companies__table__heading">
            WO Value
          </th>
          <th className="companies__table__start-date companies__table__heading">
            Start Date
          </th>
          <th className="companies__table__end-date companies__table__heading">
            End Date
          </th>
          <th className="companies__table__ext-date companies__table__heading">
            Extended Date
          </th>
          <th className="companies__table__loc companies__table__heading">
            Location
          </th>
          <th className="companies__table__rcm companies__table__heading">
            RCM
          </th>
          <th className="companies__table__rcm-email companies__table__heading">
            RCM email
          </th>
        </tr>
      </thead>
      <tbody>
        {companyData.map((item, index) => (
          <tr key={index} className={`companies__table__records`}>
            <td
              className={`companies__table__records__name
                ${
                  index === companyData.length - 1
                    ? "companies__table__records__last-record__name"
                    : ""
                }
              `}
              onClick={() => {
                setEntity(item);
                setComponent("companyDetails");
              }}
            >
              <span>{item.name}</span>
            </td>
            <td>{item.woNo}</td>
            <td>{item.woValue}</td>
            <td>{formatDate(item.startDate)}</td>
            <td>{formatDate(item.endDate)}</td>
            <td>
              {item.extendedDate === null ? "-" : formatDate(item.extendedDate)}
            </td>
            <td>{item.location}</td>
            <td>{item.RCM}</td>
            <td
              className={
                index === companyData.length - 1
                  ? "companies__table__records__last-record__rcm-email"
                  : ""
              }
            >
              {item.RCMemail}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CompaniesTable;
