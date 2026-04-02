import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { 
  Store, User, FileCheck, ChevronRight, ChevronLeft, 
  CheckCircle2, Upload, X, ShieldCheck, Info
} from "lucide-react";
import imgSide from './17.png';

const Partner = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerFullName: "", emailAddress: "", phoneNumber: "",
    password: "", confirmpassword: "", businesstype: "",
    businessName: "", cuisineType: "", businessAddress: "",
    businessDescription: "", businessLicense: null,
    imageresto: null, agreeToTerms: false,
  });

  const cuisineOptions = [
    { value: "francaise", label: "Française" },
    { value: "japonaise", label: "Japonaise" },
    { value: "italienne", label: "Italienne" },
    { value: "moyen-orient", label: "Moyen-Orient" },
    { value: "fast-food", label: "Fast Food" },
    { value: "americaine", label: "Américaine" },
    { value: "mexicaine", label: "Mexicaine" },
    { value: "chinoise", label: "Chinoise" },
    { value: "indienne", label: "Indienne" },
    { value: "thailandaise", label: "Thaïlandaise" },
    { value: "espagnole", label: "Espagnole" },
    { value: "coreenne", label: "Coréenne" },
    { value: "vegetarienne", label: "Végétarienne" },
    { value: "vegetalienne", label: "Végétalienne" },
    { value: "africaine", label: "Africaine" },
    { value: "mediterraneenne", label: "Méditerranéenne" },
    { value: "bresilienne", label: "Brésilienne" },
    { value: "turque", label: "Turque" },
    { value: "allemande", label: "Allemande" },
    { value: "vietnamienne", label: "Vietnamienne" },
    { value: "libanaise", label: "Libanaise" },
    { value: "breakfast", label: "Breakfast" },
    { value: "pizza", label: "Pizza" },
    { value: "salads", label: "Salades" },
    { value: "soupes", label: "Soupes" },
    { value: "sandwiches", label: "Sandwiches" },
    { value: "desserts", label: "Desserts" },
    { value: "grillades", label: "Grillades" },
    { value: "tacos", label: "Tacos" },
    { value: "fruits-de-mer", label: "Fruits de mer" },
    { value: "autre", label: "Autre" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else submitForm();
  };

  async function submitForm() {
    setIsSubmitting(true);
    try {
      const userRes = await axios.post("http://localhost:8000/api/users", {
        name: formData.ownerFullName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        password: formData.password,
        password_confirmation: formData.confirmpassword,
        type: "admin",
      });

      const restaurantForm = new FormData();
      restaurantForm.append("user_id", userRes.data.user.id);
      restaurantForm.append("name", formData.businessName);
      restaurantForm.append("business_type", formData.businesstype);
      restaurantForm.append("cuisine_type", formData.cuisineType);
      restaurantForm.append("address", formData.businessAddress);
      restaurantForm.append("description", formData.businessDescription);
      restaurantForm.append("agree_to_terms", formData.agreeToTerms ? "1" : "0");
      restaurantForm.append("status", "pending");

      if (formData.businessLicense) restaurantForm.append("business_license", formData.businessLicense);
      if (formData.imageresto) restaurantForm.append("logo", formData.imageresto);

      await axios.post("http://localhost:8000/api/restaurants", restaurantForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSubmitted(true);
    } catch (error) {
      alert("Submission Error. Check console.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const StepIndicator = ({ num, icon: Icon, label }) => (
    <div className={`flex items-center gap-5 p-5 rounded-[1.5rem] transition-all duration-500 border ${step === num ? 'bg-white/10 border-white/20 shadow-xl' : 'border-transparent opacity-40'}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step >= num ? 'bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="hidden xl:block">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === num ? 'text-emerald-400' : 'text-slate-500'}`}>Step 0{num}</p>
        <p className="text-sm font-black text-white">{label}</p>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">You're All Set!</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">We've received your application. Our team will review your business license and details within 48 hours.</p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      
      {/* LEFT SECTION: THE VISUAL TRACKER (RESTORED) */}
      <div className="hidden lg:flex w-[480px] relative flex-col justify-between p-12 overflow-hidden bg-slate-950">
        {/* Background Image with Layered Gradients */}
        <div className="absolute inset-0 z-0">
          <img src={imgSide} className="w-full h-full object-cover opacity-60 scale-105" alt="Restaurant Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80"></div>
          <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="text-3xl font-black text-white tracking-tighter mb-20 block">EAT.<span className="text-emerald-400">PARTNER</span></Link>
          <div className="space-y-6">
            <StepIndicator num={1} icon={Store} label="Store Details" />
            <StepIndicator num={2} icon={User} label="Owner Setup" />
            <StepIndicator num={3} icon={FileCheck} label="Final Verification" />
          </div>
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="flex items-start gap-4 text-emerald-400 mb-4">
            <ShieldCheck size={28} />
            <span className="text-sm font-black text-white tracking-tight">Verified Partnership</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">Join 5,000+ restaurants already growing their revenue with our logistics network.</p>
        </div>
      </div>

      {/* RIGHT SECTION: THE FORM */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50/30">
        <div className="max-w-2xl w-full mx-auto px-8 py-16 md:py-24">
          
          <header className="mb-12 flex justify-between items-start">
            <div className="space-y-1">
              <span className="inline-block py-1 px-3 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">Onboarding</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Register your business.</h1>
              <p className="text-slate-500 font-medium">Tell us about your restaurant to get started.</p>
            </div>
            <button onClick={() => navigate('/')} className="p-3 rounded-full hover:bg-slate-100 transition-colors text-slate-400"><X /></button>
          </header>

          <form onSubmit={handleNext} className="space-y-10">
            
            {/* STEP 1: BUSINESS INFO */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="modern-input" placeholder="The Green Kitchen" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Business Type</label>
                  <select name="businesstype" value={formData.businesstype} onChange={handleChange} className="modern-input appearance-none bg-white" required>
                    <option value="">-- Type --</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Cafe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Cuisine Style</label>
                  <Select 
                    options={cuisineOptions} 
                    placeholder="Search cuisine..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                    onChange={(opt) => setFormData({...formData, cuisineType: opt.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Business Address</label>
                  <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} className="modern-input" placeholder="Full street address" required />
                </div>
              </div>
            )}

            {/* STEP 2: OWNER INFO */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Propriétaire Full Name</label>
                  <input type="text" name="ownerFullName" value={formData.ownerFullName} onChange={handleChange} className="modern-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Phone Number</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="modern-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Email Address</label>
                  <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="modern-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="modern-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Confirm</label>
                  <input type="password" name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} className="modern-input" required />
                </div>
              </div>
            )}

            {/* STEP 3: ASSETS & DOCS */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Business License (PDF/IMG)</label>
                    <div className="upload-box group">
                        <Upload className="group-hover:text-emerald-500 transition-colors" />
                        <span className="text-[11px] font-bold mt-2">Add Document</span>
                        <input type="file" name="businessLicense" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Restaurant Image</label>
                    <div className="upload-box group">
                        <Upload className="group-hover:text-emerald-500 transition-colors" />
                        <span className="text-[11px] font-bold mt-2">Upload Photo</span>
                        <input type="file" name="imageresto" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Description</label>
                  <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} className="modern-input min-h-[140px] pt-4" placeholder="Briefly describe your specialty dishes..." required />
                </div>
                <div className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                   <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="w-5 h-5 mt-0.5 accent-emerald-600 rounded-md" required />
                   <p className="text-xs font-bold text-emerald-800 leading-relaxed">I confirm that all provided documents are valid and I agree to the Merchant Partnership Agreement.</p>
                </div>
              </div>
            )}

            {/* FOOTER NAV */}
            <div className="flex items-center justify-between pt-10">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">
                  <ChevronLeft size={16} strokeWidth={3} /> Previous
                </button>
              ) : <div />}
              
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-emerald-500 hover:text-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black flex items-center gap-4 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50">
                {isSubmitting ? "Uploading..." : step === 3 ? "Complete Registration" : "Next Step"}
                {step < 3 && <ChevronRight size={18} strokeWidth={3} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx="true">{`
        .modern-input {
          width: 100%;
          padding: 1.1rem 1.4rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 0.95rem;
          color: #1e293b;
        }
        .modern-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        .upload-box {
          position: relative;
          height: 120px;
          border: 2px dashed #e2e8f0;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background: white;
          transition: all 0.2s ease;
        }
        .upload-box:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .react-select-container .react-select__control {
          border-radius: 1.25rem;
          padding: 0.45rem;
          border: 1px solid #e2e8f0;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Partner;