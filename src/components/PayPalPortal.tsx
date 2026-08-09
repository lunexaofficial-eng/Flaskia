import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  X,
  Loader2,
  Info
} from "lucide-react";

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number | string;
  };
  quantity: number;
  packaging: string;
}

interface PayPalPortalProps {
  amount: number;
  cartItems: CartItem[];
  shippingDetails: {
    email: string;
    researcher: string;
    institution: string;
    licenseId: string;
    city: string;
    room: string;
    customerId?: string;
  };
  onSuccess: (details: { orderId: string; payerEmail: string; paymentId: string; otp?: string; localOrderId?: string }) => void;
  onClose: () => void;
}

export default function PayPalPortal({ amount, cartItems, shippingDetails, onSuccess, onClose }: PayPalPortalProps) {
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [isSandbox, setIsSandbox] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const localOrderIdRef = useRef<string>("");
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsInstanceRef = useRef<any>(null);

  // 1. Fetch live PayPal configuration parameters from backend
  useEffect(() => {
    let isMounted = true;
    fetch("/api/paypal/config")
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve payment config");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setPaypalEnabled(data.isEnabled);
        setIsSandbox(data.isSandbox);
        setClientId(data.clientId);
        setCurrency(data.currency || "USD");
        setLoadingConfig(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Payment configuration retrieval error:", err);
        setErrorMessage("Gateway parameters offline. Admin needs to adjust license key settings.");
        setLoadingConfig(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load the official PayPal JS SDK script dynamically
  useEffect(() => {
    if (loadingConfig || !paypalEnabled || !clientId) return;

    // Check if script already exists to avoid duplicates
    const scriptId = "paypal-js-sdk-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initButtons = () => {
      if (!window.hasOwnProperty("paypal") || !buttonContainerRef.current) return;

      // Clean up previous instance if it exists
      if (paypalButtonsInstanceRef.current) {
        try {
          paypalButtonsInstanceRef.current.close();
        } catch (e) {
          console.warn("Error closing previous PayPal buttons instance:", e);
        }
      }

      setSdkLoaded(true);
      setErrorMessage(null);

      try {
        paypalButtonsInstanceRef.current = (window as any).paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "checkout",
            tagline: false
          },
          createOrder: async () => {
            setErrorMessage(null);
            try {
              const itemsPayload = cartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                packaging: item.packaging
              }));

              const createRes = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: itemsPayload,
                  shippingDetails
                })
              });

              if (!createRes.ok) {
                const errJson = await createRes.json();
                throw new Error(errJson.error || "Order creation rejected by server.");
              }

              const orderData = await createRes.json();
              localOrderIdRef.current = orderData.orderId;
              return orderData.paypalOrderId;
            } catch (err: any) {
              setErrorMessage(err.message || "Failed to initialize PayPal order session.");
              throw err;
            }
          },
          onApprove: async (data: any, actions: any) => {
            setIsCapturing(true);
            setErrorMessage(null);

            try {
              const captureRes = await fetch("/api/paypal/capture-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                  orderId: localOrderIdRef.current
                })
              });

              if (!captureRes.ok) {
                const captureErr = await captureRes.json();
                throw new Error(captureErr.error || "Payment capturing failure.");
              }

              const captureData = await captureRes.json();
              setIsCapturing(false);

              onSuccess({
                orderId: captureData.orderId,
                payerEmail: captureData.payerEmail,
                paymentId: captureData.paymentId,
                otp: captureData.otp,
                localOrderId: captureData.localOrderId
              });
            } catch (err: any) {
              setIsCapturing(false);
              setErrorMessage(err.message || "An error occurred while capturing your transaction.");
            }
          },
          onError: (err: any) => {
            console.error("PayPal Smart Button error:", err);
            setErrorMessage("Authentication/Transaction error with the PayPal gateway. Please try again.");
          }
        });

        paypalButtonsInstanceRef.current.render(buttonContainerRef.current);
      } catch (err: any) {
        console.error("PayPal Buttons initialization error:", err);
        setErrorMessage("Could not initialize the checkout interface. Please refresh the page.");
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
      script.async = true;
      script.onload = () => {
        initButtons();
      };
      script.onerror = () => {
        setErrorMessage("Network issue. Failed to load standard secure standard PayPal assets.");
      };
      document.body.appendChild(script);
    } else {
      // Script exists, if paypal object is already present, bind buttons
      if ((window as any).paypal) {
        initButtons();
      } else {
        script.addEventListener("load", initButtons);
      }
    }

    return () => {
      // Remove event listener if script exists
      if (script) {
        script.removeEventListener("load", initButtons);
      }
    };
  }, [loadingConfig, paypalEnabled, clientId, currency, cartItems, shippingDetails]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-xs z-50 p-4 animate-fade-in font-sans">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-3xl overflow-hidden text-zinc-100 flex flex-col relative"
        id="paypal-secured-modal"
      >
        {/* Close Button */}
        <button 
          onClick={() => setShowCancelConfirm(true)}
          type="button"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer p-1 rounded-full hover:bg-zinc-800 transition z-10"
          title="Cancel Payment"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PayPal Portal Banner */}
        <div className="bg-[#002f87] px-6 py-5 flex items-center justify-between select-none border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M7.076 1.933A2.3 2.3 0 0 0 4.8 4.2h3.2c.245 0 .445.181.445.4v12.2a.4.4 0 0 1-.4.4h-2.1c.4 1 1 1.7 1.8 1.7h5.1c1.8 0 3.3-1.4 3.3-3.2v-1.1c.3 0 .6-.1.9-.3 2.1-1 3-3.6 2-5.7-1-2.1-3.6-3-5.7-2-1 .5-1.7 1.3-2 2.3v-4.1c0-1.2-1-2.2-2.3-2.2H7.076z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white italic">
              PayPal <span className="text-[#0079c1] not-italic text-sm font-semibold ml-1.5 px-2 bg-white/20 rounded-full tracking-normal">Live</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-100 font-mono">
            <Lock className="w-3 h-3 text-emerald-400 animate-pulse" />
            DIRECT GATEWAY
          </div>
        </div>

        {/* Loading client and SDK assets */}
        {loadingConfig && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <Loader2 className="w-10 h-10 animate-spin text-[#0070ba] mb-4" />
            <h3 className="text-base font-semibold text-zinc-100">Connecting Gateway Ledger...</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xs">
              Initializing payment processing pipelines & downloading certified scripts securely.
            </p>
          </div>
        )}

        {/* Capture state or progress animation */}
        {isCapturing && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6 select-none">
            <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mb-4" />
            <h3 className="text-base font-semibold text-zinc-100">Capturing Escrow Funds...</h3>
            <p className="text-xs text-zinc-400 mt-1.5 text-center leading-relaxed max-w-xs">
              Settle payment and ledger registration index of <strong className="text-zinc-200 font-mono">${amount.toFixed(2)}</strong>. Please do not close this window.
            </p>
          </div>
        )}

        {!loadingConfig && !isCapturing && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            
            {/* Amount and Merchant info */}
            <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Merchant: <strong>Flaskia Solution Hub</strong></span>
              <span className="text-sm font-bold text-zinc-200 font-mono">Total: ${amount.toFixed(2)} {currency}</span>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 mx-4 mt-4 bg-rose-950/50 border border-rose-500/30 rounded-xl text-xs text-rose-300 leading-relaxed flex gap-2.5 animate-bounce">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col justify-center min-h-[220px]">
              
              {!paypalEnabled ? (
                <div className="text-center space-y-4 p-4 border border-red-500/20 rounded-2xl bg-red-950/20">
                  <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                  <h3 className="text-sm font-bold text-red-400">Gateway Not Enabled</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    PayPal is currently disabled in your portal config. Please go to the Admin Dashboard Panel to enable PayPal and register your Client ID and client secret.
                  </p>
                </div>
              ) : !clientId ? (
                <div className="text-center space-y-4 p-4 border border-zinc-800 rounded-2xl bg-zinc-950/40">
                  <Info className="w-9 h-9 text-amber-500 mx-auto" />
                  <h3 className="text-sm font-bold text-amber-400">Credentials Missing</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed">
                    Your portal has PayPal enabled but is missing Client credentials. Register a Client ID in the admin panel to load the visual checkout portal.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-zinc-400">
                      Standard secure sandbox checkouts use legitimate PayPal assets.
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      System network handles customer credit lines and logs complete OSHA-compliant ledger trails.
                    </p>
                  </div>

                  {/* Standard Secure PayPal Smart Button Integration */}
                  <div className="min-h-[150px] flex flex-col justify-center relative">
                    {!sdkLoaded && !errorMessage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                    <div ref={buttonContainerRef} id="paypal-button-container" className="w-full relative z-0"></div>

                    {/* Secondary Cancel button */}
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full py-2 px-4 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition duration-150 text-[11px] font-semibold flex items-center justify-center gap-1.5 mt-2"
                      title="Cancel Secure Payment"
                    >
                      Cancel Secure Transaction
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Security Assurance footer */}
        <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-[10px] text-zinc-500 font-sans select-none shrink-0">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#0070ba]" />
            TLS 1.3 AES-256 Bit Encryption
          </span>
          <span>PayPal SDK v5</span>
        </div>

        {/* Cancel Confirmation Dialog Overlay Box */}
        {showCancelConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-xs z-50 p-5 animate-fadeIn">
            <div className="w-full max-w-[280px] bg-[#161618] border border-zinc-800 rounded-2xl p-5 shadow-2xl text-center space-y-4">
              <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-200">Cancel Settlement?</h3>
                <p className="text-[11px] text-zinc-450 leading-relaxed">
                  Are you sure you want to cancel this payment? Your progress will be discarded and no charges will be applied.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-750 rounded-lg text-[11px] font-medium transition"
                >
                  No, Keep
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-medium transition"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
