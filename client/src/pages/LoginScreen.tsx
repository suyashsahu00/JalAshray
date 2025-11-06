import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

export default function LoginScreen() {
  const [userType, setUserType] = useState<'worker' | 'citizen' | 'admin'>('worker');
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Use email directly for login (backend expects email)
      const response = await login(identifier, password, userType === "worker" ? "employee" : "public");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", userType);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold">
            IN
          </div>
          <div className="text-xs text-blue-700 font-semibold tracking-wide uppercase">Government of India</div>
          <div className="text-xs text-gray-600">Ministry of Water Management</div>
        </div>
        <div className="flex flex-col items-center mb-6 gap-2">
          <div className="text-3xl text-green-700 mb-2">💧</div>
          <h1 className="text-xl font-bold text-center">JalAshray</h1>
          <p className="text-xs text-gray-500">Efficient Water. Better Tomorrow.</p>
        </div>
        <div className="mb-6">
          <label className="block text-center text-sm font-bold mb-2 text-gray-700">Select User Type</label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setUserType('worker')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${userType === "worker" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              🛠️ Repair Worker
            </button>
            <button
              onClick={() => setUserType('citizen')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${userType === "citizen" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              👤 Citizen
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${userType === "admin" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              ⚙️ Administrator
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm mb-2" role="alert">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border border-gray-300 w-full rounded-lg px-4 py-2 mb-2"
            placeholder="Employee ID / Email / Mobile Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            className="border border-gray-300 w-full rounded-lg px-4 py-2 mb-6"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
