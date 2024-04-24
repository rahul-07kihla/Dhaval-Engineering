import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import HeaderSearchBar from "./components/HeaderSearchBar";

const Reports = ({ showSidebar }) => {
  const [companyData, setCompanyData] = useState(null);
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

  let totalAmount = 0;
  let amountReceived = 0;
  let amountDue = 0;
  let loss = 0;

  const companyLabels = [];
  const dueAmountsArr = [];
  if (companyData === null) {
    return <div>Loading...</div>;
  }
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

  return (
    <div
      className={`invoices-dashboard ${
        showSidebar ? "" : "invoices-dashboard-expanded"
      }`}
    >
      <HeaderSearchBar />
      <div className="invoices-dashboard__greeting">
        <h2>Reports</h2>
      </div>
      <div className="reports__chart-box">
        <span>Due amount of companies</span>
        <Bar
          className="bar-graph"
          data={barChartData}
          options={barChartOptions}
        />
      </div>
    </div>
  );
};

export default Reports;
