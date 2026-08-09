import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  KeyRound, 
  User, 
  RefreshCw,
  Sparkles,
  Lock
} from "lucide-react";

interface CustomerAuthProps {
  onAuthSuccess?: (user: any) => void;
  onClose?: () => void;
}

export default function CustomerAuth({ onAuthSuccess, onClose }: CustomerAuthProps) {
  const { isCyber } = useTheme();
  
  // State variables
  const [step, setStep] = useState<1 | 2>(1); // 1 = Enter Email, 2 = Enter OTP
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    setDevOtpCode(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send access code.");
      }

      setStep(2);
      setCooldownSeconds(60);
      setInfoMessage(data.message || "A 6-digit access code has been dispatched to your email.");

      if (data.previewOtp) {
        setDevOtpCode(data.previewOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit access code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          otp: trimmedOtp,
          name: name.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      // Store credentials securely in localStorage
      if (data.token) {
        localStorage.setItem("customer_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("customer_user", JSON.stringify(data.user));
      }

      setInfoMessage("Authentication successful! Welcome to Flaskia Marketplace.");

      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
        if (onClose) {
          onClose();
        }
      }, 500);

    } catch (err: any) {
      setErrorMessage(err.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch back to Email Step
  const handleReset = () => {
    setStep(1);
    setOtp("");
    setErrorMessage("");
    setInfoMessage("");
    setDevOtpCode(null);
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 md:p-8 rounded-2xl transition-all shadow-xl border ${
      isCyber 
        ? "bg-slate-900/90 text-slate-100 border-emerald-500/30 shadow-emerald-950/40" 
        : "bg-white text-slate-800 border-slate-200 shadow-slate-200/60"
    }`}>
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Email + OTP Authentication</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {step === 1 ? "Sign In / Register" : "Verify Access Code"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
          {step === 1 
            ? "Enter your email address to receive a secure 6-digit access code stored directly in PostgreSQL database." 
            : `Enter the 6-digit code sent to ${email}`}
        </p>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 leading-relaxed">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Dev Mode Code Indicator */}
      {devOtpCode && (
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs text-center font-mono">
          <span className="font-sans text-[11px] uppercase tracking-wide block mb-1 font-bold text-amber-600 dark:text-amber-400">
            ⚡ Dev Mode Preview Code
          </span>
          Your access OTP code is: <strong className="text-base tracking-widest text-amber-800 dark:text-amber-200">{devOtpCode}</strong>
        </div>
      )}

      {/* STEP 1: ENTER EMAIL */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Your Email Address <span className="text-emerald-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="chemist@laboratory.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                  isCyber 
                    ? "bg-slate-800/80 border-slate-700 text-slate-100 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Full Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Dr. Alexander Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                  isCyber 
                    ? "bg-slate-800/80 border-slate-700 text-slate-100 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Access Code...</span>
              </>
            ) : (
              <>
                <span>Send 6-Digit OTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                6-Digit Access Code <span className="text-emerald-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Change Email
              </button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-center text-xl font-mono tracking-[0.35em] font-bold border focus:outline-none transition-colors ${
                  isCyber 
                    ? "bg-slate-800/80 border-slate-700 text-emerald-400 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-emerald-700 focus:border-emerald-600 focus:bg-white"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Identity...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Verify Code & Login</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Didn't receive code?</span>
            <button
              type="button"
              disabled={cooldownSeconds > 0 || isLoading}
              onClick={handleSendOtp}
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              <span>{cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : "Resend Code"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Secure footer notice */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        <span>Registered emails are kept securely in PostgreSQL</span>
      </div>

    </div>
  );
}
