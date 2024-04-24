import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { SlArrowLeft } from "react-icons/sl";
import { IoIosLogOut } from "react-icons/io";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

import Companies from "./Companies";
import CompanyDetails from "./CompanyDetails";
import Dashboard from "./Dashboard";
import Invoices from "./Invoices";
import Employees from "./Employees";
import InvoiceDashboard from "./InvoiceDashboard";
import Reports from "./Reports";

function App() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 930);
  const [component, setComponent] = useState("companies");
  const [entity, setEntity] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = sessionStorage.getItem("userName");
  if (!userName) {
    navigate("/login");
  }
  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      setComponent(location.state);
    }
    console.log(location.state);
  }, [location.state]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const clickCompanies = () => {
    setComponent("companies");
  };
  const clickDashboard = () => {
    setComponent("dashboard");
  };
  const clickEmployees = () => {
    setComponent("employees");
  };
  const clickInvoicesDashboard = () => {
    setComponent("invoicesDashboard");
  };
  const clickReports = () => {
    setComponent("reports");
  };
  const clickSettings = () => {
    navigate("/user/editprofile");
  };
  const clickLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <div className="main-page">
      <section className={`side-bar ${showSidebar ? "" : "sidebar-closed"}`}>
        <div
          className={`side-bar__header ${
            showSidebar ? "" : "side-bar__header__closed"
          }`}
        >
          {/* <LuWebhook className="side-bar__header__icon" size={34} /> */}
          {/* <h1>
            <span id="we">We</span>Flow
          </h1> */}
          <img
            src="/dhaval-logo.jpg"
            alt="company logo"
            className="side-bar__header__icon"
          />
          <button
            className="side-bar__header__close-btn"
            onClick={toggleSidebar}
          >
            <SlArrowLeft
              className={`side-bar__header__close-btn__icon1 arrow-icon ${
                showSidebar ? "" : "rotate-icon"
              }`}
              size={20}
            />
            <SlArrowLeft
              className={`side-bar__header__close-btn__icon2 arrow-icon ${
                showSidebar ? "" : "rotate-icon"
              }`}
              size={20}
            />
          </button>
        </div>
        <div
          className={`side-bar__menu ${
            showSidebar ? "" : "side-bar__menu__closed"
          }`}
        >
          <h3 id="menus">Menus</h3>
          <button
            className={`side-bar__menu__button ${
              component === "dashboard" ? "showDashboard" : ""
            }`}
            onClick={clickDashboard}
          >
            <MdOutlineDashboard
              className="side-bar__menu__button__icon"
              size={26}
            />
            Dashboard
          </button>
          <button
            className={`side-bar__menu__button ${
              component === "companies" ? "showCompanies" : ""
            }`}
            onClick={clickCompanies}
          >
            <AiOutlineProject
              className="side-bar__menu__button__icon"
              size={26}
            />
            Companies
          </button>
          <button
            className={`side-bar__menu__button ${
              component === "employees" ? "showEmployees" : ""
            }`}
            onClick={clickEmployees}
          >
            <BsPeople className="side-bar__menu__button__icon" size={26} />
            Employees
          </button>
          <button
            className={`side-bar__menu__button ${
              component === "invoicesDashboard" ? "showInvoicesDashboard" : ""
            }`}
            onClick={clickInvoicesDashboard}
          >
            <LiaFileInvoiceDollarSolid
              className="side-bar__menu__button__icon"
              size={30}
              // style={{ marginLeft: "-2px" }}
            />
            Invoices
          </button>
          <button
            className={`side-bar__menu__button ${
              component === "reports" ? "showReports" : ""
            }`}
            onClick={clickReports}
          >
            <HiOutlineDocumentChartBar
              className="side-bar__menu__button__icon"
              size={28}
            />
            Reports
          </button>
          <button className="side-bar__menu__button" onClick={clickSettings}>
            <IoSettingsOutline
              className="side-bar__menu__button__icon"
              size={26}
            />
            Settings
          </button>
        </div>
        <div
          className={`side-bar__logout ${
            showSidebar ? "" : "side-bar__logout__closed"
          }`}
          onClick={clickLogout}
        >
          <IoIosLogOut size={25} />
          <span className="side-bar__logout__text">Log out</span>
        </div>
      </section>
      {component === "dashboard" ? (
        <Dashboard showSidebar={showSidebar} />
      ) : (
        <></>
      )}
      {component === "companies" ? (
        <Companies
          showSidebar={showSidebar}
          setComponent={setComponent}
          setEntity={setEntity}
        />
      ) : (
        <></>
      )}
      {component === "employees" ? (
        <Employees showSidebar={showSidebar} />
      ) : (
        <></>
      )}
      {component === "companyDetails" ? (
        <CompanyDetails
          showSidebar={showSidebar}
          entity={entity}
          setComponent={setComponent}
        />
      ) : (
        <></>
      )}
      {component === "invoices" ? (
        <Invoices
          showSidebar={showSidebar}
          entity={entity}
          setComponent={setComponent}
        />
      ) : (
        <></>
      )}
      {component === "invoicesDashboard" ? (
        <InvoiceDashboard showSidebar={showSidebar} />
      ) : (
        <></>
      )}
      {component === "reports" ? <Reports showSidebar={showSidebar} /> : <></>}
    </div>
  );
}

export default App;
