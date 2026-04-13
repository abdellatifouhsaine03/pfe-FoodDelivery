import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Lock, ArrowRight, Loader2, CheckCircle2, Inbox } from 'lucide-react';
import ima from './1.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agreeTerms: false,
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // New state for email verification view
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsSubmitting(true);

    try {
      // Endpoint hits your AuthController@register
      await axios.post('http://localhost:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword, // Required by Laravel 'confirmed' rule
        phone: formData.phone,
        address: formData.address,
      });

      // Instead of navigating to login immediately, we show the verification message
      setIsRegistered(true);
      
    } catch (err) {
      if (err.response?.data) {
        // Captures Laravel validation errors (like "email already taken")
        const serverErrors = err.response.data;
        const firstError = Object.values(serverErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Registration failed.');
      } else {
        setError('Connection to server failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VIEW: CHECK YOUR EMAIL ---
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Inbox size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Check your Gmail</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            We've sent a secure verification link to:<br/>
            <span className="text-emerald-600 font-bold">{formData.email}</span>
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
            >
              Go to Login
            </button>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Didn't get an email? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: SIGNUP FORM ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        
        {/* LEFT SECTION: BRANDING */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-600 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter">EAT.</Link>
            <div className="mt-16">
              <h1 className="text-4xl font-black text-white leading-tight tracking-tighter mb-4">
                Start Your <br />
                <span className="text-emerald-400">Culinary Journey.</span>
              </h1>
              <p className="text-emerald-50/70 text-sm font-medium max-w-xs leading-relaxed">
                Join our community of foodies and get the best flavors delivered to your doorstep.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <img 
              src={ima} 
              alt="Signup Visual" 
              className="w-full h-auto drop-shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-700" 
            />
          </div>
        </div>

        {/* RIGHT SECTION: SIGNUP FORM */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 md:p-16">
          <div className="max-w-2xl w-full mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-slate-500 font-medium">Join us and start exploring local flavors.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <User size={16} />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="auth-input-style" placeholder="John Doe" required />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Mail size={16} />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="auth-input-style" placeholder="john@example.com" required />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Phone size={16} />
                    </div>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="auth-input-style" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <MapPin size={16} />
                    </div>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="auth-input-style" placeholder="Street, City, Zip" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Lock size={16} />
                    </div>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="auth-input-style" placeholder="••••••••" required />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <CheckCircle2 size={16} />
                    </div>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="auth-input-style" placeholder="••••••••" required />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  name="agreeTerms" 
                  checked={formData.agreeTerms} 
                  onChange={handleChange} 
                  className="w-5 h-5 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer" 
                  required 
                />
                <label className="text-xs font-bold text-slate-500 cursor-pointer">
                  I agree to the <span className="text-emerald-600 hover:underline">Terms & Conditions</span>
                </label>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-500 text-xs font-bold p-4 rounded-xl border border-rose-100 animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
              </button>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                  Login Here
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .auth-input-style {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.875rem;
          color: #334155;
        }
        .auth-input-style:focus {
          background: white;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Signup;