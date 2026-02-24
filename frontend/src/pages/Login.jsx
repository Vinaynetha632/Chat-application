import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/auth/login", formData);
      setUser(res.data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#141033] to-[#1B1445] text-white">
      <AuthNavbar type="login" />

      <div className="flex items-center justify-center mt-20">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-[420px] bg-[#1C1638] border border-[#2A2255] p-10 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-semibold text-center mb-2">
            Welcome back
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <div className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#141033] border border-[#2A2255] outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#141033] border border-[#2A2255] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;