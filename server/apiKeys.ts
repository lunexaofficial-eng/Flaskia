/**
 * Production-Ready API Keys & Third-Party Service Integrations Module
 * Manages dynamic runtime clients for Cloudflare R2, Resend.com, BETTER_AUTH, Google Gemini AI, and PayPal
 * Loaded persistently from Neon PostgreSQL database
 */

import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Resend } from "resend";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import {
  getStoredApiKey,
  getAllStoredApiKeys,
  saveStoredApiKey,
  saveBatchStoredApiKeys,
  pool,
} from "./db.js";

// Cached client references with TTL invalidation
let cachedR2: { client: S3Client | null; bucket: string; publicUrl: string; accountId: string; endpoint: string; enabled: boolean; timestamp: number } | null = null;
let cachedResend: { client: Resend | null; fromEmail: string; domain: string; apiKey: string; enabled: boolean; timestamp: number } | null = null;
let cachedBetterAuth: { secret: string; url: string; sessionDuration: string; enabled: boolean; timestamp: number } | null = null;
let cachedGemini: { ai: GoogleGenAI | null; apiKey: string; enabled: boolean; timestamp: number } | null = null;

const CACHE_TTL_MS = 30000; // 30 seconds cache

export function invalidateApiKeysCache() {
  cachedR2 = null;
  cachedResend = null;
  cachedBetterAuth = null;
  cachedGemini = null;
}

// 1. Cloudflare R2 Dynamic S3 Client Resolver
export async function getDynamicR2Client() {
  const now = Date.now();
  if (cachedR2 && (now - cachedR2.timestamp < CACHE_TTL_MS)) {
    return cachedR2;
  }

  const accountId = await getStoredApiKey("r2_account_id", process.env.R2_ACCOUNT_ID);
  const accessKeyId = await getStoredApiKey("r2_access_key_id", process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = await getStoredApiKey("r2_secret_access_key", process.env.R2_SECRET_ACCESS_KEY);
  const bucketName = await getStoredApiKey("r2_bucket_name", process.env.R2_BUCKET_NAME || "flaskia-storage");
  const publicUrl = await getStoredApiKey("r2_public_url", process.env.R2_PUBLIC_URL || "");
  const enabledStr = await getStoredApiKey("r2_enabled", "true");
  const isEnabled = enabledStr !== "false";

  let client: S3Client | null = null;
  let endpoint = "";

  if (isEnabled && accountId && accessKeyId && secretAccessKey) {
    endpoint = `https://${accountId.trim()}.r2.cloudflarestorage.com`;
    try {
      client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId: accessKeyId.trim(),
          secretAccessKey: secretAccessKey.trim(),
        },
      });
    } catch (err) {
      console.error("[R2 Client Init Error]:", err);
      client = null;
    }
  }

  cachedR2 = {
    client,
    bucket: (bucketName || "").trim(),
    publicUrl: (publicUrl || "").trim(),
    accountId: (accountId || "").trim(),
    endpoint,
    enabled: isEnabled,
    timestamp: now,
  };

  return cachedR2;
}

// 2. Resend.com Dynamic Client Resolver
export async function getDynamicResendClient() {
  const now = Date.now();
  if (cachedResend && (now - cachedResend.timestamp < CACHE_TTL_MS)) {
    return cachedResend;
  }

  const apiKey = await getStoredApiKey("resend_api_key", process.env.RESEND_API_KEY);
  const domain = await getStoredApiKey("resend_domain", "flaskia.com");
  const fromEmail = await getStoredApiKey(
    "resend_from_email",
    process.env.RESEND_FROM_EMAIL || `Flaskia Marketplace <noreply@${domain || "flaskia.com"}>`
  );
  const enabledStr = await getStoredApiKey("resend_enabled", "true");
  const isEnabled = enabledStr !== "false";

  let client: Resend | null = null;
  const cleanKey = (apiKey || "").trim();

  if (isEnabled && cleanKey && (cleanKey.startsWith("re_") || cleanKey.length > 10)) {
    try {
      client = new Resend(cleanKey);
    } catch (err) {
      console.error("[Resend Client Init Error]:", err);
      client = null;
    }
  }

  cachedResend = {
    client,
    fromEmail: (fromEmail || `Flaskia Marketplace <noreply@${domain || "flaskia.com"}>`).trim(),
    domain: (domain || "flaskia.com").trim(),
    apiKey: cleanKey,
    enabled: isEnabled,
    timestamp: now,
  };

  return cachedResend;
}

