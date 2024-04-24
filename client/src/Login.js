import { FaAddressCard, FaKey, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async () => {
    const requestBody = {
      userName,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        requestBody
      );

      console.log(response.data);
      if (response.status === 200) {
        sessionStorage.setItem("userName", userName);
        navigate("/");
      } else if (response.status === 202) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }

    // setUserName("");
    // setPassword("");
  };
  return (
    <div className="Login">
      <div className="Login__overlay">
        <div className="hero-image">
          <img src="/factory.jpg" alt="login graphics" />
        </div>
        <div className="Login__form-side">
          <section>
            <div className="Login__form-side__header">
              <img
                src="/dhaval-logo.jpg"
                className="Login__form-side__header__logo"
              />
            </div>

            <h1>Login</h1>
          </section>

          <section className="Login__botom-section">
            <div className="fieldset">
              <FaAddressCard size={20} />
              <input
                type="text"
                placeholder="Username"
                className="field-input"
                onChange={handleUsernameChange}
              />
            </div>
            <div className="fieldset Login__last-fieldset" id="last-fieldset">
              <FaKey size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="field-input"
                onChange={handlePasswordChange}
              />
              <button
                className="password-toggle-btn"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
              Login
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
