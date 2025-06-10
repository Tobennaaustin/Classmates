import { useEffect, useState } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
} from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const AuthAction = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState("");

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus("invalid");
      return;
    }

    const handleMode = async () => {
      try {
        if (mode === "verifyEmail") {
          await applyActionCode(auth, oobCode);
          setStatus("verified");
        } else if (mode === "resetPassword") {
          await verifyPasswordResetCode(auth, oobCode);
          setStatus("reset");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        setStatus("invalid");
        setMessage(err.message);
      }
    };

    handleMode();
  }, [mode, oobCode]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("✅ Password reset successful. You can now log in.");
      setStatus("complete");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 py-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {status === "loading" && <p>Checking link...</p>}

          {status === "verified" && (
            <>
              <h2 className="text-xl font-semibold mb-4">✅ Email Verified</h2>
              <p className="mb-4">
                Your email address has been successfully verified.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </>
          )}

          {status === "reset" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Reset Your Password
              </h2>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      focusedField === "password"
                        ? "ring-2 ring-blue-500 border-transparent"
                        : ""
                    }`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  Reset Password
                </button>
              </form>
              {message && <p className="text-sm text-center mt-2">{message}</p>}
            </>
          )}

          {status === "complete" && (
            <>
              <h2 className="text-xl font-semibold mb-4">✅ Password Reset</h2>
              <p className="mb-4">You can now log in with your new password.</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </>
          )}

          {status === "invalid" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Invalid Link
              </h2>
              <p className="mb-4">
                {message || "This link is expired or invalid."}
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthAction;
