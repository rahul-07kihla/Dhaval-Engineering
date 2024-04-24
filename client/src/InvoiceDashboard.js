import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import HeaderSearchBar from "./components/HeaderSearchBar";
import InvoicesTable from "./components/InvoicesTable";

const InvoiceDashboard = ({ showSidebar }) => {
  const [companyData, setCompanyData] = useState(null);
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const fetchCompanyData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/companies");
      console.log(response.data);
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
    fetchCompanyData();
  }, []);

  if (companyData === null) {
    return <div>Loading...</div>;
  }

  let totalAmount = 0;
  let amountReceived = 0;
  let amountDue = 0;
  let loss = 0;

  const companyLabels = [];
  const dueAmountsArr = [];

  companyData.forEach((company) => {
    let totalAmountSpecific = 0;
    let amountReceivedSpecific = 0;
    company.invoices.forEach((invoice) => {
      if (
        invoice.invoiceAmount !== null &&
        invoice.invoiceAmount !== "" &&
        (invoice.amountReceived === null ||
          invoice.amountReceived === "" ||
          parseInt(invoice.amountReceived) === 0)
      ) {
        totalAmount += parseInt(invoice.invoiceAmount);
        totalAmountSpecific += parseInt(invoice.invoiceAmount);
      }
      if (
        invoice.amountReceived == null &&
        invoice.amountReceived == "" &&
        parseInt(invoice.amountReceived) == 0
      ) {
        console.log("entering in amount received: ", invoice.amountReceived);
        amountReceived += parseInt(invoice.amountReceived);
        amountReceivedSpecific += parseInt(invoice.amountReceived);
      }
      if (
        invoice.loss !== null &&
        invoice.loss !== undefined &&
        invoice.loss !== 0
      ) {
        loss += invoice.loss;
      }
    });
    const amountDueSpecific = totalAmountSpecific - amountReceivedSpecific;
    companyLabels.push(company.name);
    dueAmountsArr.push(amountDueSpecific);
  });

  amountDue = totalAmount - amountReceived;

  const barChartData = {
    labels: companyLabels,
    datasets: [
      {
        label: "Due Amount",
        backgroundColor: "rgb(34, 83, 189)",
        borderColor: "rgb(34, 83, 189)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(34, 83, 189, 0.8)",
        hoverBorderColor: "rgba(34, 83, 189, 1)",
        data: dueAmountsArr,
      },
    ],
  };
  const barChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  const allInvoices = companyData.reduce(
    (invoices, company) => [
      ...invoices,
      ...company.invoices.map((invoice) => ({
        ...invoice,
        companyName: company.name, // Add company name to each invoice
      })),
    ],
    []
  );

  return (
    <div
      className={`invoices-dashboard ${
        showSidebar ? "" : "invoices-dashboard-expanded"
      }`}
    >
      <HeaderSearchBar />
      <div className="invoices-dashboard__greeting">
        <h2>Invoice Stats</h2>
      </div>
      <div className="invoices-dashboard__statsnchart">
        <div className="invoices-dashboard__two-field-stats">
          <div className="invoices-dashboard__two-field-stats__box">
            <span>Due Amount</span>
            <span>{amountDue}</span>
          </div>
          <div className="invoices-dashboard__two-field-stats__box">
            <span>Loss</span>
            <span>{loss}</span>
          </div>
        </div>

        {/* <div className="invoices-dashboard__charts__box">
          <span>Due amount of companies</span>
          <Bar
            className="bar-graph"
            data={barChartData}
            options={barChartOptions}
          />
        </div> */}
      </div>

      <table className="invoices-dashboard__table">
        <thead>
          <tr>
            <th className="invoices-dashboard__table__bill-no invoices-dashboard__table__heading">
              Bill no.
            </th>
            <th className="invoices-dashboard__table__company-name invoices-dashboard__table__heading">
              Company name
            </th>
            <th className="invoices-dashboard__table__bill-total invoices-dashboard__table__heading">
              Final bill with GST
            </th>
            <th className="invoices-dashboard__table__submitted invoices-dashboard__table__heading">
              Submitted on date
            </th>
            <th className="invoices-dashboard__table__ses-no invoices-dashboard__table__heading">
              SES number
            </th>
            <th className="invoices-dashboard__table__expected invoices-dashboard__table__heading">
              Expected date
            </th>
            <th className="invoices-dashboard__table__approval invoices-dashboard__table__heading">
              Client approval Date
            </th>
            <th className="invoices-dashboard__table__recieved invoices-dashboard__table__heading">
              Received amount
            </th>
            <th className="invoices-dashboard__table__recieved-date invoices-dashboard__table__heading">
              Amount received date
            </th>

            <th className="invoices-dashboard__table__status invoices-dashboard__table__heading">
              Invoice Status
            </th>
          </tr>
        </thead>
        <tbody>
          {allInvoices &&
            allInvoices.map((item, index) => (
              <tr
                key={index}
                className={` invoices-dashboard__table__records `}
              >
                <td
                  className={`invoices-dashboard__table__records__bill-no
                  ${
                    index === allInvoices.length - 1
                      ? "invoices-dashboard__table__records__last-record__bill-no"
                      : ""
                  }
                `}
                >
                  {item.billNo}
                </td>
                <td>{item.companyName}</td>
                <td>{item.billTotal}</td>
                <td>{formatDate(item.submittedToDate)}</td>
                <td>{item.sesNo}</td>
                <td>{formatDate(item.expectedPaymentDate)}</td>
                <td>{formatDate(item.approvedOnDate)}</td>
                <td>
                  {item.amountReceived === "" || item.amountReceived === null
                    ? "0"
                    : item.amountReceived}
                </td>
                <td>
                  {item.amtReceivedDate === "" || item.amtReceivedDate === null
                    ? "-"
                    : formatDate(item.amtReceivedDate)}
                </td>
                <td
                  className={`invoices-dashboard__table__records__status
                  ${
                    index === allInvoices.length - 1
                      ? "invoices-dashboard__table__records__last-record__status"
                      : ""
                  }
                `}
                >
                  {item.invoiceStatus}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceDashboard;
