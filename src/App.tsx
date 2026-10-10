/**
 * Developed by MOHAMMAD NURULLAH
 * The Founder of OMYRA TECHNOLOGIES
 * Contact email: contact@omyra.org
 * Secondary email: matrixgyan0786@gmail.com
 * OMYRA ECOSYSTEM URL: www.omyra.org
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import CheckoutPage, { CartItem, getLedgerConfig } from "./components/CheckoutPage";
import OrdersHub, { Order } from "./components/OrdersHub";
import AdminPanel from "./components/AdminPanel";
import HelpFaq from "./components/HelpFaq";
import CompanyPolicies, { PolicyTab } from "./components/CompanyPolicies";
import { PRODUCTS, Product } from "./data";
import CustomerAuth from "./components/CustomerAuth";
import UserProfile from "./components/UserProfile";
import MyInquiriesHub from "./components/MyInquiriesHub";
import CheckoutPromptModal from "./components/CheckoutPromptModal";
import IndiamartInquiryModal from "./components/IndiamartInquiryModal";
import { useTheme } from "./context/ThemeContext";
import { getProxiedImageUrl } from "./utils/imageUtils";
import { 
  FlaskConical, 
  FlaskConicalOff, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  MapPin, 
  CheckCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Award,
  Activity,
  ShieldCheck,
  Globe,
  Cpu,
  Beaker,
  Heart,
  MessageCircle,
  Building2,
  Zap,
  Send,
  FileText,
  Truck,
  Lock
} from "lucide-react";

export default function App() {
  const { isRetail, isIndiamart } = useTheme();
  const isNoCartAuthTheme = isRetail || isIndiamart;
  const [currentView, setCurrentView] = useState<"store" | "product" | "checkout" | "orders" | "inquiries" | "admin" | "policies" | "profile">("store");
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyTab>("about");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // States for Hero Section Quick RFQ Form
  const [heroRfqProduct, setHeroRfqProduct] = useState<string>("Sulfuric Acid 98% ACS Grade");
  const [heroRfqQty, setHeroRfqQty] = useState<string>("25 Packs");
  const [heroRfqPhone, setHeroRfqPhone] = useState<string>("");
  const [heroRfqSubmitted, setHeroRfqSubmitted] = useState<boolean>(false);
  const [heroRfqLoading, setHeroRfqLoading] = useState<boolean>(false);

  const handleHeroRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroRfqPhone) return;
    setHeroRfqLoading(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: heroRfqProduct,
          quantity: heroRfqQty,
          packaging_type: "Wholesale Drums / Containers",
          buyer_name: "B2B Wholesale Visitor",
          buyer_phone: heroRfqPhone,
          buyer_email: "rfq@wholesale.lead",
          message: `Direct B2B Quote Request from Hero Section: Requested wholesale pricing for ${heroRfqQty} of ${heroRfqProduct}. Contact Phone: ${heroRfqPhone}`,
        }),
      });
      setHeroRfqSubmitted(true);
    } catch (err) {
      console.error("Hero RFQ submission error:", err);
    } finally {
      setHeroRfqLoading(false);
    }
  };
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [appProducts, setAppProducts] = useState<Product[]>([]);
  const [appCategories, setAppCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.ok ? res.json() : [])
      .then(data => setAppCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
    
    fetch("/api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAppProducts(data);
        } else {
          setAppProducts(PRODUCTS); // Fallback to local data
        }
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setAppProducts(PRODUCTS);
      });
  }, [currentView]);

  // States for the beautiful catalog checkout prompt popup
  const [addedProductForCheckoutModal, setAddedProductForCheckoutModal] = useState<Product | null>(null);
  const [showCheckoutModalPrompt, setShowCheckoutModalPrompt] = useState<boolean>(false);
  const [modalQty, setModalQty] = useState<number>(1);
  const [modalPackaging, setModalPackaging] = useState<string>("Glass Lab Bottle");

  // GHS unified user state matching downstream layout
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load local customer user state from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem("flaskia_customer_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved customer session:", e);
      }
    }
    setAuthLoading(false);
  }, []);

  const handleSetUser = (user: any) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("flaskia_customer_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("flaskia_customer_user");
    }
  };

  // Synchronize orders with private database under GHS compliance isolation
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.uid;
    if (userId) {
      fetch(`/api/customers/${userId}/orders`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch customer orders from database: " + res.statusText);
          }
          return res.json();
        })
        .then((ords) => {
          setOrders(ords);
        })
        .catch((err) => {
          console.error("PostgreSQL sync orders failure:", err);
        });
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    handleSetUser(null);
    setCurrentView("store");
  };

  // Dynamic editable homepage configurations
  const [homepageConfig, setHomepageConfig] = useState({
    heroTag: "FDA & OSHA GHS-KONFORME BESCHAFFUNG",
    heroTitle: "Hochreine Laborreagenzien & Chemikalienbedarf",
    heroDescription: "Flaskia vertreibt analytische Chemikalien, Pufferlösungen und zertifizierte Borosilikat-Glaswaren der Klasse A für akademische Synthese, Forschungsmodellierung und Laboratorien.",
    heroStat1Value: "≤18 MΩ·cm",
    heroStat1Label: "Leitfähigkeitsstandard",
    heroStat2Value: "100%",
    heroStat2Label: "SDB / GHS-Dokumentation",
    heroImageUrl: "/src/assets/images/chemical_hero_banner_1780924768442.png",
    heroImageAlt: "Hochreines Forschungslabor für Chemie",
    heroWatermarkTitle: "CHEMLABS REAGENZIENZELLE",
    heroWatermarkBadge: "Geprüftes Portal",
    complianceBtnText: "Sicherheits- & FAQ-Handbuch öffnen",
    complianceEmoji: "🔐",
    complianceTitle: "GHS-Konformitätsgarantie:",
    complianceText: "Flaskia überwacht Sicherheitsprofile kontinuierlich. Unsere Sicherheitsdokumentation entspricht internationalen Chemiestandards.",
    
    // Brand identity defaults
    appName: "Flaskia",
    appBrandBadge: "PRO",
    appSubtitle: "Chemikalien & Forschungslösungen",
    appLogoIcon: "FlaskConical",
    appLogoUrl: "",
    footerLogoUrl: "",
    appFaviconUrl: "https://img.icons8.com/color/48/chemistry.png",
    admin_url_path: "/lunexa_official",
    adminWhatsappNumber: "15099941048",
    
    // Complete adaptive footer defaults
    footerCompanyName: "Flaskia Supplies International Co.",
    footerLicence1: "OSHA ID: 44321-REAG",
    footerLicence2: "EPA LICENSE: 7385-CHEM",
    footerLicence3: "DOT TRANSPORT: CLASS 9",
    footerCopyright: "Flaskia Supplies International Co. Alle Rechte vorbehalten."
  });

  const loadHomepageConfig = () => {
    fetch("/api/homepage")
      .then(res => {
        if (!res.ok) throw new Error("HTTP failure");
        return res.json();
      })
      .then(data => {
        if (data && typeof data === "object") {
          setHomepageConfig(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => {
        console.warn("Could not retrieve latest homepage config, using local state defaults", err);
      });
  };

  // Inquiry Modal State & Handler
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryDefaultQty, setInquiryDefaultQty] = useState(1);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInquiriesList(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleOpenInquiry = (product: Product, quantity: number = 1) => {
    setInquiryProduct(product);
    setInquiryDefaultQty(quantity);
    setIsInquiryModalOpen(true);
    window.history.pushState({ modal: "inquiry" }, "", "#inquiry");
  };

  const handleHeaderOpenInquiry = (product?: Product) => {
    const target = product || activeProduct || appProducts[0] || PRODUCTS[0];
    if (target) {
      handleOpenInquiry(target, 1);
    }
  };

  const handleSelectProductById = (productId: string) => {
    const found = appProducts.find((p) => p.id.toLowerCase() === productId.toLowerCase()) || PRODUCTS.find((p) => p.id.toLowerCase() === productId.toLowerCase());
    if (found) {
      handleProductSelect(found);
    } else if (appProducts.length > 0) {
      handleProductSelect(appProducts[0]);
    }
  };

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    window.history.pushState({ modal: "help" }, "", "#help");
  };

  // Sync favicon and document title dynamically
  useEffect(() => {
    if (homepageConfig.appFaviconUrl) {
      const faviconSrc = getProxiedImageUrl(homepageConfig.appFaviconUrl);
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconSrc;

      let appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = faviconSrc;
    }
    if (homepageConfig.appName) {
      document.title = `${homepageConfig.appName} | ${homepageConfig.appSubtitle || "Marktplatz für Laborreagenzien"}`;
    }
  }, [homepageConfig.appFaviconUrl, homepageConfig.appName, homepageConfig.appSubtitle]);

  // Fetch configurations on init and enforce robust marketplace safety locks (prevent select/copy/paste outside form elements)
  useEffect(() => {
    loadHomepageConfig();

    const isInputOrEditable = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      
      // Allow unrestricted copying and right click in admin panel
      if (typeof target.closest === "function" && target.closest("#lunexa-admin-view") !== null) {
        return true;
      }
      
      const tagName = (target.tagName || "").toUpperCase();
      const isContentEditable = !!target.isContentEditable || (typeof target.getAttribute === "function" && target.getAttribute("contenteditable") === "true");
      const inInput = typeof target.closest === "function" ? (target.closest("input") !== null || target.closest("textarea") !== null) : false;
      return (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        isContentEditable ||
        inInput
      );
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const targetEl = e.target as HTMLElement | null;
      if (!isInputOrEditable(activeEl) && !isInputOrEditable(targetEl)) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (!isInputOrEditable(targetEl)) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (e.key || "").toLowerCase();
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && (key === "c" || key === "x" || key === "a")) {
        const activeEl = document.activeElement as HTMLElement | null;
        if (!isInputOrEditable(activeEl)) {
          e.preventDefault();
        }
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (!isInputOrEditable(targetEl)) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Router listener & Mobile Device Back Button navigation handler
  useEffect(() => {
    const handlePopState = (e?: PopStateEvent) => {
      const path = window.location.pathname;
      const targetAdminPath = homepageConfig.admin_url_path || "/lunexa_official";
      const sanitizedTarget = targetAdminPath.startsWith("/") ? targetAdminPath : `/${targetAdminPath}`;
      const hasTrailing = sanitizedTarget.endsWith("/") ? sanitizedTarget : `${sanitizedTarget}/`;
      const noTrailing = sanitizedTarget.endsWith("/") ? sanitizedTarget.slice(0, -1) : sanitizedTarget;

      if (path === noTrailing || path === hasTrailing || window.location.hash === "#admin") {
        setCurrentView("admin");
        return;
      }

      // Close modals first if user presses mobile back button while modal is active
      if (e) {
        if (showCheckoutModalPrompt) {
          setShowCheckoutModalPrompt(false);
          return;
        }
        if (isInquiryModalOpen) {
          setIsInquiryModalOpen(false);
          return;
        }
        if (isHelpOpen) {
          setIsHelpOpen(false);
          return;
        }
      }

      const state = e?.state;
      const hash = window.location.hash || "";

      if (state && state.view) {
        if (state.view === "product" && state.productId) {
          const found = appProducts.find((p) => p.id === state.productId) || PRODUCTS.find((p) => p.id === state.productId);
          if (found) {
            setActiveProduct(found);
            setCurrentView("product");
          } else {
            setCurrentView("store");
            setActiveProduct(null);
          }
        } else if (state.view === "policies") {
          if (state.tab) setActivePolicyTab(state.tab);
          setCurrentView("policies");
          setActiveProduct(null);
        } else if (["store", "checkout", "orders", "inquiries", "profile"].includes(state.view)) {
          if (isNoCartAuthTheme && ["checkout", "orders", "profile"].includes(state.view)) {
            setCurrentView("store");
            setActiveProduct(null);
          } else {
            setCurrentView(state.view);
            if (state.view === "store") setActiveProduct(null);
          }
        } else {
          setCurrentView("store");
          setActiveProduct(null);
        }
      } else if (hash.startsWith("#product-")) {
        const pId = hash.replace("#product-", "");
        const found = appProducts.find((p) => p.id === pId) || PRODUCTS.find((p) => p.id === pId);
        if (found) {
          setActiveProduct(found);
          setCurrentView("product");
        } else {
          setCurrentView("store");
          setActiveProduct(null);
        }
      } else if (hash === "#admin") {
        setCurrentView("admin");
      } else if (e && (path === "/" || path === "") && !hash) {
        setCurrentView("store");
        setActiveProduct(null);
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [homepageConfig.admin_url_path, showCheckoutModalPrompt, isInquiryModalOpen, isHelpOpen, appProducts]);

  const handleBackToStore = () => {
    window.history.pushState({}, "", "/");
    loadHomepageConfig(); // Fresh pull when returning from Admin Panel
    setCurrentView("store");
  };

  // Load state from localStorage on init
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("chemlabs_cart_v1");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem("chemlabs_orders_v1");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error("Failed to load local state:", e);
    }
  }, []);

  // Save state to localStorage whenever changed
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("chemlabs_cart_v1", JSON.stringify(newCart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem("chemlabs_orders_v1", JSON.stringify(newOrders));
    } catch (e) {
      console.error("Failed to save orders:", e);
    }
  };

  const handleProductSelect = (product: Product) => {
    setActiveProduct(product);
    setCurrentView("product");
    window.history.pushState({ view: "product", productId: product.id }, "", `#product-${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isNoCartAuthTheme) {
      handleOpenInquiry(product, 1);
      return;
    }
    
    // Check if chemical requires a specific compliance license which can be checked inside Product Details first
    // For quick add, automatically use default packaging
    const existing = cart.find(item => item.product.id === product.id);
    let updated: CartItem[];
    let targetQty = 1;
    let targetPkg = "Glass Lab Bottle";
    if (existing) {
      targetQty = Math.min(10, existing.quantity + 1);
      targetPkg = existing.packaging || "Glass Lab Bottle";
      updated = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: targetQty }
          : item
      );
    } else {
      updated = [...cart, { product, quantity: 1, packaging: "Glass Lab Bottle" }];
    }
    saveCart(updated);

    // Trigger the beautiful catalog checkout popup prompt
    setModalQty(targetQty);
    setModalPackaging(targetPkg);
    setAddedProductForCheckoutModal(product);
    setShowCheckoutModalPrompt(true);
    window.history.pushState({ modal: "checkout_prompt" }, "", "#cart-prompt");
  };

  const handleDetailedAddToCart = (product: Product, qty: number, pkg: string, agreesTerms: boolean) => {
    if (isNoCartAuthTheme) {
      handleOpenInquiry(product, qty);
      return;
    }
    if (!agreesTerms) return;

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = cart.map((item, idx) => 
        idx === existingIndex 
          ? { ...item, quantity: qty, packaging: pkg }
          : item
      );
    } else {
      updated = [...cart, { product, quantity: qty, packaging: pkg }];
    }
    saveCart(updated);
    
    // Direct navigate to checkout to review purchase
    setCurrentView("checkout");
    window.history.pushState({ view: "checkout" }, "", "#checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    const updated = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const handlePaymentSuccess = (paymentDetails: {
    orderId: string;
    payerEmail: string;
    paymentId: string;
    paymentMethodId?: string;
    paymentReference?: string;
    paymentProofUrl?: string;
    otp?: string;
    localOrderId?: string;
    currency?: string;
    exchangeRate?: number;
    shippingDetails: {
      institution: string;
      researcher: string;
      room: string;
      city: string;
      state: string;
      zip: string;
      licenseId: string;
      address?: string;
      country?: string;
      email?: string;
      phone?: string;
    };
  }) => {
    // Settle financials
    const ledgerConfig = getLedgerConfig(homepageConfig);
    const subtotal = cart.reduce((acc, item) => {
      let delta = 0;
      if (item.packaging === "High-Density Polyethylene") delta = -2.50;
      else if (item.packaging === "Heavy-Duty Metal Canister") delta = 4.00;
      const elemPrice = Math.max(8.00, item.product.price + delta);
      return acc + (elemPrice * item.quantity);
    }, 0);
    const containsHazard = cart.some(item => 
      item.product.ghsPictograms && item.product.ghsPictograms.some(p => p !== "safe")
    );
    const transitFee = subtotal > 0 ? Number(ledgerConfig.transitFee || 25.00) : 0.00;
    const hazmatSurcharge = containsHazard ? Number(ledgerConfig.hazmatSurcharge || 15.00) : 0.00;
    const taxPercent = Number(ledgerConfig.taxRate !== undefined ? ledgerConfig.taxRate : 8.25);
    const taxes = subtotal * (taxPercent / 100);
    const usdGrandTotal = subtotal + hazmatSurcharge + transitFee + taxes;

    const ordCurrency = paymentDetails.currency || "USD";
    const ordExchangeRate = paymentDetails.exchangeRate || 83.50;
    const finalAmount = ordCurrency === "INR" ? usdGrandTotal * ordExchangeRate : usdGrandTotal;

    // Create realistic licensed order tracking entry
    const isPaypal = !paymentDetails.paymentMethodId || paymentDetails.paymentMethodId === "paypal";
    const orderDbId = isPaypal ? paymentDetails.orderId : "ord-" + Date.now();
    const orderDisplayId = isPaypal ? (paymentDetails.localOrderId || paymentDetails.orderId) : paymentDetails.orderId;

    const newOrder: any = {
      id: orderDbId,
      orderId: orderDisplayId,
      paymentId: paymentDetails.paymentId,
      payerEmail: paymentDetails.payerEmail,
      customerId: (currentUser?.id || currentUser?.uid) || "",
      amount: finalAmount,
      currency: ordCurrency,
      date: new Date().toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" }),
      shippingDetails: paymentDetails.shippingDetails,
      itemsSelectedCount: cart.reduce((a, b) => a + b.quantity, 0),
      status: isPaypal ? "Paid" : "manual_verification_pending",
      paymentMethodId: paymentDetails.paymentMethodId || "paypal",
      paymentReference: paymentDetails.paymentReference || paymentDetails.paymentId,
      paymentProofUrl: paymentDetails.paymentProofUrl || "",
      shipmentOtp: paymentDetails.otp || "",
      products: cart.map(item => {
        let delta = 0;
        if (item.packaging === "High-Density Polyethylene") delta = -2.50;
        else if (item.packaging === "Heavy-Duty Metal Canister") delta = 4.00;
        const elemPrice = Math.max(8.00, item.product.price + delta);
        const finalPrice = ordCurrency === "INR" ? elemPrice * ordExchangeRate : elemPrice;

        return {
          product_id: item.product.id,
          product_name: item.product.name,
          qty: item.quantity,
          price: finalPrice,
          package_size: item.packaging,
          image_url: item.product.image,
          cas_number: item.product.cas,
          formula: item.product.formula,
          purity: item.product.purity,
          grade: item.product.grade,
          ghs_pictograms: JSON.stringify(item.product.ghsPictograms || [])
        };
      })
    };

    // Push checkout transaction order details to Neon PostgreSQL Database
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    fetch("/api/orders", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...newOrder,
        items: cart
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        console.error("PostgreSQL Sync warning: Received non-200 response code", res.status);
        throw new Error("Failed");
      }
      return res.json();
    })
    .then((data) => {
      if (data.otp) {
        newOrder.shipmentOtp = data.otp;
      }
      saveOrders([newOrder, ...orders]);
      saveCart([]); // Flush cart
      setCurrentView("orders");
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch((err) => {
      console.error("PostgreSQL Sync network error connecting to database:", err);
      saveOrders([newOrder, ...orders]);
      saveCart([]); // Flush cart
      setCurrentView("orders");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Shipping status will now be handled via DB state fetching in OrdersHub
  };

  const handleClearOrderHistory = () => {
    saveOrders([]);
  };

  const handleNavigate = (view: any) => {
    if (isNoCartAuthTheme && ["checkout", "orders", "profile"].includes(view)) {
      setCurrentView("store");
      setActiveProduct(null);
      window.history.pushState({ view: "store" }, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentView(view);
    if (view === "store") {
      setActiveProduct(null);
    }
    window.history.pushState({ view }, "", view === "store" ? "/" : `#${view}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToPolicy = (tab: PolicyTab) => {
    setActivePolicyTab(tab);
    setCurrentView("policies");
    setActiveProduct(null);
    window.history.pushState({ view: "policies", tab }, "", `#policy-${tab}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter products by search and category tags
  const filteredProducts = appProducts.filter((prod) => {
    const query = (searchQuery || "").toLowerCase();
    
    // Check type of category (from API it is an object, from PRODUCTS it is a string)
    const catName = typeof prod.category === "object" && prod.category !== null 
      ? (prod.category as any).name 
      : prod.category;

    const matchesSearch = 
      (prod.name || "").toLowerCase().includes(query) ||
      (prod.cas || "").toLowerCase().includes(query) ||
      (prod.formula || "").toLowerCase().includes(query) ||
      (catName || "").toLowerCase().includes(query);
    
    const matchesCat = activeCategory === "All" || catName === activeCategory;

    return matchesSearch && matchesCat;
  });

  if (currentView === "admin") {
    return <AdminPanel onBackToStore={handleBackToStore} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white" id="flaskia-app">
      
      {/* Dynamic Header block */}
      <div className="print:hidden">
        <Header
          currentView={currentView}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            if (currentView !== "store" && currentView !== "admin") {
              setCurrentView("store");
              setActiveProduct(null);
            }
          }}
          onOpenHelp={handleOpenHelp}
          appName={homepageConfig.appName}
          appBrandBadge={homepageConfig.appBrandBadge}
          appSubtitle={homepageConfig.appSubtitle}
          appLogoIcon={homepageConfig.appLogoIcon}
          appLogoUrl={homepageConfig.appLogoUrl}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenInquiry={handleHeaderOpenInquiry}
          onSelectProductById={handleSelectProductById}
          inquiries={inquiriesList}
        />
      </div>

      {/* Slide-out FAQ & Hygiene Manual Overlay */}
      <div className="print:hidden">
        <HelpFaq isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        {!isNoCartAuthTheme && showCheckoutModalPrompt && addedProductForCheckoutModal && (
          <CheckoutPromptModal
            product={addedProductForCheckoutModal}
            qty={modalQty}
            packaging={modalPackaging}
            cart={cart}
            onUpdateQty={(q) => {
              setModalQty(q);
              const updated = cart.map(item => 
                item.product.id === addedProductForCheckoutModal.id ? { ...item, quantity: q } : item
              );
              saveCart(updated);
            }}
            onUpdatePackaging={(p) => {
              setModalPackaging(p);
              const updated = cart.map(item => 
                item.product.id === addedProductForCheckoutModal.id ? { ...item, packaging: p } : item
              );
              saveCart(updated);
            }}
            onClose={() => setShowCheckoutModalPrompt(false)}
            onProceed={() => {
              setShowCheckoutModalPrompt(false);
              setCurrentView("checkout");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>

      <main className="flex-1 pb-16 print:pb-0">
        
        {/* VIEW 1: REAGENTS CATALOGUE HOME PAGE */}
        {currentView === "store" && (
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 space-y-8">
            
            {/* Conditional Hero Layout based on Theme */}
            {isIndiamart ? (
              <div className="animate-fade-in" id="indiamart-hero-banner">
                <div className="bg-gradient-to-br from-[#091e42] via-[#0a2540] to-[#0052cc] rounded-2xl p-6 md:p-10 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-2xl space-y-3.5">
                    <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight font-heading leading-tight">
                      {homepageConfig.heroTitle === "High-Purity Laboratory Reagents & Supplies"
                        ? "Großhandel für Laborchemikalien & B2B-Angebotsportal"
                        : (homepageConfig.heroTitle || "Großhandel für Laborchemikalien & B2B-Angebotsportal")}
                    </h1>

                    <p className="text-blue-100/90 text-xs md:text-sm leading-relaxed max-w-xl">
                      {homepageConfig.heroDescription?.startsWith("Flaskia distributes analytical chemicals")
                        ? "Direkte Herstellerangebote für Chemikalien in ACS-, HPLC- und Industriequalität. Komplett mit chargenzertifiziertem Analysezertifikat (CoA) und schnellem Versand."
                        : (homepageConfig.heroDescription || "Direkte Herstellerangebote für Chemikalien in ACS-, HPLC- und Industriequalität. Komplett mit chargenzertifiziertem Analysezertifikat (CoA) und schnellem Versand.")}
                    </p>
                  </div>

                  {/* Quick 1-Line RFQ Bar */}
                  <div className="w-full lg:w-auto lg:min-w-[440px]">
                    {heroRfqSubmitted ? (
                      <div className="bg-blue-950/80 border border-blue-400/40 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <span className="flex items-center gap-2 text-blue-100 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                          Anfrage gesendet. Unser Team kontaktiert {heroRfqPhone} in Kürze.
                        </span>
                        <button
                          onClick={() => setHeroRfqSubmitted(false)}
                          className="text-xs font-semibold text-sky-300 hover:underline cursor-pointer shrink-0"
                        >
                          Neues Angebot
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleHeroRfqSubmit} className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-xl space-y-2.5">
                        <div className="text-[11px] font-semibold text-blue-100 px-1">
                          Sofortiges Großhandelsangebot anfordern
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            required
                            value={heroRfqProduct}
                            onChange={(e) => setHeroRfqProduct(e.target.value)}
                            placeholder="Chemikalienname oder CAS..."
                            className="flex-1 bg-white text-slate-900 text-xs font-medium rounded-lg px-3.5 py-2.5 border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
                          />
                          <input
                            type="tel"
                            required
                            value={heroRfqPhone}
                            onChange={(e) => setHeroRfqPhone(e.target.value)}
                            placeholder="Mobil / WhatsApp"
                            className="w-full sm:w-36 bg-white text-slate-900 text-xs font-medium rounded-lg px-3 py-2.5 border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
                          />
                          <button
                            type="submit"
                            disabled={heroRfqLoading}
                            className="bg-[#0052cc] hover:bg-[#0747a6] border border-blue-400/30 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer whitespace-nowrap active:scale-[0.99] shadow-xs"
                          >
                            {heroRfqLoading ? "Sende..." : "Angebot anfordern"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ) : isRetail ? (
              <div className="space-y-4 animate-fade-in" id="retail-hero-banner">
                {/* Flipkart / Amazon Mega Sale Big Banner */}
                <div className="bg-gradient-to-r from-[#2874f0] via-[#1f5bc0] to-[#131921] rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 z-10 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#febd69] text-slate-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-sans shadow-xs">
                        🔥 GROSSE SPARTAGE • ZEITLICH BEGRENZTE ANGEBOTE
                      </span>
                      <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        BIS ZU 60% DIREKTRABATT
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight font-sans leading-tight">
                      {homepageConfig.heroTitle === "High-Purity Laboratory Reagents & Supplies"
                        ? "Hochreine Laborreagenzien & Chemikalienbedarf"
                        : (homepageConfig.heroTitle || "Globaler Marktplatz für Chemie & Laborausrüstung")}
                    </h2>
                    <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
                      {homepageConfig.heroDescription?.startsWith("Flaskia distributes analytical chemicals")
                        ? "Flaskia vertreibt analytische Chemikalien, Pufferlösungen und zertifizierte Borosilikat-Glaswaren der Klasse A für akademische Synthese, Forschungsmodellierung und Laboratorien."
                        : (homepageConfig.heroDescription || "Entdecken Sie über 10.000 chemische Reagenzien in ACS-Qualität, Glaswaren und Sicherheitsausrüstung mit schnellem, kostenlosem Versand.")}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button 
                        onClick={() => { const el = document.getElementById('retail-products-grid'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} 
                        className="bg-[#ff9f00] hover:bg-[#e08c00] text-slate-950 font-extrabold px-6 py-2.5 rounded-lg text-xs transition cursor-pointer shadow-md uppercase tracking-wide"
                      >
                        ANGEBOTE ENTDECKEN
                      </button>
                      <a
                        href="https://wa.me/15099941048"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp-Hilfe</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Hero Product Feature */}
                  <div className="relative z-10 shrink-0 w-full md:w-72 h-44 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex flex-col items-center justify-center text-center">
                    <img 
                      src={homepageConfig.heroImageUrl} 
                      alt={homepageConfig.heroImageAlt} 
                      className="w-full h-32 object-cover rounded-lg shadow-md" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400"; }} 
                    />
                    <span className="text-[10px] font-bold text-emerald-300 mt-1 uppercase font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL-Verschlüsselt
                    </span>
                  </div>
                </div>

                {/* Marketplace Security & Trust Ribbon */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-200 flex-wrap gap-3 font-mono shadow-xs">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Lock className="w-3.5 h-3.5 text-amber-300" /> 256-Bit SSL-Verschlüsselt
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PCI-DSS-Geprüfte Sicherheit
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> GHS-Chemikaliensicherheitsstandard
                    </span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-800 uppercase">OFFIZIELLER SICHERER SHOP</span>
                </div>
              </div>
            ) : (
              /* Elegant Hero Welcome Layout complete with responsive generated artwork */
              <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 md:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-8 select-none">
                
                {/* Background gradient overlays */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 max-w-xl relative z-10">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 font-mono text-[10.5px] font-semibold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {homepageConfig.heroTag === "FDA & OSHA GHS COMPLIANT PROCUREMENT" ? "FDA & OSHA GHS-KONFORME BESCHAFFUNG" : homepageConfig.heroTag}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-light text-slate-800 tracking-tight leading-none font-heading">
                    {homepageConfig.heroTitle === "High-Purity Laboratory Reagents & Supplies" ? "Hochreine Laborreagenzien & Chemikalienbedarf" : homepageConfig.heroTitle}
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {homepageConfig.heroDescription?.startsWith("Flaskia distributes analytical chemicals")
                      ? "Flaskia vertreibt analytische Chemikalien, Pufferlösungen und zertifizierte Borosilikat-Glaswaren der Klasse A für akademische Synthese, Forschungsmodellierung und Laboratorien."
                      : homepageConfig.heroDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 pb-1">
                    <a
                      href="https://wa.me/15099941048"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.01] text-white text-[10.5px] font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer z-10"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp-Hotline: +1 (509) 994-1048 (Nur Chat 24/7)</span>
                    </a>
                  </div>
                  
                  {/* Detailed Marketplace Security Specs */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 font-mono text-[11px] text-slate-600 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Lock className="w-3.5 h-3.5 text-amber-600" /> 256-Bit SSL/TLS-Verschlüsselung
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> PCI-DSS Sichere Zahlungen
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> GHS & OSHA Chemikalienkonformität
                    </span>
                  </div>
                </div>

                {/* Lab glassware visual graphics card */}
                <div className="w-full md:w-80 h-48 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative shrink-0">
                  {/* Embedding generated modern realistic chemistry lab photo */}
                  <img 
                    src={homepageConfig.heroImageUrl} 
                    alt={homepageConfig.heroImageAlt} 
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to cute unsplash if generated can't load
                      e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-[10px] text-slate-600 flex items-center justify-between z-10">
                    <span className="font-semibold font-mono">{homepageConfig.heroWatermarkTitle}</span>
                    <span className="bg-white/90 text-blue-600 px-2.5 py-0.5 rounded border border-slate-200 font-bold uppercase font-mono">{homepageConfig.heroWatermarkBadge}</span>
                  </div>
                </div>

              </div>
            )}

            {/* Reagents Categorization Panels */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 select-none">
              <div className="w-full sm:w-auto overflow-hidden">
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none font-heading flex-nowrap whitespace-nowrap scroll-smooth max-w-full">
                  {["All", ...appCategories.map(c => c.name), ...Array.from(new Set(appProducts.map(p => typeof p.category === 'object' && p.category !== null ? (p.category as any).name : p.category))).filter(c => c && !appCategories.find(ac => ac.name === c))].map((catName) => {
                    const catLabelMap: Record<string, string> = {
                      All: "Alle",
                      Reagents: "Reagenzien",
                      Buffers: "Pufferlösungen",
                      Indicators: "Indikatoren",
                      Solvents: "Lösungsmittel",
                      Acids: "Säuren",
                      Salts: "Salze",
                      Glassware: "Glaswaren",
                    };
                    const displayLabel = catLabelMap[catName] || catName;
                    return (
                      <button
                        key={catName}
                        onClick={() => setActiveCategory(catName)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shrink-0 ${
                          activeCategory === catName
                            ? isRetail
                              ? "bg-[#2874f0] text-white shadow-xs font-extrabold"
                              : "bg-slate-900 text-white font-semibold shadow-xs"
                            : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                        }`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-[10.5px] text-slate-400 font-mono shrink-0">
                Zeige <strong className="text-slate-700 font-bold">{filteredProducts.length}</strong> geprüfte Reagenzien
              </div>
            </div>

            {/* Product card grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl max-w-lg mx-auto select-none shadow-xs animate-fade-in">
                <FlaskConicalOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-700 font-heading">Keine passenden Reagenzien gefunden</h3>
                <p className="text-xs text-slate-400 mt-1">Passen Sie Ihre Katalogfilter an oder korrigieren Sie Ihre Suchanfrage.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs rounded-xl cursor-pointer font-medium transition"
                >
                  Katalogfilter zurücksetzen
                </button>
              </div>
            ) : (
              <div 
                id="retail-products-grid"
                className={`grid gap-6 animate-fade-in ${
                  isRetail 
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={handleProductSelect}
                    onAddToCart={handleQuickAddToCart}
                    onOpenInquiry={handleOpenInquiry}
                  />
                ))}
              </div>
            )}

            {/* Compliance advisory footnote */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between select-none text-slate-500 shadow-xs">
              <div className="flex gap-3 items-center text-xs">
                <ShieldAlert className="w-6 h-6 text-blue-600 shrink-0" />
                <p className="leading-normal text-slate-500">
                  <span className="mr-1.5">{homepageConfig.complianceEmoji}</span> 
                  <strong>
                    {homepageConfig.complianceTitle === "GHS Custody compliance assurance:"
                      ? "GHS-Konformitätsgarantie:"
                      : homepageConfig.complianceTitle}
                  </strong>{" "}
                  {homepageConfig.complianceText?.startsWith("Flaskia monitors safety profiles")
                    ? "Flaskia überwacht Sicherheitsprofile kontinuierlich. Die Dokumentation zur sicheren Handhabung entspricht internationalen Chemiestandards."
                    : homepageConfig.complianceText}
                </p>
              </div>
              <button
                onClick={handleOpenHelp}
                className="px-4.5 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100/50 rounded-xl cursor-pointer transition shrink-0 self-stretch sm:self-auto text-center"
                id="view-faq-manual-btn"
              >
                {homepageConfig.complianceBtnText === "Open Safety & FAQ Manual"
                  ? "Sicherheits- & FAQ-Handbuch öffnen"
                  : homepageConfig.complianceBtnText}
              </button>
            </div>

          </div>
        )}

        {/* VIEW 2: ACTIVE REAGENT SINGLE DETAILED PRODUCT PAGE */}
        {currentView === "product" && activeProduct && (
          <ProductDetails
            product={activeProduct}
            onBack={() => {
              setActiveProduct(null);
              setCurrentView("store");
              window.history.pushState({ view: "store" }, "", "/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleDetailedAddToCart}
            onOpenInquiry={handleOpenInquiry}
            appName={homepageConfig.appName}
            appSubtitle={homepageConfig.appSubtitle}
            whatsappNumber={homepageConfig.adminWhatsappNumber || "15099941048"}
          />
        )}

        {/* VIEW 3: DISPATCH CART & CHECKOUT PAGE WRAPPER */}
        {!isNoCartAuthTheme && currentView === "checkout" && (
          authLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 font-mono space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mx-auto" />
              <p>Authenticating procurement clearance...</p>
            </div>
          ) : !currentUser ? (
            <div className="max-w-2xl mx-auto py-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4.5 text-xs text-slate-705 leading-relaxed text-left flex items-start gap-2 max-w-2xl mx-auto">
                <span className="text-base">🔐</span>
                <div>
                  <strong className="block font-semibold text-blue-900 mb-0.5">Academic Credentials Needed</strong>
                  Institutional credentials and chemical registry authorization are mandatory before proceeding to checkout. Create your profile or sign in to finalize procurement.
                </div>
              </div>
              <CustomerAuth onAuthSuccess={(user) => { handleSetUser(user); setCurrentView("checkout"); }} />
            </div>
          ) : (
            <CheckoutPage
              cart={cart}
              onUpdateQty={handleUpdateCartQty}
              onRemoveItem={handleRemoveCartItem}
              onPaymentSuccess={handlePaymentSuccess}
              onBackToStore={() => handleNavigate("store")}
              homepageConfig={homepageConfig}
              currentUser={currentUser}
            />
          )
        )}

        {/* VIEW 4: LICENSED TRANSIT TRACKER HISTORY */}
        {!isNoCartAuthTheme && currentView === "orders" && (
          authLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 font-mono space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mx-auto" />
              <p>Authenticating procurement clearance...</p>
            </div>
          ) : !currentUser ? (
            <div className="max-w-2xl mx-auto py-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4.5 text-xs text-slate-705 leading-relaxed text-left flex items-start gap-2 max-w-2xl mx-auto">
                <span className="text-base">🔐</span>
                <div>
                  <strong className="block font-semibold text-blue-900 mb-0.5">Procurement Vault Logged</strong>
                  Please authenticate with your chemical registry card to retrieve your private hazardous transit invoices and tracking dashboards.
                </div>
              </div>
              <CustomerAuth onAuthSuccess={(user) => { handleSetUser(user); setCurrentView("orders"); }} />
            </div>
          ) : (
            <OrdersHub
              orders={orders}
              onBackToStore={() => handleNavigate("store")}
              onClearHistory={handleClearOrderHistory}
              homepageConfig={homepageConfig}
              currentUser={currentUser}
            />
          )
        )}

        {/* VIEW 4B: MY B2B INQUIRIES HUB */}
        {currentView === "inquiries" && (
          <MyInquiriesHub
            currentUser={currentUser}
            onBackToStore={() => handleNavigate("store")}
            onSelectProductById={handleSelectProductById}
            onUpdateUser={handleSetUser}
          />
        )}


        {/* VIEW 5: SECURITY POLICY DESK */}
        {currentView === "policies" && (
          <CompanyPolicies
            initialTab={activePolicyTab}
            onBack={() => handleNavigate("store")}
            appName={homepageConfig.appName}
            appSubtitle={homepageConfig.appSubtitle}
            footerCompanyName={homepageConfig.footerCompanyName}
          />
        )}

        {/* VIEW 6: SECURE PROFILE HUB */}
        {!isNoCartAuthTheme && currentView === "profile" && (
          authLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 font-mono space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mx-auto" />
              <p>Authenticating procurement clearance...</p>
            </div>
          ) : !currentUser ? (
            <div className="max-w-2xl mx-auto py-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4.5 text-xs text-slate-705 leading-relaxed text-left flex items-start gap-2 max-w-2xl mx-auto">
                <span className="text-base">🔐</span>
                <div>
                  <strong className="block font-semibold text-blue-900 mb-0.5">Academic Credentials Needed</strong>
                  Institutional credentials and chemical registry authorization are mandatory to view your profile directory. Please authenticate or create your profile account.
                </div>
              </div>
              <CustomerAuth onAuthSuccess={(user) => { handleSetUser(user); setCurrentView("profile"); }} />
            </div>
          ) : (
            <UserProfile
              currentUser={currentUser}
              onUpdateUser={handleSetUser}
              onLogout={handleLogout}
              onBackToStore={() => handleNavigate("store")}
            />
          )
        )}

      </main>

      {/* Clean Corporate Footer */}
      <footer className="print:hidden border-t border-slate-200/90 bg-white text-slate-600 font-sans select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80 text-left">
            {/* Brand & Corporate Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-8">
              <div
                onClick={() => handleNavigate("store")}
                className="inline-flex items-center gap-2.5 cursor-pointer group"
              >
                {(homepageConfig.footerLogoUrl || homepageConfig.appLogoUrl) ? (
                  <img
                    src={getProxiedImageUrl(homepageConfig.footerLogoUrl || homepageConfig.appLogoUrl)}
                    alt={homepageConfig.appName}
                    className="h-9 w-auto max-w-[160px] object-contain rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-[#0052cc] text-white flex items-center justify-center shadow-2xs group-hover:bg-[#0747a6] transition-colors shrink-0">
                    {(() => {
                      const FooterIcon = (() => {
                        switch (homepageConfig.appLogoIcon) {
                          case "Award": return Award;
                          case "Activity": return Activity;
                          case "ShieldCheck": return ShieldCheck;
                          case "Globe": return Globe;
                          case "Cpu": return Cpu;
                          case "Sparkles": return Sparkles;
                          case "Beaker": return Beaker;
                          case "Heart": return Heart;
                          case "FlaskConical":
                          default: return FlaskConical;
                        }
                      })();
                      return <FooterIcon className="w-4.5 h-4.5" />;
                    })()}
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-900 text-base tracking-tight font-heading block leading-none">
                    {homepageConfig.appName}
                  </span>
                  {homepageConfig.appSubtitle && (
                    <span className="text-[11px] text-slate-500 font-medium block mt-1 leading-none">
                      {homepageConfig.appSubtitle}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
                Weltweiter Lieferant von analytischen Reagenzien, Lösungsmitteln in ACS- und HPLC-Qualität, Pufferlösungen und zertifizierten Labormaterialien gemäß GHS- und OSHA-Standards.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${(homepageConfig.adminWhatsappNumber || "15099941048").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#0052cc]" />
                  <span>WhatsApp-Schalter: +{homepageConfig.adminWhatsappNumber || "1 (509) 994-1048"}</span>
                </a>
              </div>
            </div>

            {/* Navigation Columns (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Column 1: Company */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Unternehmen
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigate("store")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Produktkatalog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("about")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Über uns
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("compliance")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Qualität & Compliance
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("contact")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Kontakt
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Shipping & Support */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Logistik & Support
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("shipping")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Versand & Gefahrguttransport
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("return")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Rückgabe & Reklamationen
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("refund")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Rückerstattungsrichtlinie
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleOpenHelp}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Sicherheits- & FAQ-Handbuch
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal & Regulatory */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Rechtliches & Regulierung
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("terms")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Allgemeine Geschäftsbedingungen
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("privacy")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Datenschutzerklärung
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("disclaimer")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Sicherheitshinweis
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("cookie")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Cookie-Richtlinie
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Clean Footer Credit Only */}
          <div className="pt-6 flex items-center justify-center text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} {homepageConfig.footerCopyright}
          </div>
        </div>
      </footer>



      {/* IndiaMART / B2B WhatsApp Product Inquiry Modal */}
      <IndiamartInquiryModal
        product={inquiryProduct}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        defaultQty={inquiryDefaultQty}
        whatsappNumber={homepageConfig.adminWhatsappNumber || "15099941048"}
        appName={homepageConfig.appName || "Flaskia"}
        onSuccess={fetchInquiries}
      />

      {/* Pristine Floating WhatsApp Helper Widget */}
      <div id="whatsapp-floating-widget" className="fixed bottom-6 right-6 z-50 print:hidden flex flex-col items-end gap-2 group select-none">
        <div className="bg-white text-slate-800 text-[11px] font-medium border border-slate-200 shadow-lg p-3 rounded-2xl max-w-xs transform scale-0 origin-bottom-right group-hover:scale-100 transition-all duration-300 ease-out flex items-center gap-3 shadow-slate-100">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div>
            <p className="font-extrabold text-emerald-800 uppercase tracking-widest text-[8.5px] font-mono leading-none">WhatsApp-Hotline</p>
            <p className="font-bold text-slate-705 mt-1 select-all">+1 (509) 994-1048</p>
            <p className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">Nur Text (Keine Anrufe) - Online 24/7</p>
          </div>
        </div>
        
        <a
          href="https://wa.me/15099941048"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3 md:p-3.5 md:px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-xs cursor-pointer border border-emerald-400/20"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp-Hilfe</span>
          <span className="sm:hidden">Hilfe</span>
        </a>
      </div>

    </div>
  );
}
