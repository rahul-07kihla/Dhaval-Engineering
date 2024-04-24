import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import HeaderSearchBar from "./components/HeaderSearchBar";
import axios from "axios";

const Dashboard = ({ showSidebar }) => {
  const [adminData, setAdminData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName");
  if (!userName) {
    navigate("/login");
  }
  const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/admin");
      console.log(response.data);
      if (response.status === 200) {
        setAdminData(response.data);
      } else {
        console.error("Error fetching admin data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error.message);
    }
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
    fetchAdminData();
    fetchCompanyData();
  }, []);
  let totalInvoices = 0;
  let totalAmount = 0;
  let amountReceived = 0;
  let amountReceivedToCalcDue = 0;
  let totalCompanies = 0;
  let amountDue = 0;
  let totalAmountToCalcDue = 0;
  if (adminData === null || companyData === null) {
    return <div>Loading...</div>;
  } else {
    totalCompanies = companyData.length;

    companyData.forEach((company) => {
      totalInvoices += company.invoices.length;

      company.invoices.forEach((invoice) => {
        if (invoice.invoiceAmount !== null && invoice.invoiceAmount !== "") {
          totalAmount += parseInt(invoice.invoiceAmount);
        }
        if (
          invoice.invoiceAmount !== null &&
          invoice.invoiceAmount !== "" &&
          (invoice.amountReceived === null ||
            invoice.amountReceived === "" ||
            parseInt(invoice.amountReceived) === 0)
        ) {
          totalAmountToCalcDue += parseInt(invoice.invoiceAmount);
        }
        if (invoice.amountReceived !== null && invoice.amountReceived !== "") {
          amountReceived += parseInt(invoice.amountReceived);
        }
        if (
          invoice.amountReceived === null &&
          invoice.amountReceived === "" &&
          parseInt(invoice.amountReceived) === 0
        ) {
          amountReceivedToCalcDue += parseInt(invoice.amountReceived);
        }
      });
    });

    amountDue = totalAmountToCalcDue - amountReceivedToCalcDue;
  }
  //Data for table
  // const data = [
  //   {
  //     id: "001",
  //     date: "25-05-2023",
  //     name: "John",
  //     department: "Marketing",
  //     projectAssigned: "Project A",
  //     estimatedTime: "1 month",
  //     progress: "In progress",
  //   },
  //   {
  //     id: "002",
  //     date: "25-05-2023",
  //     name: "Johnny",
  //     department: "Sales",
  //     projectAssigned: "Project E",
  //     estimatedTime: "2 weeks",
  //     progress: "Not started",
  //   },
  //   {
  //     id: "004",
  //     date: "25-05-2023",
  //     name: "Janardan",
  //     department: "HR",
  //     projectAssigned: "Project B",
  //     estimatedTime: "3 weeks",
  //     progress: "Completed",
  //   },
  // ];

  const doughnutChartData = {
    labels: ["Full time", "Part Time", "Contract", "Intern"],
    datasets: [
      {
        data: [250, 100, 75, 100],
        backgroundColor: [
          "rgb(34, 83, 189)",
          "#FFCE56",
          "rgb(214, 81, 63)",
          "rgb(82, 164, 201)",
        ],
      },
    ],
  };

  const barChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        label: "Total Employees",
        backgroundColor: "rgb(34, 83, 189)",
        borderColor: "rgb(34, 83, 189)",
        borderWidth: 1,
        barThickness: 30,
        data: [8, 14, 20, 27, 25, 40, 55, 24, 36, 30],
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

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const customLegendItems = doughnutChartData.labels.map((label, index) => (
    <div key={index} className="custom-legend-item">
      <div
        className="legend-dot"
        style={{
          backgroundColor: doughnutChartData.datasets[0].backgroundColor[index],
        }}
      ></div>
      <span>{label}</span>
    </div>
  ));

  return (
    <div className={`dashboard ${showSidebar ? "" : "dashboard-expanded"}`}>
      <HeaderSearchBar />
      <div className="dashboard__greeting">
        <h2>Welcome {adminData[0].name.split(" ")[0]} 👋</h2>
      </div>

      <div className="dashboard__five-field-stats">
        <div className="dashboard__five-field-stats__box">
          <span>Total Companies</span>
          <span>{totalCompanies}</span>
        </div>
        <div className="dashboard__five-field-stats__box">
          <span>Total Invoices</span>
          <span>{totalInvoices}</span>
        </div>
        <div className="dashboard__five-field-stats__box">
          <span>Total Amount</span>
          <span>{totalAmount}</span>
        </div>
        <div className="dashboard__five-field-stats__box">
          <span>Amount received</span>
          <span>{amountReceived}</span>
        </div>
        <div className="dashboard__five-field-stats__box">
          <span>Amount Due</span>
          <span>{amountDue}</span>
        </div>
      </div>
      <div className="dashboard__charts">
        <div className="dashboard__charts__box">
          <span>Employees by status</span>
          <div className="donut">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            <div className="custom-legend">{customLegendItems}</div>
          </div>
        </div>
        <div className="dashboard__charts__box">
          <span>Employee Count by ratings</span>
          <Bar
            className="bar-graph"
            data={barChartData}
            options={barChartOptions}
          />
        </div>
      </div>

      {/* <table className="dashboard__table">
        <thead>
          <tr>
            <th className="dashboard__table__id dashboard__table__heading">
              Id
            </th>
            <th className="dashboard__table__date dashboard__table__heading">
              Date
            </th>
            <th className="dashboard__table__name dashboard__table__heading">
              Name
            </th>
            <th className="dashboard__table__department dashboard__table__heading">
              Department
            </th>
            <th className="dashboard__table__project dashboard__table__heading">
              Project assigned
            </th>
            <th className="dashboard__table__time dashboard__table__heading">
              Estimated Time
            </th>
            <th className="dashboard__table__progress dashboard__table__heading">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={` ${
                index === data.length - 1
                  ? "dashboard__table__records__last-record"
                  : "dashboard__table__records"
              }`}
            >
              <td key={item.id} className="dashboard__table__records__id">
                {item.id}
              </td>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.department}</td>
              <td>{item.projectAssigned}</td>
              <td>{item.estimatedTime}</td>
              <td className="dashboard__table__records__progress">
                {item.progress}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Dashboard;
