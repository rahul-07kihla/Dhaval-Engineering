import { LuWebhook } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { SlArrowLeft } from "react-icons/sl";
import { IoIosLogOut } from "react-icons/io";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SideBar({
  showSideBar,
  setShowSideBar,
  sideBarBlue,
  showAddCompanyForm,
}) {
  const [component, setComponent] = useState("");
  const [entity, setEntity] = useState();
  const navigate = useNavigate();
  console.log(showAddCompanyForm);
  const toggleSidebar = () => {
    setShowSideBar(!showSideBar);
  };
  const clickCompanies = () => {
    setComponent("companies");

    navigate("/", { state: "companies" });
  };
  const clickDashboard = () => {
    setComponent("dashboard");
    navigate("/", { state: "dashboard" });
  };
  const clickEmployees = () => {
    setComponent("employees");
    navigate("/", { state: "employees" });
  };
  const clickInvoicesDashboard = () => {
    setComponent("invoicesDashboard");
    navigate("/", { state: "invoicesDashboard" });
  };
  const clickSettings = () => {
    navigate("/user/editprofile");
  };
  const clickLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <section
      className={`side-bar ${showSideBar ? "" : "sidebar-closed"} ${
        sideBarBlue ? "sidebar-blue" : ""
      } ${!showSideBar && sideBarBlue ? "sidebar-wide" : ""}`}
    >
      <div
        className={`side-bar__header ${
          showSideBar ? "" : "side-bar__header__closed"
        }`}
      >
        <img src="/dhaval-logo.jpg" className="side-bar__header__icon" />
        <button
          className={`side-bar__header__close-btn ${
            showAddCompanyForm ? "side-bar__header__close-btn-hidden" : ""
          }`}
          onClick={toggleSidebar}
        >
          <SlArrowLeft
            className={`side-bar__header__close-btn__icon1 arrow-icon ${
              showSideBar ? "" : "rotate-icon"
            }`}
            size={20}
          />
          <SlArrowLeft
            className={`side-bar__header__close-btn__icon2 arrow-icon ${
              showSideBar ? "" : "rotate-icon"
            }`}
            size={20}
          />
        </button>
      </div>
      <div
        className={`side-bar__menu ${
          showSideBar ? "" : "side-bar__menu__closed"
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
        <button className="side-bar__menu__button" onClick={clickEmployees}>
          <BsPeople className="side-bar__menu__button__icon" size={26} />
          Employees
        </button>
        <button
          className="side-bar__menu__button"
          onClick={clickInvoicesDashboard}
        >
          <LiaFileInvoiceDollarSolid
            className="side-bar__menu__button__icon"
            size={30}
            style={{ marginLeft: "-2px" }}
          />
          Invoices
        </button>
        <button className="side-bar__menu__button">
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
          showSideBar ? "" : "side-bar__logout__closed"
        }`}
        onClick={clickLogout}
      >
        <IoIosLogOut size={25} />
        <span className="side-bar__logout__text">Log out</span>
      </div>
    </section>
  );
}

export default SideBar;