// 3. BETTER_AUTH & JWT Dynamic Config Resolver
export async function getDynamicBetterAuthConfig() {
  const now = Date.now();
  if (cachedBetterAuth && (now - cachedBetterAuth.timestamp < CACHE_TTL_MS)) {
    return cachedBetterAuth;
  }

  const secret = await getStoredApiKey(
    "better_auth_secret",
    process.env.BETTER_AUTH_SECRET || "flaskia_better_auth_production_secret_key_2026_matrix"
  );
  const url = await getStoredApiKey(
    "better_auth_url",
    process.env.BETTER_AUTH_URL || "https://ais-dev-drrzqjsllss3kzhvvx4a35-646852900977.asia-east1.run.app"
  );
  const sessionDuration = await getStoredApiKey("better_auth_session_duration", "7d");
  const enabledStr = await getStoredApiKey("better_auth_enabled", "true");

  cachedBetterAuth = {
    secret: (secret || "flaskia_better_auth_production_secret_key_2026_matrix").trim(),
    url: (url || "").trim(),
    sessionDuration: (sessionDuration || "7d").trim(),
    enabled: enabledStr !== "false",
    timestamp: now,
  };

  return cachedBetterAuth;
}

// 4. Google Gemini Dynamic Client Resolver
export async function getDynamicGeminiClient() {
  const now = Date.now();
  if (cachedGemini && (now - cachedGemini.timestamp < CACHE_TTL_MS)) {
    return cachedGemini;
  }

  const apiKey = await getStoredApiKey(
    "gemini_api_key",
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
      ? process.env.GEMINI_API_KEY
      : ""
  );
  const enabledStr = await getStoredApiKey("gemini_enabled", "true");
  const isEnabled = enabledStr !== "false";

  let ai: GoogleGenAI | null = null;
  const cleanKey = (apiKey || "").trim();

  if (isEnabled && cleanKey && cleanKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: cleanKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" },
        },
      });
    } catch (err) {
      console.error("[Gemini Client Init Error]:", err);
      ai = null;
    }
  }

  cachedGemini = {
    ai,
    apiKey: cleanKey,
    enabled: isEnabled,
    timestamp: now,
  };

  return cachedGemini;
}

// --- PRODUCTION TEST FUNCTIONS ---

// Test Cloudflare R2 Connection
export async function testR2Connection(params?: {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  r2_account_id?: string;
  r2_access_key_id?: string;
  r2_secret_access_key?: string;
  r2_bucket_name?: string;
}) {
  const startTime = Date.now();
  try {
    let accountId = params?.accountId || params?.r2_account_id;
    let accessKeyId = params?.accessKeyId || params?.r2_access_key_id;
    let secretAccessKey = params?.secretAccessKey || params?.r2_secret_access_key;
    let bucketName = params?.bucketName || params?.r2_bucket_name;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      const active = await getDynamicR2Client();
      accountId = accountId || active.accountId;
      bucketName = bucketName || active.bucket;
      if (!accountId || !bucketName) {
        return {
          success: false,
          status: "unconfigured",
          message: "Cloudflare R2 Account ID, Access Key ID, Secret Access Key, and Bucket Name are required.",
          latency: "0ms",
          latencyMs: 0,
        };
      }
      accessKeyId = accessKeyId || (await getStoredApiKey("r2_access_key_id", process.env.R2_ACCESS_KEY_ID));
      secretAccessKey = secretAccessKey || (await getStoredApiKey("r2_secret_access_key", process.env.R2_SECRET_ACCESS_KEY));
    }

    if (!accessKeyId || !secretAccessKey) {
      return {
        success: false,
        status: "unconfigured",
        message: "Cloudflare R2 Access Key ID and Secret Access Key are required.",
        latency: "0ms",
        latencyMs: 0,
      };
    }

    const endpoint = `https://${accountId.trim()}.r2.cloudflarestorage.com`;
    const testClient = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      },
    });

    const listCmd = new ListObjectsV2Command({
      Bucket: bucketName.trim(),
      MaxKeys: 5,
    });

    const response = await testClient.send(listCmd);
    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      status: "connected",
      message: `Cloudflare R2 bucket "${bucketName.trim()}" connected (${response.KeyCount || 0} objects inspected).`,
      bucket: bucketName.trim(),
      objectCount: response.KeyCount || 0,
      endpoint,
      latency: `${latencyMs}ms`,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.error("Cloudflare R2 Test Connection Error:", err);
    return {
      success: false,
      status: "error",
      message: err.message || "Failed to connect to Cloudflare R2 bucket.",
      errorDetails: err.name || "S3Error",
      latency: `${latencyMs}ms`,
      latencyMs,
    };
  }
}

