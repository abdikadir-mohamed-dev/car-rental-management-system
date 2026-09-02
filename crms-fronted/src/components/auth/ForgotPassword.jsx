import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset link",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {sent ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Check your email
          </h3>
          <p className="text-slate-600 mb-4">
            We sent a password reset link to {email}
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
