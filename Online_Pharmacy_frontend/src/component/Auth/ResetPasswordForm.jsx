import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../State/Authentication/Action";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, resetStatus } = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  
    // Real-time password match check
    if (
      (name === "newPassword" || name === "confirmPassword") &&
      formData.confirmPassword &&
      formData.newPassword &&
      (name === "confirmPassword" ? value !== formData.newPassword : value !== formData.confirmPassword)
    ) {
      setLocalError("Passwords should match.");
    } else {
      setLocalError(null);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setLocalError("Missing or invalid token.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const result = await dispatch(
      resetPassword({ token, newPassword: formData.newPassword }, navigate)
    );

    if (result.success) {
      setFormData({ newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center">Reset Your Password</h2>
      {localError && (
        <div className="text-red-500 text-sm mb-3">{localError}</div>
      )}
      {error && (
        <div className="text-red-500 text-sm mb-3">
          {typeof error === "string" ? error : error.message || "Something went wrong"}
        </div>
      )}
      {resetStatus && (
        <div className="text-green-600 text-sm mb-3">{resetStatus}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
            placeholder="Enter new password"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
            placeholder="Confirm new password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