// Test Resend Connection / Send Test Email
export async function testResendConnection(params?: {
  apiKey?: string;
  fromEmail?: string;
  targetEmail?: string;
  domain?: string;
  resend_api_key?: string;
  resend_from_email?: string;
  resend_domain?: string;
  testRecipient?: string;
}) {
  const startTime = Date.now();
  try {
    let apiKey = params?.apiKey || params?.resend_api_key;
    let fromEmail = params?.fromEmail || params?.resend_from_email;
    let domain = params?.domain || params?.resend_domain;
    const targetEmail = params?.targetEmail || params?.testRecipient || "matrixgyan0786@gmail.com";

    if (!apiKey) {
      const active = await getDynamicResendClient();
      apiKey = active.apiKey;
      fromEmail = fromEmail || active.fromEmail;
      domain = domain || active.domain;
    }

    if (!apiKey || !apiKey.trim()) {
      return {
        success: false,
        status: "unconfigured",
        message: "Resend API Key is required (starts with 're_').",
        latency: "0ms",
        latencyMs: 0,
      };
    }

    const cleanKey = apiKey.trim();
    const testResend = new Resend(cleanKey);
    const cleanFrom = (fromEmail || `Flaskia Marketplace <noreply@${domain || "flaskia.com"}>`).trim();

    // Send a real verification email via Resend
    const sendResult = await testResend.emails.send({
      from: cleanFrom,
      to: [targetEmail],
      subject: `Resend Domain & Email Delivery Verification`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 24px;">
          <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 18px;">Resend Email Delivery Active</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              Your Resend.com API key and verified sending domain (<strong>${domain || "configured domain"}</strong>) are connected and delivering emails.
            </p>
            <div style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #334155;">
              From: ${cleanFrom}<br/>
              To: ${targetEmail}<br/>
              Time: ${new Date().toUTCString()}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    const latencyMs = Date.now() - startTime;

    if (sendResult.error) {
      return {
        success: false,
        status: "error",
        message: `Resend Error: ${sendResult.error.message}`,
        error: sendResult.error,
        latency: `${latencyMs}ms`,
        latencyMs,
      };
    }

    return {
      success: true,
      status: "connected",
      message: `Test email sent via Resend to ${targetEmail} (ID: ${sendResult.data?.id}).`,
      messageId: sendResult.data?.id,
      sender: cleanFrom,
      recipient: targetEmail,
      latency: `${latencyMs}ms`,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.error("Resend Test Connection Error:", err);
    return {
      success: false,
      status: "error",
      message: err.message || "Failed to communicate with Resend.com API.",
      latency: `${latencyMs}ms`,
      latencyMs,
    };
  }
}

// Test Google Gemini Connection
export async function testGeminiConnection(apiKey?: string, model?: string) {
  const startTime = Date.now();
  try {
    let key = apiKey;
    let targetModel = model || "gemini-2.5-flash";
    if (!key) {
      const active = await getDynamicGeminiClient();
      key = active.apiKey;
    }

    if (!key || key === "MY_GEMINI_API_KEY") {
      return {
        success: false,
        status: "unconfigured",
        message: "Gemini API Key is not configured.",
        latencyMs: 0,
      };
    }

    const testAi = new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });

    const response = await testAi.models.generateContent({
      model: targetModel,
      contents: "Hello! Reply with 'OK - Gemini AI is operational.' in 1 sentence.",
    });

    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      status: "connected",
      message: response.text || "Gemini AI responded successfully.",
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      status: "error",
      message: err.message || "Failed to generate content with Gemini AI.",
      latencyMs,
    };
  }
}

// Generate Secure Cryptographic Random Key (for BETTER_AUTH_SECRET or JWT_SECRET)
export function generateSecureSecret(byteLength: number = 32): { hex: string; base64: string } {
  const bytes = crypto.randomBytes(byteLength);
  return {
    hex: bytes.toString("hex"),
    base64: bytes.toString("base64"),
  };
}
