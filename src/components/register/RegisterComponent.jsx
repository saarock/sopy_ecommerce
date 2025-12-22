"use client";
import Button from "../button/Button";
import EntryComponent from "../entryComponent";
import Input from "../input/Input";
import "./registerComponent.css";

const RegisterComponent = ({
  register,
  onChangeFullName,
  onChangeUserName,
  onChangeEmail,
  onChangeConfrimPassword,
  onChangePassword,
  onChangePhoneNumber,
  goToBackPage,
  loading,
}) => {
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-description">
            Join us today and start your journey
          </p>
        </div>

        <form className="register-form" onSubmit={register}>
          <div className="form-row">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required={true}
              onChange={onChangeFullName}
            />
          </div>

          <div className="form-row">
            <Input
              type="text"
              name="userName"
              placeholder="Username"
              required={true}
              onChange={onChangeUserName}
            />
          </div>

          <div className="form-row">
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required={true}
              onChange={onChangeEmail}
            />
          </div>

          <div className="form-row">
            <Input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required={true}
              onChange={onChangePhoneNumber}
            />
          </div>

          <div className="form-row">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required={true}
              onChange={onChangePassword}
            />
          </div>

          <div className="form-row">
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required={true}
              onChange={onChangeConfrimPassword}
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="register-submit-btn"
            text="Create Account"
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
