import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import CompanyDetails from "./CompanyDetails";
import Invoices from "./Invoices";
import EditProfile from "./EditProfile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/company-details" element={<CompanyDetails />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/user">
        <Route path="/user/editprofile" element={<EditProfile />} />
        <Route path="/user/resetpassword" element={<ResetPassword />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
