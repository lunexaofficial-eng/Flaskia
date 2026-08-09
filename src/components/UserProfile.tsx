import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  User, 
  Mail, 
  MapPin, 
  Lock, 
  Camera, 
  Check, 
  X, 
  Edit2, 
  LogOut, 
  AlertTriangle, 
  Coins, 
  UserCheck, 
  Building,
  Key,
  Smartphone,
  ShieldCheck,
  Send
} from "lucide-react";


interface UserProfileProps {
  currentUser: any;
  onUpdateUser: (newUser: any) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
];

export default function UserProfile({
  currentUser,
  onUpdateUser,
  onLogout,
  onBackToStore
}: UserProfileProps) {
  const { isCyber } = useTheme();
  const [dbUser, setDbUser] = useState<any>(currentUser);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit states
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Billing Form Values
  const [billingValues, setBillingValues] = useState({
    billingAddress: dbUser?.billingAddress || "",
    billingRoom: dbUser?.billingRoom || "",
    billingCity: dbUser?.billingCity || "",
    billingState: dbUser?.billingState || "",
    billingZip: dbUser?.billingZip || "",
    billingCountry: dbUser?.billingCountry || "",
    phone: dbUser?.phone || dbUser?.mobile || ""
  });

  // Profile Form Values
  const [profileValues, setProfileValues] = useState({
    firstName: dbUser?.firstName || dbUser?.name?.split(" ")[0] || "",
    lastName: dbUser?.lastName || dbUser?.name?.split(" ").slice(1).join(" ") || "",
    password: "",
    avatar: dbUser?.avatar || ""
  });

  // Automatically update form fields when dynamic loaded user details arrive
  useEffect(() => {
    if (dbUser && !isEditingProfile) {
      setProfileValues({
        firstName: dbUser.firstName || dbUser.name?.split(" ")[0] || "",
        lastName: dbUser.lastName || dbUser.name?.split(" ").slice(1).join(" ") || "",
        password: "",
        avatar: dbUser.avatar || ""
      });
    }
  }, [dbUser, isEditingProfile]);

  useEffect(() => {
    if (dbUser && !isEditingBilling) {
      setBillingValues({
        billingAddress: dbUser.billingAddress || "",
        billingRoom: dbUser.billingRoom || "",
        billingCity: dbUser.billingCity || "",
        billingState: dbUser.billingState || "",
        billingZip: dbUser.billingZip || "",
        billingCountry: dbUser.billingCountry || "",
        phone: dbUser.phone || dbUser.mobile || ""
      });
    }
  }, [dbUser, isEditingBilling]);

  // OTP confirmation states for Billing
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpDevPreview, setOtpDevPreview] = useState("");

  const userId = currentUser?.id || currentUser?.uid;

  // Load fresh profile details on mount or identity changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/customers/${userId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Could not retrieve customer details from directory.");
          return res.json();
        })
        .then((data) => {
          setDbUser(data);
          // Sync back to local storage and parent state.
          onUpdateUser({ ...currentUser, ...data });

          setBillingValues({
            billingAddress: data.billingAddress || "",
            billingRoom: data.billingRoom || "",
            billingCity: data.billingCity || "",
            billingState: data.billingState || "",
            billingZip: data.billingZip || "",
            billingCountry: data.billingCountry || "",
            phone: data.phone || data.mobile || ""
          });

          setProfileValues({
            firstName: data.firstName || data.name?.split(" ")[0] || "",
            lastName: data.lastName || data.name?.split(" ").slice(1).join(" ") || "",
            password: "",
            avatar: data.avatar || ""
          });
        })
        .catch((err) => {
          console.error(err);
          setErrorMsg(err.message || "Failed to load profile.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Handle basic profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const resp = await fetch("/api/profile/update-basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: dbUser.id || userId,
          firstName: profileValues.firstName,
          lastName: profileValues.lastName,
          password: profileValues.password,
          avatar: profileValues.avatar
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to update profile details.");
      }

      setDbUser(data.user);
      onUpdateUser({ ...currentUser, ...data.user });
      setSuccessMsg("Profile details updated successfully!");
      setIsEditingProfile(false);
      
      // Clear password field
      setProfileValues(prev => ({ ...prev, password: "" }));
    } catch (err: any) {
      setErrorMsg(err.message || "Error updating profile details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Send OTP
  const handleSendBillingOtp = async () => {
    setOtpLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setOtpDevPreview("");

    try {
      const resp = await fetch("/api/profile/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: dbUser.id || userId })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to send OTP verification code.");
      }

      setOtpSent(true);
      if (data.devMode && data.previewOtp) {
        setOtpDevPreview(data.previewOtp);
      }
      setShowOtpDialog(true);
      setSuccessMsg("Security verification OTP sent successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Error sending verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Confirm billing submit with verification code
  const handleBillingSubmitVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit verification code.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const resp = await fetch("/api/profile/update-billing-secure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: dbUser.id || userId,
          billingAddress: billingValues.billingAddress,
          billingRoom: billingValues.billingRoom,
          billingCity: billingValues.billingCity,
          billingState: billingValues.billingState,
          billingZip: billingValues.billingZip,
          billingCountry: billingValues.billingCountry,
          phone: billingValues.phone,
          otp: otpCode
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "OTP Verification failed.");
      }

      setDbUser(data.user);
      onUpdateUser({ ...currentUser, ...data.user });
      setSuccessMsg("Billing details updated and verified successfully!");
      setIsEditingBilling(false);
      setShowOtpDialog(false);
      setOtpCode("");
      setOtpSent(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Error verifying billing changes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-400 font-mono space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mx-auto" />
        <p>Loading user database profile directory...</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in transition-colors duration-300 ${
      isCyber ? "text-slate-100" : "text-slate-900"
    }`} id="customer-profile-section">
      
      {/* Upper Navigation & Context Alert */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
        isCyber ? "border-cyan-900/50" : "border-slate-200"
      }`}>
        <div>
          <h2 className={`text-xl font-black tracking-tight font-sans ${
            isCyber ? "text-cyan-100" : "text-slate-900"
          }`}>
            Member Profile Directory
          </h2>
          <p className={`text-xs font-mono mt-0.5 uppercase tracking-wider font-semibold ${
            isCyber ? "text-cyan-400/80" : "text-slate-400"
          }`}>
            Status: <span className="text-emerald-400 font-bold">Secure Connection Verified</span>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onBackToStore}
            className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition border ${
              isCyber
                ? "bg-slate-900 border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-slate-800"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            ← Back to Catalog
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold rounded-xl cursor-pointer transition border border-rose-500/40 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700 font-medium flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-700 font-medium flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Overview (Header Grid) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Profile Pic Render */}
        <div className="relative shrink-0 w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
          {dbUser.avatar ? (
            <img 
              src={dbUser.avatar} 
              alt="Profile avatar" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <User className="w-10 h-10 text-slate-400" />
          )}
        </div>

        {/* User Identity Details */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {dbUser.firstName && dbUser.lastName ? `${dbUser.firstName} ${dbUser.lastName}` : dbUser.name || "Academic Member"}
          </h3>
          <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{dbUser.email}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] font-mono text-slate-400">
            {dbUser.institution && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                <Building className="w-3 h-3 text-slate-400" />
                {dbUser.institution}
              </span>
            )}
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase tracking-widest font-bold text-[10px]">
              {dbUser.role || "CUSTOMER"}
            </span>
            <span className="text-slate-400">Joined: {dbUser.joinedDate || "N/A"}</span>
          </div>
        </div>

        {/* Edit Button */}
        {!isEditingProfile && (
          <button
            onClick={() => {
              setProfileValues({
                firstName: dbUser?.firstName || dbUser?.name?.split(" ")[0] || "",
                lastName: dbUser?.lastName || dbUser?.name?.split(" ").slice(1).join(" ") || "",
                password: "",
                avatar: dbUser?.avatar || ""
              });
              setIsEditingProfile(true);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Grid: 1. Edit Profile Form / Overview | 2. Billing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PART 1: PROFILE MANAGEMENT (Edit Profile Only) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Profile Management
              </h4>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                      value={profileValues.firstName}
                      onChange={(e) => setProfileValues({ ...profileValues, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                      value={profileValues.lastName}
                      onChange={(e) => setProfileValues({ ...profileValues, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password Change */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Change Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter at least 6 characters to change..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                    value={profileValues.password}
                    onChange={(e) => setProfileValues({ ...profileValues, password: e.target.value })}
                  />
                </div>

                {/* Profile Picture / Avatar URL */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1">
                    <Camera className="w-3 h-3 text-slate-400" />
                    Profile Picture / Avatar
                  </label>
                  
                  {/* Preset Selector */}
                  <div className="flex gap-2.5 mb-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((av, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setProfileValues({ ...profileValues, avatar: av })}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition shrink-0 ${
                          profileValues.avatar === av ? "border-blue-600 scale-105" : "border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        <img src={av} alt="Preset visual" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                    placeholder="Or paste custom image URL path..."
                    value={profileValues.avatar}
                    onChange={(e) => setProfileValues({ ...profileValues, avatar: e.target.value })}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset values
                      setProfileValues({
                        firstName: dbUser.firstName || dbUser.name?.split(" ")[0] || "",
                        lastName: dbUser.lastName || dbUser.name?.split(" ").slice(1).join(" ") || "",
                        password: "",
                        avatar: dbUser.avatar || ""
                      });
                      setIsEditingProfile(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer transition border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 py-2 text-left">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">First Name</span>
                      <span className="text-xs text-slate-800 font-semibold">{dbUser.firstName || dbUser.name?.split(" ")[0] || "Scholar"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Last Name</span>
                      <span className="text-xs text-slate-800 font-semibold">{dbUser.lastName || dbUser.name?.split(" ").slice(1).join(" ") || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Account Role</span>
                    <span className="text-xs text-blue-600 font-bold font-mono text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded inline-block uppercase mt-0.5">
                      {dbUser.role || "CUSTOMER"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Security Password</span>
                    <span className="text-xs text-slate-450 italic font-mono">•••••••• (Hidden for security)</span>
                  </div>
                </div>

                <div className="text-slate-400 text-[11px] leading-relaxed italic">
                  To keep the global repository synchronized, please keep your password updated periodically.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PART 2: BILLING DETAILS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Billing details & address
              </h4>
              {!isEditingBilling && (
                <button
                  type="button"
                  onClick={() => {
                    setBillingValues({
                      billingAddress: dbUser?.billingAddress || "",
                      billingRoom: dbUser?.billingRoom || "",
                      billingCity: dbUser?.billingCity || "",
                      billingState: dbUser?.billingState || "",
                      billingZip: dbUser?.billingZip || "",
                      billingCountry: dbUser?.billingCountry || "",
                      phone: dbUser?.phone || dbUser?.mobile || ""
                    });
                    setIsEditingBilling(true);
                  }}
                  className="w-7 h-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg flex items-center justify-center transition cursor-pointer"
                  title="Edit Billing Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isEditingBilling ? (
              <div className="space-y-4 text-left">
                {/* Billing Address input fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Billing Address (No/Street)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                      value={billingValues.billingAddress}
                      onChange={(e) => setBillingValues({ ...billingValues, billingAddress: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Suite / Room</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                        value={billingValues.billingRoom}
                        onChange={(e) => setBillingValues({ ...billingValues, billingRoom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Billing City</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                        value={billingValues.billingCity}
                        onChange={(e) => setBillingValues({ ...billingValues, billingCity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">State</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                        value={billingValues.billingState}
                        onChange={(e) => setBillingValues({ ...billingValues, billingState: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Postal Code</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                        value={billingValues.billingZip}
                        onChange={(e) => setBillingValues({ ...billingValues, billingZip: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Country</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                        value={billingValues.billingCountry}
                        onChange={(e) => setBillingValues({ ...billingValues, billingCountry: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
                      value={billingValues.phone}
                      onChange={(e) => setBillingValues({ ...billingValues, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Secure Save Action requiring OTP Trigger */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-800 leading-normal mb-2">
                  🔒 <strong>Mandatory Security Notice:</strong> Saving updates to your formal billing address records requires multi-factor OTP verification dispatched to <strong className="text-blue-900">{dbUser.email}</strong> to prevent procurement credential fraud.
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSendBillingOtp}
                    disabled={otpLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
                  >
                    {otpLoading ? "Sending Key..." : "Verify & Save Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillingValues({
                        billingAddress: dbUser.billingAddress || "",
                        billingRoom: dbUser.billingRoom || "",
                        billingCity: dbUser.billingCity || "",
                        billingState: dbUser.billingState || "",
                        billingZip: dbUser.billingZip || "",
                        billingCountry: dbUser.billingCountry || "",
                        phone: dbUser.phone || dbUser.mobile || ""
                      });
                      setIsEditingBilling(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer transition border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2 text-left">
                {dbUser.billingAddress ? (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-2.5 font-sans">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Billing Address</span>
                      <span className="text-xs text-slate-800 font-semibold block">{dbUser.billingAddress}</span>
                      {dbUser.billingRoom && (
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">Room/Suite: {dbUser.billingRoom}</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">City / State</span>
                        <span className="text-xs text-slate-800 font-semibold">{dbUser.billingCity}, {dbUser.billingState}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">ZIP / Country</span>
                        <span className="text-xs text-slate-800 font-semibold">{dbUser.billingZip} / {dbUser.billingCountry || "US"}</span>
                      </div>
                    </div>

                    {(dbUser.phone || dbUser.mobile) && (
                      <div className="pt-2 border-t border-slate-200/40">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Secure Phone Context</span>
                        <span className="text-xs text-slate-800 font-mono">{dbUser.phone || dbUser.mobile}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400">No official billing details and address listed. Please add your credentials using the pencil icon.</p>
                  </div>
                )}

                <div className="text-slate-400 text-[11px] leading-relaxed italic">
                  Changes to educational billing addresses require quick validation to prevent procurement routing discrepancies.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* COMPONENT OTP SECURITY DIALOG */}
      {showOtpDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6.5 max-w-sm w-full shadow-xl space-y-4 text-left animate-scale-up">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                🔐 OTP VERIFICATION
              </span>
              <button
                onClick={() => {
                  setShowOtpDialog(false);
                  setOtpCode("");
                }}
                className="w-6 h-6 rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Confirm Billing Modifications</h4>
              <p className="text-xs text-slate-500 leading-normal">
                To finalize saving changes, please provide the 6-digit credential security code dispatched to your registered mailbox:
              </p>
              <p className="text-xs font-mono font-semibold text-slate-700">{dbUser.email}</p>
            </div>

            {/* Simulated environment bypass helper */}
            {otpDevPreview && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                <span className="block text-[10px] font-black text-amber-800 font-mono uppercase tracking-wider">DEV ENVIRONMENT SYSTEM OTP:</span>
                <span className="text-lg font-mono font-black text-amber-900 tracking-widest">{otpDevPreview}</span>
              </div>
            )}

            <form onSubmit={handleBillingSubmitVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-Digit Key..."
                  className="w-full text-center bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-4 py-3 text-lg font-black font-mono tracking-widest outline-none transition uppercase"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || otpCode.length !== 6}
                  className="flex-1 bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Verifying Token..." : "Confirm Security Token"}
                </button>
                <button
                  type="button"
                  onClick={handleSendBillingOtp}
                  disabled={otpLoading}
                  className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 rounded-xl text-xs font-semibold cursor-pointer transition duration-150"
                  title="Resend Code"
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
