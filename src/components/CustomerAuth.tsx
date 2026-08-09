import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Search, 
  Sparkles, 
  Info, 
  Loader2, 
  CheckCircle, 
  Phone, 
  MapPin, 
  ChevronDown, 
  AlertCircle 
} from "lucide-react";
import { COUNTRIES_DATA } from "../utils/globalLocationData";

interface CustomerAuthProps {
  onAuthSuccess?: (user: any) => void;
  onClose?: () => void;
}

export default function CustomerAuth({ onAuthSuccess, onClose }: CustomerAuthProps) {
  const { isCyber } = useTheme();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Sign-in States
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinError, setSigninError] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);

  // Sign-up Step 1 States
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otpCodeSent, setOtpCodeSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupInfo, setSignupInfo] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  // Sign-up Step 2 (Billing) States
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("1");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isCompletingStep2, setIsCompletingStep2] = useState(false);

  // Country & State Real-time searches
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES_DATA[0] | null>(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const [stateSearch, setStateSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  // Registered Customer User Profile (Returned from Step 1 verification)
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  // Cooldown timer implementation
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Click outside filters lists handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries in real-time
  const filteredCountries = COUNTRIES_DATA.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Filter states based on selected country in real-time
  const activeStates = selectedCountry ? selectedCountry.states : [];
  const filteredStates = activeStates.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleCountrySelect = (country: typeof COUNTRIES_DATA[0]) => {
    setSelectedCountry(country);
    setCountrySearch(country.name);
    setPhoneCode(country.code);
    setCountryDropdownOpen(false);

    // Reset state selection when country morphs
    setSelectedState("");
    setStateSearch("");
  };

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    setStateSearch(stateName);
    setStateDropdownOpen(false);
  };

  // Login handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinEmail || !signinPassword) {
      setSigninError("Please enter your academic or client verified email and password.");
      return;
    }

    setSigninLoading(true);
    setSigninError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signinEmail, password: signinPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Success! Notify parent and save session state
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setSigninError(err.message);
    } finally {
      setSigninLoading(false);
    }
  };

  // Step 1: Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupInfo("");
    setDevOtpCode(null);

    const { firstName, lastName, email, password, confirmPassword } = signUpData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setSignupError("All fields are mandatory to trigger the OTP security dispatcher.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to trigger OTP generation.");
      }

      setOtpCodeSent(true);
      setCooldownSeconds(60); // Activate 60-second cooldown
      
      if (data.previewOtp) {
        setDevOtpCode(data.previewOtp);
        setSignupInfo(`[DEVELOPER PREVIEW]: Resend API is not configured on this host. Your OTP is: ${data.previewOtp}`);
      } else {
        setSignupInfo("A secure 6-digit verification code has been dispatched to your email via Resend.");
      }
    } catch (err: any) {
      setSignupError(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 1: Verify OTP and create User
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupInfo("");

    if (!otpInput || otpInput.length !== 6) {
      setSignupError("Verification code must be exactly 6 digits.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const { firstName, lastName, email, password } = signUpData;
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, otp: otpInput })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      // Success, User verified and registered! Save user object and transition to Step 2
      setRegisteredUser(data.user);
      setSignupStep(2);
      
      // Auto pre-populate the country selection with US by default for easy interaction
      handleCountrySelect(COUNTRIES_DATA[0]);
    } catch (err: any) {
      setSignupError(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 2: Billing & shipping registration details completion
  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!registeredUser) {
      setSignupError("Session expired. Please restart the registration process.");
      return;
    }

    if (!addressLine1 || !city || !selectedState || !zipCode || !selectedCountry || !phone) {
      setSignupError("All billing status fields are required to finish registration.");
      return;
    }

    if (!acceptTerms) {
      setSignupError("You must read and accept the Flaskia Marketplace terms and conditions.");
      return;
    }

    setIsCompletingStep2(true);

    try {
      const res = await fetch("/api/auth/register/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: registeredUser.id,
          addressLine1,
          addressLine2,
          city,
          state: selectedState,
          zipCode,
          country: selectedCountry.name,
          phone,
          countryCode: phoneCode,
          acceptTerms: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize billing layout.");
      }

      // Completely authenticated! Save user and proceed to marketplace store or checkout
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setSignupError(err.message);
    } finally {
      setIsCompletingStep2(false);
    }
  };

  return (
    <div className={`max-w-xl mx-auto px-4 py-8 animate-fade-in transition-colors duration-300 ${
      isCyber ? "text-slate-100" : "text-slate-900"
    }`} id="customer-auth-workspace">
      {/* Decored Logo Accent */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 border ${
          isCyber 
            ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            : "bg-slate-100 text-slate-800 border-slate-200"
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isCyber ? "text-cyan-400" : "text-blue-500"} animate-pulse`} />
          <span>Flaskia Procure Gateway</span>
        </div>
        <h2 className={`text-2xl font-black tracking-tight font-sans ${
          isCyber ? "text-cyan-100" : "text-slate-900"
        }`}>
          {authMode === "signin" ? "Welcome Back Client" : "Create Account"}
        </h2>
        <p className={`text-xs mt-2 max-w-sm mx-auto ${
          isCyber ? "text-cyan-400/70" : "text-slate-500"
        }`}>
          {authMode === "signin"
            ? "Sign in immediately using your verified email credentials."
            : signupStep === 1 
              ? "Verify your identity with a secure 6-digit confirmation code code."
              : "Set up your secure billing profile to streamline the procurement checkout."}
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden">
        {/* Sleek Selection switcher */}
        {signupStep === 1 && (
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
            <button
              onClick={() => { setAuthMode("signin"); setSignupError(""); setSignupInfo(""); }}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                authMode === "signin"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setSignupError(""); setSignupInfo(""); }}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                authMode === "signup"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Dynamic Display workspace */}
        <div className="p-6 md:p-8">
          
          {/* LOGIN CONTAINER */}
          {authMode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                  />
                </div>
              </div>

              {signinError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{signinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={signinLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {signinLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authorize Signature Login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP STEP 1: INITIAL DETAILS & OTP */}
          {authMode === "signup" && signupStep === 1 && (
            <div className="space-y-5">
              {!otpCodeSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        placeholder="Evelyn"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800 text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        placeholder="Snyder"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                      Scholar Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="scientist@college.edu"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  {signupError && (
                    <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{signupError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Sending secure OTP mail...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send OTP Verification Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {signupInfo && (
                    <div className="p-3.5 bg-blue-50 border border-blue-150 text-blue-800 text-xs rounded-xl flex items-start gap-2 font-medium">
                      <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                      <span>{signupInfo}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase text-center tracking-widest">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 123456"
                      className="w-full max-w-sm mx-auto text-center tracking-[12px] font-mono text-2xl font-bold py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 block"
                    />
                  </div>

                  {signupError && (
                    <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{signupError}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={cooldownSeconds > 0 || isSendingOtp}
                      onClick={handleSendOtp}
                      className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11.5px] font-bold py-2 px-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
                    >
                      {cooldownSeconds > 0 
                        ? `Resend Code (${cooldownSeconds}s)` 
                        : "Resend Code"}
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isVerifyingOtp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>Confirm & Verify</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center italic mt-2">
                    To satisfy rate limits, secure OTP codes are locked to 5 incorrect attempts and expire in 10 minutes.
                  </p>
                </form>
              )}
            </div>
          )}

          {/* SIGNUP STEP 2: BILLING & DELIVERY LOGISTICS DETAILS */}
          {authMode === "signup" && signupStep === 2 && (
            <form onSubmit={handleFinishRegistration} className="space-y-4">
              
              <div className="p-3.5 bg-emerald-50/75 border border-emerald-150 rounded-2xl text-emerald-900 flex items-start gap-2.5 mb-4 shadow-3xs">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold">Step 1 complete!</span> Your email <b>{signUpData.email}</b> has been successfully verified. Let's finish your secure billing layout to enable rapid procurement.
                </div>
              </div>

              {/* Automatically Filled Readonly Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/75 px-3 py-1.5 border border-slate-100 rounded-xl">
                  <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
                  <span className="text-xs font-semibold text-slate-600">{signUpData.firstName} {signUpData.lastName}</span>
                </div>
                <div className="bg-slate-50/75 px-3 py-1.5 border border-slate-100 rounded-xl truncate">
                  <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">Account email</span>
                  <span className="text-xs font-semibold text-slate-600 truncate block">{signUpData.email}</span>
                </div>
              </div>

              {/* Address inputs */}
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    Address Line 1 (Billing)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. 77 Massachusetts Ave, Lab 4"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    Address Line 2 <span className="text-[9.5px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Suite, Building, Lab Room"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Real-time Country selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 relative" ref={countryRef}>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    Country
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setCountryDropdownOpen(true);
                      }}
                      onFocus={() => setCountryDropdownOpen(true)}
                      placeholder="Search Country"
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                  </div>

                  {countryDropdownOpen && (
                    <div className="absolute z-55 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => handleCountrySelect(c)}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                          >
                            <span>{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">+{c.code}</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-xs text-slate-400">No match. Type generic name...</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-time State selection */}
                <div className="space-y-1 relative" ref={stateRef}>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    State / Region
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={stateSearch}
                      onChange={(e) => {
                        setStateSearch(e.target.value);
                        setSelectedState(e.target.value);
                        setStateDropdownOpen(true);
                      }}
                      onFocus={() => setStateDropdownOpen(true)}
                      placeholder={selectedCountry ? "Search/Type State" : "Select Country First"}
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                  </div>

                  {stateDropdownOpen && (
                    <div className="absolute z-55 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                      {filteredStates.length > 0 ? (
                        filteredStates.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStateSelect(st)}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 text-slate-700"
                          >
                            {st}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-left text-xs text-slate-400">
                          {selectedCountry 
                            ? "Custom inputs allowed (just hit entry)..." 
                            : "Please select your Country above first."}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* City + Zip/PIN code and preselected Phone code */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cambridge"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                    Zip / Pin Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="02139"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Phone code auto-fitting */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-widest">
                  Phone Number
                </label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:ring-1 focus-within:ring-slate-900 transition-all">
                  <div className="bg-slate-100 text-slate-600 px-3 py-2 flex items-center gap-1 text-xs font-mono font-bold select-none border-r border-slate-200">
                    <Phone className="w-3 h-3" />
                    <span>+{phoneCode}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 555-0192"
                    className="flex-1 px-3 py-2 bg-transparent text-xs focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Terms and Conditions checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-[11px] text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-955 focus:ring-slate-900 focus:ring-1 cursor-pointer w-3.5 h-3.5"
                  />
                  <span>
                    I confirm my scholarly entity status and accept the standard Flaskia <b>Terms and Conditions</b>, biological liability compliance controls, and privacy directives.
                  </span>
                </label>
              </div>

              {signupError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCompletingStep2}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                {isCompletingStep2 ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Secure Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Finish Registration & Enter</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          🛡️ Enterprise-Grade MFA & SMTP Infrastructure v4.0.1
        </p>
      </div>
    </div>
  );
}
