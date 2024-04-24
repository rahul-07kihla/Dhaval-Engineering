import React, { useState } from "react";
import { FaKey } from "react-icons/fa6";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  let userId;
  if (location && location.state) {
    userId = location.state.userId;
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/admin/reset-password/${userId}`,
        {
          newPassword,
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="ResetPassword">
      <div className="ResetPassword__overlay">
        <div className="ResetPassword__form-side">
          <section>
            <h1>Reset your password</h1>
            <p>Enter a valid password</p>
          </section>
          <section className="ResetPassword__bottom-section">
            <div className="fieldset">
              <FaKey size={12} />
              <input
                type="text"
                placeholder="New Password"
                className="field-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="fieldset Login__last-fieldset">
              <FaKey size={12} />
              <input
                type="text"
                placeholder="Confirm Password"
                className="field-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {message && (
              <p className="ResetPassword__bottom-section__message">
                {message}
              </p>
            )}
            <button className="submit-btn" onClick={handleResetPassword}>
              {" "}
              Reset password{" "}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
