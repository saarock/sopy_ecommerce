import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userService from "../../services/userService";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const validate = () => {
    if (!token) return "Reset token missing or invalid link.";
    if (!password || password.length < 8)
      return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const err = validate();
    if (err) return setMsg({ type: "error", text: err });

    try {
      setLoading(true);
      const response = await userService.resetPassword(token, password);
      toast.success(response.message);
      setMsg({
        type: "success",
        text: response?.message || "Password updated successfully!",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMsg({ type: "error", text: error.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 6px 22px rgba(16,24,40,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
          Reset Password
        </h2>
        <p
          style={{
            marginTop: 8,
            marginBottom: 18,
            color: "#667085",
            fontSize: 13,
          }}
        >
          Enter your new password below.
        </p>

        {!token && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#fff5f5",
              border: "1px solid #ffd6d6",
              color: "#b42318",
              fontSize: 13,
            }}
          >
            Token missing. Please open the reset link from your email again.
          </div>
        )}

        {msg.text && (
          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              padding: 12,
              borderRadius: 10,
              fontSize: 13,
              border: "1px solid",
              background: msg.type === "success" ? "#ecfdf3" : "#fff5f5",
              borderColor: msg.type === "success" ? "#abefc6" : "#ffd6d6",
              color: msg.type === "success" ? "#067647" : "#b42318",
            }}
          >
            {msg.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 10, marginTop: 10 }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#344054", fontWeight: 600 }}>
              New Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={!token || loading}
              style={{
                padding: "12px 12px",
                borderRadius: 10,
                border: "1px solid #d0d5dd",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "#344054", fontWeight: 600 }}>
              Confirm Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              disabled={!token || loading}
              style={{
                padding: "12px 12px",
                borderRadius: 10,
                border: "1px solid #d0d5dd",
                outline: "none",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={!token || loading}
            style={{
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 10,
              border: "none",
              background: "#101540",
              color: "white",
              fontWeight: 800,
              cursor: !token || loading ? "not-allowed" : "pointer",
              opacity: !token || loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div style={{ marginTop: 14, fontSize: 12, color: "#667085" }}>
          Tip: After resetting, login again with your new password.
        </div>
      </div>
    </div>
  );
}
