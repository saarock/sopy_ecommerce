import { useState } from "react";
import Input from "../input/Input";
import Button from "../button/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./loginComponent.css";
import ForgotPasswordComponent from "./forgetPassword";

const LoginComponent = ({ onChange, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
<>
{
  showForgetPassword ? 
  <ForgotPasswordComponent setShowForgetPassword={setShowForgetPassword}/>
  : (
        <div className="login-component">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to access your account</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                onChange={onChange}
                required
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <button  onClick={() =>  setShowForgetPassword(true)}>Forgot password?</button>
          </div>

          <Button text={`${loading ? "Logging in..." : "Login"}`} className={`login-btn ${loading && "cursor-progress"}`} disabled={loading} />
        </form>

        <p className="login-terms">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  )
}
</>
  );
};

export default LoginComponent;
