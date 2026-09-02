import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {!token ? (
        <p className="text-center text-red-500">
          Invalid or missing reset link
        </p>
      ) : success ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Password Reset
          </h3>
          <p className="text-slate-600 mb-4">
            Your password has been reset successfully.
          </p>
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline font-medium">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${errors.password ? "border-red-500" : ""}`}
              placeholder="Min. 6 characters"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input ${errors.confirmPassword ? "border-red-500" : ""}`}
              placeholder="Repeat password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <p className="text-center text-sm text-slate-600">
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordPage;
