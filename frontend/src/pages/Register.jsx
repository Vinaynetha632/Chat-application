import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthNavbar from "../components/AuthNavbar";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.post("/auth/register", formData);

      setSuccess("Registration successful! Please login.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#141033] to-[#1B1445] text-white">
      <AuthNavbar type="register" />

      <div className="flex items-center justify-center mt-20">
        <form
          onSubmit={handleRegister}
          noValidate
          className="w-[420px] bg-[#1C1638] border border-[#2A2255] p-10 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-semibold text-center mb-2">
            Create your account
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm text-center mb-4">{success}</p>
          )}

          <div className="space-y-5">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-[#141033] border border-[#2A2255] outline-none"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-[#141033] border border-[#2A2255] outline-none"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-lg bg-[#141033] border border-[#2A2255] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
