import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Cloud,
  Mail,
  Lock,
  Sparkles,
  CreditCard,
  ExternalLink,
  Send,
  Sliders,
  Save,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Check,
} from "lucide-react";

interface ApiKeysManagementProps {
  token: string;
  onRefreshParent?: () => void;
}

export interface SystemApiKeys {
  // Cloudflare R2
  r2_account_id?: string;
  r2_access_key_id?: string;
  r2_secret_access_key?: string;
  r2_bucket_name?: string;
  r2_public_url?: string;
  r2_endpoint?: string;
  r2_enabled?: boolean;

  // Resend.com
  resend_api_key?: string;
  resend_domain?: string;
  resend_from_email?: string;
  resend_enabled?: boolean;

  // Better Auth
  better_auth_secret?: string;
  better_auth_url?: string;
  better_auth_session_duration?: string;
  better_auth_enabled?: boolean;

  // Gemini AI
  gemini_api_key?: string;
  gemini_model?: string;
  gemini_enabled?: boolean;

  // PayPal
  paypal_client_id?: string;
  paypal_client_secret?: string;
  paypal_mode?: string;
  paypal_currency?: string;
  paypal_enabled?: boolean;
}

interface ResendDomainItem {
  id: string;
  name: string;
  status: string;
  region?: string;
  created_at?: string;
}

