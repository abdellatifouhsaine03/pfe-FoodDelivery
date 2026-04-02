import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  User, Bike, FileText, ChevronRight, ChevronLeft, 
  CheckCircle2, Upload, X, ShieldCheck, MapPin
} from "lucide-react";
import imgSide from './21.webp';

const Livreure = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirm_password: "",
    phone: "", vehicleType: "bike", vehicleModel: "", licensePlate: "",
    idDocument: null, drivingLicense: null, agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else {
      setIsSubmitting(true);
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        const value = key === 'confirm_password' ? 'password_confirmation' : key;
        formPayload.append(value, formData[key]);
      });
      formPayload.append("type", "rider");

      try {
        await axios.post("http://localhost:8000/api/register-rider", formPayload);
        setIsSubmitted(true);
      } catch (error) {
        alert("Registration failed.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center animate-in zoom-in">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900tracking-tighter mb-3">Application Sent!</h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">We'll verify your documents and contact you within 48 hours.</p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* LEFT VISUAL TRACKER - FIXED HEIGHT */}
      <div className="hidden lg:flex w-[420px] h-full relative flex-col justify-between p-12 bg-slate-950 shrink-0">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={imgSide} className="w-full h-full object-cover opacity-50 scale-105" alt="Delivery" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/90"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-20 block underline decoration-emerald-400 decoration-4 underline-offset-8">RIDE.</Link>
          <div className="space-y-6">
            {[ {n:1, i:User, l:'Personal Profile'}, {n:2, i:Bike, l:'Vehicle Details'}, {n:3, i:FileText, l:'Verification'} ].map((s) => (
              <div key={s.n} className={`flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all duration-500 ${step === s.n ? 'bg-white/10 border-white/20' : 'border-transparent opacity-40'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step >= s.n ? 'bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                  <s.i size={22} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">Step 0{s.n}</p>
                  <p className="text-sm font-black text-white">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <ShieldCheck size={24} />
            <span className="text-xs font-black uppercase tracking-widest text-white">Secure Process</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">By joining our fleet, you gain access to flexible hours, instant payouts, and comprehensive insurance coverage.</p>
        </div>
      </div>

      {/* RIGHT FORM AREA - SCROLL CONSTRAINED */}
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-slate-50/50 p-6 md:p-12">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 p-10 md:p-12">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Deliver with us.</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Sign up in minutes and start earning today.</p>
            </div>
            <button onClick={() => navigate('/')} className="text-slate-300 hover:text-slate-900 transition-colors p-3 hover:bg-slate-100 rounded-full"><X size={20}/></button>
          </div>

          <form onSubmit={handleNext} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* STEP 1: RESTORED TWO-COLUMN LAYOUT */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Full Legal Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="modern-input" placeholder="John Doe" required />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="modern-input" placeholder="john@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="modern-input" placeholder="••••••••" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Confirm</label>
                  <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="modern-input" placeholder="••••••••" required />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="modern-input" placeholder="+212 600 000 000" required />
                </div>
              </div>
            )}

            {/* STEP 2: VEHICLE CHOICE */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {['bike', 'scooter', 'car'].map((type) => (
                     <button key={type} type="button" onClick={() => setFormData({...formData, vehicleType: type})}
                       className={`flex-1 p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.vehicleType === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-300 hover:border-slate-200'}`}>
                       {type === 'bike' ? <Bike size={24}/> : type === 'scooter' ? <MapPin size={24}/> : <User size={24}/>}
                       <span className="text-[11px] font-black uppercase tracking-widest">{type}</span>
                     </button>
                   ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Vehicle Model</label>
                    <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="modern-input" placeholder="e.g. Yamaha T-MAX" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">License Plate</label>
                    <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="modern-input" placeholder="ABC-1234" required />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DOCS & CHECKS */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group min-h-[140px] border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-center">
                    <Upload size={24} className="text-slate-300 group-hover:text-emerald-500 mb-1" />
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">{formData.idDocument ? formData.idDocument.name : "National ID"}</p>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                    <input type="file" name="idDocument" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                  </div>
                  <div className="relative group min-h-[140px] border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-center">
                    <Upload size={24} className="text-slate-300 group-hover:text-emerald-500 mb-1" />
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">{formData.drivingLicense ? formData.drivingLicense.name : "Driving License"}</p>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                    <input type="file" name="drivingLicense" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="w-5 h-5 mt-0.5 accent-emerald-600 rounded" required />
                   <p className="text-xs font-bold text-emerald-800 leading-relaxed tracking-tight">I certify that the vehicle registered is insured and I agree to the Delivery Partner Data Handling Policy and Terms of Service.</p>
                </div>
              </div>
            )}

            {/* NAV FOOTER - FIXED AT BOTTOM OF CARD */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
                  <ChevronLeft size={16} strokeWidth={3} className="inline mr-1" /> Back
                </button>
              ) : <div />}
              
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-emerald-500 text-white hover:text-slate-950 px-12 py-5 rounded-[1.5rem] font-black text-xs flex items-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 shadow-slate-900/10 hover:shadow-emerald-500/20">
                {isSubmitting ? "Processing..." : step === 3 ? "Complete Sign Up" : "Next Phase"}
                {step < 3 && <ChevronRight size={16} strokeWidth={3} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx="true">{`
        .modern-input {
          width: 100%;
          padding: 1.1rem 1.4rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .modern-input:focus {
          background: white;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08);
        }
      `}</style>
    </div>
  );
};

export default Livreure;