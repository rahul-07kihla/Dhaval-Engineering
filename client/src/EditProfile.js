import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import axios from "axios";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [location, setLocation] = useState("");
  const [showSideBar, setShowSideBar] = useState(true);
  const userName = sessionStorage.getItem("userName");
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:4000/get-user");
      console.log(response.data);
      const userDetails = response.data[0];
      setName(userDetails.name);
      setEmail(userDetails.email);
      setDesignation(userDetails.designation);
      setContactNo(userDetails.contactNo);
      setAddress(userDetails.address);
      const formattedDOB = new Date(userDetails.dob)
        .toISOString()
        .split("T")[0];
      setDOB(formattedDOB);
      setLocation(userDetails.location);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };
  const saveDetails = async () => {
    const updatedFields = {
      name,
      email,
      contactNo,
      designation,
      address,
      dob,
      location,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/save-user-details",
        { userName, updatedFields }
      );
      console.log(response.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="edit-profile">
      <SideBar
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        sideBarBlue={true}
      />
      <section
        className={`edit-profile__edit-section ${
          showSideBar ? "" : "edit-profile__edit-section-expanded"
        }`}
      >
        <div className="edit-profile__edit-section__header">
          <div className="edit-profile__edit-section__header__container">
            {
              <img
                className="edit-profile__edit-section__header__container__icon"
                src="data:image/png;base64,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"
                alt="admin"
              />
            }
            {name}
          </div>
        </div>
        <div className="edit-profile__edit-section__form-section">
          <div className="edit-profile__edit-section__form-section__row">
            <div className="edit-profile__edit-section__form-section__row__column">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange(e, setName)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
            <div className="edit-profile__edit-section__form-section__row__column">
              <span>Email</span>
              <input
                type="text"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
          </div>
          <div className="edit-profile__edit-section__form-section__row">
            <div className="edit-profile__edit-section__form-section__row__column">
              <span>Contact No</span>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => handleInputChange(e, setContactNo)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
            <div className="edit-profile__edit-section__form-section__row__column">
              <span>Designation</span>
              <input
                type="text"
                value={designation}
                onChange={(e) => handleInputChange(e, setDesignation)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
          </div>
          <div className="edit-profile__edit-section__form-section__row">
            <div className="edit-profile__edit-section__form-section__row__column row3-column">
              <span>Address</span>
              <textarea
                type="text"
                rows={3}
                value={address}
                onChange={(e) => handleInputChange(e, setAddress)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
            <div className="edit-profile__edit-section__form-section__row__column row3-column">
              <span>DOB</span>

              <input
                type="date"
                value={dob}
                onChange={(e) => handleInputChange(e, setDOB)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
          </div>
          <div className="edit-profile__edit-section__form-section__row">
            <div className="edit-profile__edit-section__form-section__row__column">
              <span>Location</span>
              <input
                type="text"
                value={location}
                onChange={(e) => handleInputChange(e, setLocation)}
                className="edit-profile__edit-section__form-section__row__column__field-input"
              />
            </div>
          </div>
          <div className="edit-profile__edit-section__form-section__btn-container">
            <button
              className="edit-profile__edit-section__form-section__btn-container__save-btn"
              onClick={saveDetails}
            >
              Save
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
