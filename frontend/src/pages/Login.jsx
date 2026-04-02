import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import ima from "./1.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const redirectTo = res.data.redirect_to || "/";
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* MAIN WRAPPER */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        
        {/* LEFT SECTION: BRANDING & VISUALS */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-emerald-600 to-slate-900 p-16 flex-col justify-between relative overflow-hidden">
          {/* Animated Background Decor */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter">EAT.</Link>
            <div className="mt-20">
              <h1 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
                Your favorite meals, <br />
                <span className="text-emerald-400">just a click away.</span>
              </h1>
              <p className="text-emerald-50/70 text-lg font-medium max-w-md leading-relaxed">
                Login to access your personalized dashboard and continue your journey with us.
              </p>
            </div>
          </div>

          <div className="relative z-10 group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
            <img 
              src={ima} 
              alt="Food Delivery" 
              className="relative w-full h-auto drop-shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700" 
            />
          </div>
        </div>

        {/* RIGHT SECTION: LOGIN FORM */}
        <div className="lg:col-span-6 flex flex-col justify-center p-8 md:p-20 relative">
          
          <div className="max-w-sm w-full mx-auto">
            <header className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-700"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <a href="#" className="text-[11px] font-bold text-emerald-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-500 text-xs font-bold p-4 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <footer className="mt-10 text-center">
              <p className="text-sm font-bold text-slate-400">
                Don't have an account?{" "}
                <Link to="/signin" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                  Create Account
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;