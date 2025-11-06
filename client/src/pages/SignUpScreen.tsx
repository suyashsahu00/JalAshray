import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'worker' | 'citizen' | 'admin'>('citizen');
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Map UI role to API role
      const apiRole = role === 'worker' ? 'worker' : role === 'admin' ? 'admin' : 'citizen';
      
      const response = await register(
        name,
        email,
        password,
        apiRole,
        (role === 'worker' || role === 'admin') ? department : undefined
      );
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", apiRole);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          <p className="text-xs text-gray-500">Create Your Account</p>
        </div>

        <div className="mb-4">
          <label className="block text-center text-sm font-bold mb-2 text-gray-700">Select User Type</label>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${role === "citizen" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              👤 Citizen
            </button>
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${role === "worker" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              🛠️ Repair Worker
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`border rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${role === "admin" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
              ⚙️ Administrator
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-2" role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="border border-gray-300 w-full rounded-lg px-4 py-2"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="border border-gray-300 w-full rounded-lg px-4 py-2"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {(role === 'worker' || role === 'admin') && (
            <input
              type="text"
              className="border border-gray-300 w-full rounded-lg px-4 py-2"
              placeholder="Department (optional)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          )}
          <input
            type="password"
            className="border border-gray-300 w-full rounded-lg px-4 py-2"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            className="border border-gray-300 w-full rounded-lg px-4 py-2"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

