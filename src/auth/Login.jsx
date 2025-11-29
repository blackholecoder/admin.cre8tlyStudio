import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twofaCode, setTwofaCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [stage, setStage] = useState("login"); // "login" or "2fa"
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🧭 Stage:", stage);
  }, [stage]);

  // ✅ Handle first login step
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoadingText("Signing in...");

    try {
      const res = await api.post("/auth/admin/login", { email, password });

      if (res.data.twofaRequired) {
        setStage("2fa");
        setTempToken(res.data.twofaToken);
        return;
      }

      // ✅ Save credentials safely
      const user = res.data.admin || res.data.user; // supports both naming
      if (!user) throw new Error("Invalid login response");

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", user.role); // superadmin or admin
      localStorage.setItem("userEmail", user.email);

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      toast.success("Login successful!");

      // ✅ Role-based redirect
      setTimeout(() => {
        navigate("/");
      }, 50);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid login credentials");
      toast.error("Invalid login");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // ✅ Handle 2FA verification
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {

    
      const res = await api.post("/auth/admin/verify-login-2fa", {
        token: twofaCode,
        twofaToken: tempToken,
      });


      if (res.data.accessToken) {
        const user = res.data.user;

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("role", user.role);
        localStorage.setItem("adminId", user.id);

        toast.success("2FA verified successfully!");
        setTimeout(() => navigate("/"), 250);
      } else {
        toast.error("No access token received");
      }
    } catch (err) {
      console.error("2FA verification error:", err);

      // ⭐ RATE LIMIT (HTTP 429)
      if (err.response?.status === 429) {
        const msg =
          err.response?.data?.message || "Too many attempts. Slow down.";
        toast.error(msg);
        setError(msg);
        return;
      }

      // ⭐ LOCKOUT
      if (err.response?.data?.message?.includes("Locked")) {
        const msg = err.response.data.message;
        toast.error(msg);
        setError(msg);
        return;
      }

      // ⭐ WRONG CODE / GENERAL FAILURE
      const msg =
        err.response?.data?.message || err.message || "Invalid 2FA code";

      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 px-6">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <Loader2 className="animate-spin text-teal-400 w-10 h-10 mb-3" />
          <p className="text-gray-200 text-sm tracking-wide">
            {loadingText || "Please wait..."}
          </p>
        </div>
      )}

      <form
        onSubmit={stage === "login" ? handleLogin : handleVerify2FA}
        className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-lg space-y-6 relative"
      >
        <h1 className="text-2xl font-bold text-center text-white lead-text">
          {stage === "login" ? "Portal Login" : "Two-Factor Verification"}
        </h1>

        {error && (
          <div className="bg-red-600/20 text-red-400 text-sm p-2 rounded lead-text">
            {error}
          </div>
        )}

        {stage === "login" ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1 lead-text">
                  Email
                </label>
                <div className="flex items-center bg-gray-800 rounded-md px-3">
                  <Mail size={16} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none text-white w-full py-2 pl-3 lead-text"
                    placeholder="admin@cre8tly.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1 lead-text">
                  Password
                </label>
                <div className="flex items-center bg-gray-800 rounded-md px-3">
                  <Lock size={16} className="text-gray-500 mr-2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none text-white w-full py-2 pl-3 lead-text"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 transition text-white font-semibold py-2 rounded-md lead-text"
            >
              Login
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-gray-400 text-sm block mb-2 lead-text">
                Enter 6-digit 2FA Code
              </label>
              <div className="flex items-center bg-gray-800 rounded-md px-3">
                <ShieldCheck size={18} className="text-teal-400 mr-2" />
                <input
                  type="text"
                  maxLength="6"
                  value={twofaCode}
                  onChange={(e) => setTwofaCode(e.target.value)}
                  className="bg-transparent outline-none text-white w-full py-2 tracking-widest text-center text-lg lead-text"
                  placeholder="123456"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 transition text-white font-semibold py-2 rounded-md lead-text"
            >
              Verify Code
            </button>

            <p
              onClick={() => setStage("login")}
              className="text-sm text-gray-400 hover:text-teal-400 text-center cursor-pointer mt-2 lead-text"
            >
              Back to login
            </p>
          </>
        )}
      </form>
    </div>
  );
}
