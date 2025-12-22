import Input from "../input/Input";
import Button from "../button/Button";
import "./verifyMailComponent.css";

const VerifyMailComponent = ({
  onChangeOtp,
  onSubmitOtp,
  goToPrevPage,
  loading,
}) => {
  return (
    <div className="verify-mail-container">
      <Button text="Back" onClick={goToPrevPage} className="verify-back-btn" />

      <div className="verify-card">
        <h1 className="verify-heading">Verify Your Email</h1>
        <p className="verify-subtext">
          Enter the verification code sent to your email
        </p>

        <form onSubmit={onSubmitOtp} className="verify-form">
          <Input
            type="number"
            placeholder="Enter OTP"
            onChange={onChangeOtp}
            className="verify-input"
          />
          <Button
            className="verify-submit-btn"
            disabled={loading}
            text={loading ? "Verifying..." : "Verify"}
          />
        </form>
      </div>
    </div>
  );
};

export default VerifyMailComponent;