export const ApiKeysManagement: React.FC<ApiKeysManagementProps> = ({
  token,
  onRefreshParent,
}) => {
  const [keys, setKeys] = useState<SystemApiKeys>({
    r2_account_id: "",
    r2_access_key_id: "",
    r2_secret_access_key: "",
    r2_bucket_name: "flaskia-files",
    r2_public_url: "",
    r2_endpoint: "",
    r2_enabled: true,

    resend_api_key: "",
    resend_domain: "",
    resend_from_email: "Flaskia Marketplace <noreply@flaskia.com>",
    resend_enabled: true,

    better_auth_secret: "",
    better_auth_url: typeof window !== "undefined" ? window.location.origin : "",
    better_auth_session_duration: "604800",
    better_auth_enabled: true,

    gemini_api_key: "",
    gemini_model: "gemini-2.5-flash",
    gemini_enabled: true,

    paypal_client_id: "",
    paypal_client_secret: "",
    paypal_mode: "sandbox",
    paypal_currency: "USD",
    paypal_enabled: false,
  });

  const [activeSection, setActiveSection] = useState<
    "all" | "r2" | "resend" | "better_auth" | "gemini" | "paypal"
  >("all");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [revealedKeys, setRevealedKeys] = useState<{ [field: string]: boolean }>({});

  const [testingService, setTestingService] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    [service: string]: {
      success: boolean;
      message: string;
      latency?: string;
      timestamp: number;
    };
  }>({});

  const [testEmailRecipient, setTestEmailRecipient] = useState<string>("");

  // Live Resend Domains State
  const [resendDomains, setResendDomains] = useState<ResendDomainItem[]>([]);
  const [loadingDomains, setLoadingDomains] = useState<boolean>(false);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);
  const [domainsError, setDomainsError] = useState<string>("");

  const getAuthToken = () =>
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lunexa_admin_token") || ""
      : "");

  const loadApiKeys = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/api-keys", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load API keys (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (data.keys && typeof data.keys === "object" && !Array.isArray(data.keys)) {
        setKeys((prev) => ({
          ...prev,
          ...data.keys,
          better_auth_url:
            data.keys.better_auth_url ||
            (typeof window !== "undefined" ? window.location.origin : ""),
        }));
      }
    } catch (err: any) {
      console.error("Error loading API keys:", err);
      setErrorMessage(err.message || "Failed to load keys configuration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const toggleReveal = (field: string) => {
    setRevealedKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleGenerateAuthSecret = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const secret = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setKeys((prev) => ({ ...prev, better_auth_secret: secret }));
    setRevealedKeys((prev) => ({ ...prev, better_auth_secret: true }));
  };

  const handleSaveKeys = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(keys),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Save failed with status ${res.status}`,
        );
      }

      const data = await res.json();
      if (data.keys && typeof data.keys === "object" && !Array.isArray(data.keys)) {
        setKeys((prev) => ({ ...prev, ...data.keys }));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Failed to save API keys configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchResendDomains = async () => {
    setLoadingDomains(true);
    setDomainsError("");
    try {
      const query = keys.resend_api_key
        ? `?apiKey=${encodeURIComponent(keys.resend_api_key.trim())}`
        : "";
      const res = await fetch(`/api/admin/api-keys/resend-domains${query}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to fetch domains from Resend");
      }
      setResendDomains(data.domains || []);
      if (data.domains && data.domains.length > 0 && !keys.resend_domain) {
        const verified = data.domains.find((d: ResendDomainItem) => d.status === "verified") || data.domains[0];
        if (verified?.name) {
          setKeys((prev) => ({
            ...prev,
            resend_domain: verified.name,
            resend_from_email:
              prev.resend_from_email && !prev.resend_from_email.includes("flaskia.com")
                ? prev.resend_from_email
                : `Flaskia Marketplace <noreply@${verified.name}>`,
          }));
        }
      }
    } catch (err: any) {
      setDomainsError(err.message || "Error loading domains from Resend");
    } finally {
      setLoadingDomains(false);
    }
  };

  const handleVerifyResendDomain = async (domainId: string) => {
    setVerifyingDomainId(domainId);
    setDomainsError("");
    try {
      const res = await fetch("/api/admin/api-keys/resend-domains/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          domainId,
          apiKey: keys.resend_api_key?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Domain verification failed");
      }
      await handleFetchResendDomains();
    } catch (err: any) {
      setDomainsError(err.message || "Error verifying domain");
    } finally {
      setVerifyingDomainId(null);
    }
  };

  const handleTestR2 = async () => {
    setTestingService("r2");
    try {
      const res = await fetch("/api/admin/api-keys/test/r2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          r2_account_id: keys.r2_account_id,
          r2_access_key_id: keys.r2_access_key_id,
          r2_secret_access_key: keys.r2_secret_access_key,
          r2_bucket_name: keys.r2_bucket_name,
          r2_public_url: keys.r2_public_url,
          r2_endpoint: keys.r2_endpoint,
        }),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        r2: {
          success: res.ok && data.success,
          message:
            data.message ||
            (res.ok ? "Cloudflare R2 bucket connected" : data.error || "Connection failed"),
          latency: data.latency,
          timestamp: Date.now(),
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        r2: {
          success: false,
          message: err.message || "Network error while validating R2",
          timestamp: Date.now(),
        },
      }));
    } finally {
      setTestingService(null);
    }
  };

  const handleTestResend = async () => {
    setTestingService("resend");
    try {
      const res = await fetch("/api/admin/api-keys/test/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          resend_api_key: keys.resend_api_key,
          resend_domain: keys.resend_domain,
          resend_from_email: keys.resend_from_email,
          testRecipient: testEmailRecipient.trim() || undefined,
        }),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        resend: {
          success: res.ok && data.success,
          message:
            data.message ||
            (res.ok ? "Resend API authenticated" : data.error || "Authentication failed"),
          latency: data.latency,
          timestamp: Date.now(),
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        resend: {
          success: false,
          message: err.message || "Network error while validating Resend",
          timestamp: Date.now(),
        },
      }));
    } finally {
      setTestingService(null);
    }
  };

  const handleTestBetterAuth = async () => {
    setTestingService("better_auth");
    try {
      const res = await fetch("/api/admin/api-keys/test/better-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          better_auth_secret: keys.better_auth_secret,
          better_auth_url: keys.better_auth_url,
          better_auth_session_duration: keys.better_auth_session_duration,
        }),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        better_auth: {
          success: res.ok && data.success,
          message:
            data.message ||
            (res.ok ? "BETTER_AUTH signing verified" : data.error || "Secret validation failed"),
          latency: data.latency,
          timestamp: Date.now(),
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        better_auth: {
          success: false,
          message: err.message || "Error validating Better Auth secret",
          timestamp: Date.now(),
        },
      }));
    } finally {
      setTestingService(null);
    }
  };

  const handleTestGemini = async () => {
    setTestingService("gemini");
    try {
      const res = await fetch("/api/admin/api-keys/test/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          gemini_api_key: keys.gemini_api_key,
          gemini_model: keys.gemini_model,
        }),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        gemini: {
          success: res.ok && data.success,
          message:
            data.message ||
            (res.ok ? "Gemini API verified" : data.error || "Verification failed"),
          latency: data.latency,
          timestamp: Date.now(),
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        gemini: {
          success: false,
          message: err.message || "Error testing Gemini API",
          timestamp: Date.now(),
        },
      }));
    } finally {
      setTestingService(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Clean Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white tracking-tight font-heading">
              Keys & Integrations Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Manage Cloudflare R2 object storage, Resend.com email keys & verified domains, authentication signing secrets, and payment credentials directly in PostgreSQL without editing environment variables.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadApiKeys}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => handleSaveKeys()}
            disabled={isSaving}
            className="px-5 py-2 bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold rounded-xl cursor-pointer transition flex items-center gap-2"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Keys
          </button>
        </div>
      </div>

      {/* Feedback Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Keys saved to Neon PostgreSQL and active service clients updated immediately.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-mono">{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-3">
        {[
          { id: "all", label: "All Keys", icon: Sliders },
          { id: "r2", label: "Cloudflare R2", icon: Cloud },
          { id: "resend", label: "Resend & Domains", icon: Mail },
          { id: "better_auth", label: "Auth Secret", icon: Lock },
          { id: "gemini", label: "Gemini AI", icon: Sparkles },
          { id: "paypal", label: "PayPal", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-[#0052cc] text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. CLOUDFLARE R2 STORAGE */}
      {(activeSection === "all" || activeSection === "r2") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white font-heading">
                  Cloudflare R2 Keys Management
                </h3>
                <p className="text-xs text-slate-400">
                  S3-compatible object storage for product images, gallery assets, SDS PDFs, and payment receipts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={keys.r2_enabled !== false}
                  onChange={(e) =>
                    setKeys((prev) => ({ ...prev, r2_enabled: e.target.checked }))
                  }
                  className="accent-[#0052cc] rounded size-3.5"
                />
                <span>Enabled</span>
              </label>

              <button
                type="button"
                onClick={handleTestR2}
                disabled={testingService === "r2"}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 transition"
              >
                {testingService === "r2" ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {testResults.r2 && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                testResults.r2.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResults.r2.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-mono">{testResults.r2.message}</span>
              </div>
              {testResults.r2.latency && (
                <span className="text-[11px] font-mono text-slate-400">
                  {testResults.r2.latency}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Cloudflare Account ID
              </label>
              <input
                type="text"
                value={keys.r2_account_id || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, r2_account_id: e.target.value }))
                }
                placeholder="e.g. 7f8b2c45d67e89..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Bucket Name
              </label>
              <input
                type="text"
                value={keys.r2_bucket_name || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, r2_bucket_name: e.target.value }))
                }
                placeholder="flaskia-files"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Public Domain / Bucket URL
              </label>
              <input
                type="text"
                value={keys.r2_public_url || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, r2_public_url: e.target.value }))
                }
                placeholder="https://pub-xxxx.r2.dev or https://cdn.domain.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Access Key ID
                </label>
                <button
                  type="button"
                  onClick={() => toggleReveal("r2_access_key_id")}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {revealedKeys["r2_access_key_id"] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {revealedKeys["r2_access_key_id"] ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={revealedKeys["r2_access_key_id"] ? "text" : "password"}
                value={keys.r2_access_key_id || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    r2_access_key_id: e.target.value,
                  }))
                }
                placeholder="R2 Access Key ID"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Secret Access Key
                </label>
                <button
                  type="button"
                  onClick={() => toggleReveal("r2_secret_access_key")}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {revealedKeys["r2_secret_access_key"] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {revealedKeys["r2_secret_access_key"] ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={revealedKeys["r2_secret_access_key"] ? "text" : "password"}
                value={keys.r2_secret_access_key || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    r2_secret_access_key: e.target.value,
                  }))
                }
                placeholder="R2 Secret Access Key"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-mono">
              S3 Endpoint: https://{keys.r2_account_id || "<account_id>"}.r2.cloudflarestorage.com
            </span>
            <a
              href="https://dash.cloudflare.com/?to=/:account/r2/api-tokens"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Cloudflare R2 API Tokens</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. RESEND.COM KEYS & VERIFIED DOMAIN MANAGEMENT */}
      {(activeSection === "all" || activeSection === "resend") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white font-heading">
                  Resend.com Keys & Verified Domain Management
                </h3>
                <p className="text-xs text-slate-400">
                  Transactional email delivery for login OTPs, order confirmations, and B2B quotation replies.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={keys.resend_enabled !== false}
                  onChange={(e) =>
                    setKeys((prev) => ({
                      ...prev,
                      resend_enabled: e.target.checked,
                    }))
                  }
                  className="accent-[#0052cc] rounded size-3.5"
                />
                <span>Enabled</span>
              </label>

              <button
                type="button"
                onClick={handleFetchResendDomains}
                disabled={loadingDomains}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 transition"
              >
                <Globe className={`w-3.5 h-3.5 text-cyan-400 ${loadingDomains ? "animate-spin" : ""}`} />
                <span>Sync Domains</span>
              </button>
            </div>
          </div>

          {testResults.resend && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                testResults.resend.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResults.resend.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-mono">{testResults.resend.message}</span>
              </div>
              {testResults.resend.latency && (
                <span className="text-[11px] font-mono text-slate-400">
                  {testResults.resend.latency}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Resend API Key
                </label>
                <button
                  type="button"
                  onClick={() => toggleReveal("resend_api_key")}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {revealedKeys["resend_api_key"] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {revealedKeys["resend_api_key"] ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={revealedKeys["resend_api_key"] ? "text" : "password"}
                value={keys.resend_api_key || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, resend_api_key: e.target.value }))
                }
                placeholder="re_123456789..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Verified Sending Domain
              </label>
              <input
                type="text"
                value={keys.resend_domain || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, resend_domain: e.target.value }))
                }
                placeholder="e.g. mail.yourdomain.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Default Sender "From" Address
              </label>
              <input
                type="text"
                value={keys.resend_from_email || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    resend_from_email: e.target.value,
                  }))
                }
                placeholder="Company Name <noreply@yourdomain.com>"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Live Resend Verified Domains List */}
          {(resendDomains.length > 0 || domainsError) && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Resend Account Domains
                </span>
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Manage DNS in Resend</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {domainsError && (
                <p className="text-xs text-rose-400 font-mono">{domainsError}</p>
              )}

              {resendDomains.length > 0 && (
                <div className="divide-y divide-slate-800/80">
                  {resendDomains.map((dom) => {
                    const isSelected = keys.resend_domain === dom.name;
                    return (
                      <div
                        key={dom.id}
                        className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-white font-medium">
                            {dom.name}
                          </span>
                          <span
                            className={`text-[11px] font-mono ${
                              dom.status === "verified"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            ({dom.status})
                          </span>
                          {dom.region && (
                            <span className="text-slate-500 font-mono text-[11px]">
                              {dom.region}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {dom.status !== "verified" && (
                            <button
                              type="button"
                              onClick={() => handleVerifyResendDomain(dom.id)}
                              disabled={verifyingDomainId === dom.id}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] cursor-pointer"
                            >
                              {verifyingDomainId === dom.id
                                ? "Verifying..."
                                : "Verify DNS"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setKeys((prev) => ({
                                ...prev,
                                resend_domain: dom.name,
                                resend_from_email: `Flaskia Marketplace <noreply@${dom.name}>`,
                              }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition ${
                              isSelected
                                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                            }`}
                          >
                            {isSelected ? "Active Domain" : "Use Domain"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Live Test Email Bar */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              placeholder="Enter recipient email to test live delivery..."
              value={testEmailRecipient}
              onChange={(e) => setTestEmailRecipient(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="button"
              onClick={handleTestResend}
              disabled={testingService === "resend"}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {testingService === "resend" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>Send Test Email</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. BETTER_AUTH SECRET & BASE URL */}
      {(activeSection === "all" || activeSection === "better_auth") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white font-heading">
                  Authentication Secret & Base URL
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographic signing secret for session tokens and role-based access control.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleTestBetterAuth}
                disabled={testingService === "better_auth"}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 transition"
              >
                {testingService === "better_auth" ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                )}
                <span>Validate Secret</span>
              </button>
            </div>
          </div>

          {testResults.better_auth && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                testResults.better_auth.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResults.better_auth.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-mono">{testResults.better_auth.message}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  BETTER_AUTH_SECRET
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateAuthSecret}
                    className="text-blue-400 hover:text-blue-300 text-[11px] font-medium cursor-pointer"
                  >
                    Generate 32-Byte Secret
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReveal("better_auth_secret")}
                    className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {revealedKeys["better_auth_secret"] ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    {revealedKeys["better_auth_secret"] ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <input
                type={revealedKeys["better_auth_secret"] ? "text" : "password"}
                value={keys.better_auth_secret || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    better_auth_secret: e.target.value,
                  }))
                }
                placeholder="64-character hex signing key"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                BETTER_AUTH_URL
              </label>
              <input
                type="text"
                value={keys.better_auth_url || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    better_auth_url: e.target.value,
                  }))
                }
                placeholder="https://yourdomain.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. GOOGLE GEMINI AI */}
      {(activeSection === "all" || activeSection === "gemini") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white font-heading">
                  Google Gemini API Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Used for automated chemical safety data sheet (SDS) and catalog specification assistance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={keys.gemini_enabled !== false}
                  onChange={(e) =>
                    setKeys((prev) => ({
                      ...prev,
                      gemini_enabled: e.target.checked,
                    }))
                  }
                  className="accent-[#0052cc] rounded size-3.5"
                />
                <span>Enabled</span>
              </label>

              <button
                type="button"
                onClick={handleTestGemini}
                disabled={testingService === "gemini"}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 transition"
              >
                {testingService === "gemini" ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>Test Key</span>
              </button>
            </div>
          </div>

          {testResults.gemini && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                testResults.gemini.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResults.gemini.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-mono">{testResults.gemini.message}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Gemini API Key
                </label>
                <button
                  type="button"
                  onClick={() => toggleReveal("gemini_api_key")}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {revealedKeys["gemini_api_key"] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {revealedKeys["gemini_api_key"] ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={revealedKeys["gemini_api_key"] ? "text" : "password"}
                value={keys.gemini_api_key || ""}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, gemini_api_key: e.target.value }))
                }
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Model
              </label>
              <select
                value={keys.gemini_model || "gemini-2.5-flash"}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, gemini_model: e.target.value }))
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAYPAL CHECKOUT CREDENTIALS */}
      {(activeSection === "all" || activeSection === "paypal") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white font-heading">
                  PayPal Checkout Credentials
                </h3>
                <p className="text-xs text-slate-400">
                  Client ID and Secret for processing online PayPal orders.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={keys.paypal_enabled === true}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    paypal_enabled: e.target.checked,
                  }))
                }
                className="accent-[#0052cc] rounded size-3.5"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Client ID
              </label>
              <input
                type="text"
                value={keys.paypal_client_id || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    paypal_client_id: e.target.value,
                  }))
                }
                placeholder="PayPal Client ID"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Client Secret
                </label>
                <button
                  type="button"
                  onClick={() => toggleReveal("paypal_client_secret")}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {revealedKeys["paypal_client_secret"] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {revealedKeys["paypal_client_secret"] ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={revealedKeys["paypal_client_secret"] ? "text" : "password"}
                value={keys.paypal_client_secret || ""}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    paypal_client_secret: e.target.value,
                  }))
                }
                placeholder="PayPal Client Secret"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Environment
              </label>
              <select
                value={keys.paypal_mode || "sandbox"}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, paypal_mode: e.target.value }))
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              >
                <option value="sandbox">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Currency
              </label>
              <input
                type="text"
                value={keys.paypal_currency || "USD"}
                onChange={(e) =>
                  setKeys((prev) => ({
                    ...prev,
                    paypal_currency: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="USD"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
          </div>
        </div>
      )}

      {/* Clean Save Footer */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-400">
          All credentials are saved in Neon PostgreSQL and applied immediately without restarting the server.
        </span>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadApiKeys}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleSaveKeys()}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-5 py-2 bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold rounded-xl cursor-pointer transition flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Save All Keys</span>
          </button>
        </div>
      </div>
    </div>
  );
};
