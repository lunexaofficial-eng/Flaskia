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
import { useCurrency } from "./context/CurrencyContext";
import {
  DEFAULT_HERO_FEATURES,
  DEFAULT_ACCEPTED_CRYPTOS,
  parseHeroFeatures,
  parseAcceptedCryptos,
  resolveCryptoLogoUrl,
  renderHeroFeatureIcon,
  SUPPORTED_LANGUAGES,
  UI_TRANSLATIONS,
} from "./utils/homepageDefaults";
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
  const { syncDefaultCurrency } = useCurrency();
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
      .then(data => setAppCategories(data))
      .catch(console.error);
    
    fetch("/api/products")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
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
    const saved = localStorage.getItem("aniixa_customer_user");
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
      localStorage.setItem("aniixa_customer_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("aniixa_customer_user");
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
    heroTag: "Global Chemical Marketplace",
    heroTitle: "High-Quality Chemicals for",
    heroTitleHighlight: "Research, Industry & Innovation",
    heroDescription: "Discover a wide range of laboratory chemicals, industrial chemicals and specialty compounds from trusted suppliers — all in one place.",
    heroPrimaryBtnText: "Explore Products",
    heroSecondaryBtnText: "Browse Categories",
    heroStat1Value: "≤18 MΩ·cm",
    heroStat1Label: "Methylene conductivity standard",
    heroStat2Value: "100%",
    heroStat2Label: "SDS / GHS Clear Documentation",
    heroImageUrl: "/src/assets/images/chemical_hero_showcase_1791706712241.jpg",
    heroImageAlt: "High-Quality Laboratory Chemicals & Glassware",
    heroWatermarkTitle: "CHEMLABS REAGENT CELL",
    heroWatermarkBadge: "Sandbox Portal",
    heroFeaturesVisible: "true",
    heroFeaturesJson: JSON.stringify(DEFAULT_HERO_FEATURES),
    cryptoBarVisible: "true",
    cryptoBarSmallLabel: "We Accept",
    cryptoBarTitle: "Cryptocurrency Payments",
    acceptedCryptosJson: JSON.stringify(DEFAULT_ACCEPTED_CRYPTOS),
    defaultLanguage: "en",
    defaultWebsiteCurrency: "INR",
    complianceBtnText: "Open Safety & FAQ Manual",
    complianceEmoji: "🔐",
    complianceTitle: "GHS Custody compliance assurance:",
    complianceText: "Aniixa monitors safety profiles continuously. Safe handling documentation complies with international chemistry standards. Settle transactions securely with our verified secure PayPal Sandbox.",
    
    // Brand identity defaults
    appName: "Aniixa",
    appBrandBadge: "PRO",
    appSubtitle: "Academic Supply Direct",
    appLogoIcon: "FlaskConical",
    appLogoUrl: "",
    footerLogoUrl: "",
    appFaviconUrl: "https://img.icons8.com/color/48/chemistry.png",
    admin_url_path: "/lunexa_official",
    adminWhatsappNumber: "15099941048",
    
    // Complete adaptive footer defaults
    footerCompanyName: "Aniixa Supplies International Co.",
    footerLicence1: "OSHA ID: 44321-REAG",
    footerLicence2: "EPA LICENSE: 7385-CHEM",
    footerLicence3: "DOT TRANSPORT: CLASS 9",
    footerCopyright: "Aniixa Supplies International Co. All rights reserved."
  });

  const loadHomepageConfig = () => {
    fetch("/api/homepage")
      .then(res => {
        if (!res.ok) throw new Error("HTTP failure");
        return res.json();
      })
      .then(data => {
        if (data && typeof data === "object") {
          const normalized: Record<string, any> = { ...data };
          for (const k of Object.keys(normalized)) {
            if (typeof normalized[k] === "string" && /flaskia/i.test(normalized[k])) {
              normalized[k] = normalized[k]
                .replace(/FLASKIA/g, "ANIIXA")
                .replace(/Flaskia/g, "Aniixa")
                .replace(/flaskia/g, "aniixa");
            }
          }
          setHomepageConfig(prev => ({ ...prev, ...normalized }));
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

  // Sync favicon, document title, default language, and default website currency dynamically
  useEffect(() => {
    if (homepageConfig.appFaviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = homepageConfig.appFaviconUrl;
    }
    if (homepageConfig.appName) {
      document.title = `${homepageConfig.appName} | ${homepageConfig.appSubtitle || "Premium Reagents Marketplace"}`;
    }
    if (homepageConfig.defaultLanguage) {
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === homepageConfig.defaultLanguage);
      document.documentElement.lang = homepageConfig.defaultLanguage;
      document.documentElement.dir = langObj?.dir || "ltr";
    }
    if (homepageConfig.defaultWebsiteCurrency) {
      syncDefaultCurrency(homepageConfig.defaultWebsiteCurrency);
    }
  }, [
    homepageConfig.appFaviconUrl,
    homepageConfig.appName,
    homepageConfig.appSubtitle,
    homepageConfig.defaultLanguage,
    homepageConfig.defaultWebsiteCurrency,
    syncDefaultCurrency,
  ]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white" id="aniixa-app">
      
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
          defaultLanguage={homepageConfig.defaultLanguage || "en"}
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
          <div className="space-y-8">
            {/* Full-Width Hero Section + Accepted Cryptocurrency Payments Bar */}
            <section className="w-full border-b border-[#e2ece9] bg-white select-none overflow-hidden">
              {/* Upper Hero Area */}
              <div className="relative w-full bg-gradient-to-b lg:bg-gradient-to-r from-[#f8fafb] via-white to-[#eef5f3]">
                {/* Desktop & Large Tablet Right-Side Studio Lab Showcase Image with Smooth Blend */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-[56%] xl:w-[58%] pointer-events-none select-none overflow-hidden">
                  <img
                    src={
                      homepageConfig.heroImageUrl &&
                      homepageConfig.heroImageUrl.trim() &&
                      !homepageConfig.heroImageUrl.includes("chemical_hero_banner_1780924768442.png")
                        ? homepageConfig.heroImageUrl.trim()
                        : "/src/assets/images/chemical_hero_showcase_1791706712241.jpg"
                    }
                    alt={homepageConfig.heroImageAlt || "High-Quality Laboratory Chemicals & Glassware"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[78%_center] xl:object-right transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = "/src/assets/images/chemical_hero_showcase_1791706712241.jpg";
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-white via-white/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/50 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-7 pb-8 sm:pt-10 sm:pb-10 lg:pt-14 lg:pb-14 relative z-10">
                  <div className="max-w-2xl space-y-5 sm:space-y-6">
                    {/* Top Green Pill Badge */}
                    {(homepageConfig.heroTag || "Global Chemical Marketplace") && (
                      <div>
                        <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full bg-[#e3f6ec] text-[#059669] text-xs sm:text-[13px] font-semibold tracking-tight shadow-2xs">
                          {homepageConfig.heroTag &&
                          homepageConfig.heroTag !== "FDA & OSHA GHS COMPLIANT PROCUREMENT"
                            ? homepageConfig.heroTag
                            : "Global Chemical Marketplace"}
                        </span>
                      </div>
                    )}

                    {/* Main Hero Heading */}
                    <h1 className="text-[28px] xs:text-[32px] sm:text-4xl md:text-[46px] lg:text-[50px] font-extrabold tracking-tight leading-[1.14] text-[#0b192c]">
                      {homepageConfig.heroTitle &&
                      homepageConfig.heroTitle !== "High-Purity Laboratory Reagents & Supplies"
                        ? homepageConfig.heroTitle
                        : "High-Quality Chemicals for"}
                      {(homepageConfig.heroTitleHighlight !== undefined
                        ? homepageConfig.heroTitleHighlight
                        : "Research, Industry & Innovation") && (
                        <span className="block mt-1 text-[#059669]">
                          {homepageConfig.heroTitleHighlight !== undefined &&
                          homepageConfig.heroTitleHighlight !== ""
                            ? homepageConfig.heroTitleHighlight
                            : "Research, Industry & Innovation"}
                        </span>
                      )}
                    </h1>

                    {/* Subtitle Paragraph */}
                    <p className="text-[#4b5c6b] text-[13.5px] sm:text-[15.5px] md:text-[16.5px] leading-relaxed max-w-xl font-normal">
                      {homepageConfig.heroDescription &&
                      !homepageConfig.heroDescription.startsWith("Aniixa distributes analytical chemicals")
                        ? homepageConfig.heroDescription
                        : "Discover a wide range of laboratory chemicals, industrial chemicals and specialty compounds from trusted suppliers — all in one place."}
                    </p>

                    {/* Primary & Secondary Action Buttons */}
                    <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("retail-products-grid");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#059669] to-[#0ca678] hover:from-[#047857] hover:to-[#059669] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                      >
                        <svg
                          className="w-4 h-4 text-white shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          <path d="M12 9v4" />
                          <path d="M10 11h4" />
                        </svg>
                        <span>{homepageConfig.heroPrimaryBtnText || "Explore Products"}</span>
                        <svg
                          className="w-4 h-4 text-white/90 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("catalog-categories-bar");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0b192c] border border-[#1e293b]/75 hover:border-[#0b192c] text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-[0.99]"
                      >
                        <span>{homepageConfig.heroSecondaryBtnText || "Browse Categories"}</span>
                        <svg
                          className="w-4 h-4 text-[#0b192c] shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>

                    {/* Responsive Mobile & Tablet Hero Showcase Image (Auto-adjusts framing to highlight glassware) */}
                    <div className="lg:hidden relative -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden border-y sm:border border-[#e2ece9] bg-white shadow-2xs my-2">
                      <div className="aspect-[16/10] sm:aspect-[16/8] w-full relative overflow-hidden bg-[#f4f8f7]">
                        <img
                          src={
                            homepageConfig.heroImageUrl &&
                            homepageConfig.heroImageUrl.trim() &&
                            !homepageConfig.heroImageUrl.includes("chemical_hero_banner_1780924768442.png")
                              ? homepageConfig.heroImageUrl.trim()
                              : "/src/assets/images/chemical_hero_showcase_1791706712241.jpg"
                          }
                          alt={homepageConfig.heroImageAlt || "High-Quality Laboratory Chemicals & Glassware"}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-[85%_center] sm:object-[75%_center] scale-[1.08] sm:scale-100 origin-right"
                          onError={(e) => {
                            e.currentTarget.src = "/src/assets/images/chemical_hero_showcase_1791706712241.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* 4-Column Feature Highlights Row (Managed & One-Click Hideable from Admin Panel) */}
                    {homepageConfig.heroFeaturesVisible !== "false" && (() => {
                      const activeFeatures = parseHeroFeatures(homepageConfig.heroFeaturesJson).filter(
                        (f) => f.enabled !== false
                      );
                      if (activeFeatures.length === 0) return null;
                      return (
                        <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 sm:gap-x-0 border-t border-slate-200/70 sm:border-t-0">
                          {activeFeatures.map((feat, idx) => (
                            <div
                              key={feat.id || idx}
                              className={`pt-3 sm:pt-0 ${
                                idx === 0
                                  ? "sm:pr-5"
                                  : idx === activeFeatures.length - 1
                                  ? "pl-3 sm:pl-5 border-l border-slate-200/90"
                                  : "pl-3 sm:px-5 border-l border-slate-200/90"
                              } ${idx >= 2 ? "border-t sm:border-t-0" : ""}`}
                            >
                              <div className="mb-1.5 sm:mb-2 text-[#0b192c]">
                                {renderHeroFeatureIcon(feat.icon)}
                              </div>
                              <h3 className="text-xs sm:text-[13px] font-bold text-[#0b192c] leading-snug">
                                {feat.title}
                              </h3>
                              <p className="text-[11px] sm:text-[11.5px] text-[#526071] mt-0.5 leading-snug">
                                {feat.subtitle}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Accepted Cryptocurrency Payments (Managed & One-Click Hideable from Admin Panel) */}
              {homepageConfig.cryptoBarVisible !== "false" && (() => {
                const activeCryptos = parseAcceptedCryptos(homepageConfig.acceptedCryptosJson).filter(
                  (c) => c.enabled !== false
                );
                if (activeCryptos.length === 0) return null;
                return (
                  <div className="w-full bg-[#eef7f4] border-t border-[#dfeee8]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-5 flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-10">
                      {/* Left: We Accept Cryptocurrency Payments */}
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        {/* Green Droplet + Bitcoin Badge */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 relative flex items-center justify-center">
                          <svg
                            className="w-full h-full drop-shadow-2xs"
                            viewBox="0 0 44 44"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 3C22 3 8 15.6 8 25.5C8 33.232 14.268 39.5 22 39.5C29.732 39.5 36 33.232 36 25.5C36 15.6 22 3 22 3Z"
                              fill="#059669"
                            />
                            <path
                              d="M27.32 23.85c.23-1.52-.93-2.34-2.51-2.88l.51-2.06-1.25-.31-.5 2c-.33-.08-.67-.16-1-.24l.5-2.01-1.25-.31-.51 2.05c-.27-.06-.54-.12-.8-.19l-1.73-.43-.33 1.34s.93.21.91.23c.51.13.6.46.58.73l-.58 2.34c.03.01.08.03.13.05l-.13-.03-.82 3.29c-.06.15-.22.38-.58.29.01.02-.91-.23-.91-.23l-.62 1.43 1.63.41c.3.08.6.16.89.23l-.52 2.09 1.25.31.51-2.06c.34.09.67.18 1 .26l-.51 2.05 1.25.31.52-2.08c2.14.41 3.75.24 4.43-1.69.55-1.56-.03-2.46-1.16-3.05.82-.19 1.44-.73 1.61-1.84zm-2.88 4.04c-.39 1.57-3.04.72-3.9.51l.7-2.79c.86.21 3.61.64 3.2 2.28zm.39-4.06c-.36 1.43-2.57.7-3.29.52l.63-2.53c.72.18 3.04.52 2.66 2.01z"
                              fill="#FFFFFF"
                            />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="block text-[11px] sm:text-xs font-semibold text-[#334155] leading-tight">
                            {homepageConfig.cryptoBarSmallLabel || "We Accept"}
                          </span>
                          <span className="block text-base sm:text-lg md:text-xl font-extrabold text-[#0b192c] tracking-tight leading-tight">
                            {homepageConfig.cryptoBarTitle || "Cryptocurrency Payments"}
                          </span>
                        </div>
                      </div>

                      {/* Divider (Horizontal on Mobile/Tablet, Vertical on Desktop) */}
                      <div className="w-full max-w-xs h-px lg:w-px lg:h-10 bg-[#cbd5e1]/80" />

                      {/* Right: Dynamic Native Cryptocurrency Badges */}
                      <div className="w-full lg:w-auto flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-11">
                        {activeCryptos.map((crypto) => {
                          const resolvedLogo = resolveCryptoLogoUrl(crypto.logoUrl, crypto.symbol);
                          return (
                            <div
                              key={crypto.id}
                              className="flex flex-col xs:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center xs:text-left px-1"
                            >
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 drop-shadow-2xs bg-white/80">
                                <img
                                  src={resolvedLogo}
                                  alt={crypto.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = resolveCryptoLogoUrl("", crypto.symbol);
                                  }}
                                />
                              </div>
                              <div>
                                <span className="block text-xs sm:text-sm font-bold text-[#0b192c] leading-tight">
                                  {crypto.name}
                                </span>
                                <span className="block text-[10.5px] sm:text-xs text-[#64748b] font-medium leading-tight mt-0.5">
                                  ({crypto.symbol.replace(/[()]/g, "")})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-8">
              {/* Reagents Categorization Panels */}
              {(() => {
                const t = UI_TRANSLATIONS[homepageConfig.defaultLanguage || "en"] || UI_TRANSLATIONS.en;
                return (
                  <>
                    <div
                      id="catalog-categories-bar"
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 select-none"
                    >
                      <div className="w-full sm:w-auto overflow-hidden">
                        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none font-heading flex-nowrap whitespace-nowrap scroll-smooth max-w-full">
                          {["All", ...appCategories.map(c => c.name), ...Array.from(new Set(appProducts.map(p => typeof p.category === 'object' && p.category !== null ? (p.category as any).name : p.category))).filter(c => c && !appCategories.find(ac => ac.name === c))].map((catName) => (
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
                              {catName === "All" ? t.allCategories : catName}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-mono shrink-0">
                        {t.showingReagents} <strong className="text-slate-700 font-bold">{filteredProducts.length}</strong> {t.authenticatedReagents}
                      </div>
                    </div>

                    {/* Product card grid */}
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl max-w-lg mx-auto select-none shadow-xs animate-fade-in">
                        <FlaskConicalOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-slate-700 font-heading">{t.noReagentsFound}</h3>
                        <p className="text-xs text-slate-400 mt-1">Adjust your catalog filters or correct the nomenclature query.</p>
                        <button
                          onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs rounded-xl cursor-pointer font-medium transition"
                        >
                          {t.resetFilters}
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
                  </>
                );
              })()}

            {/* Compliance advisory footnote */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between select-none text-slate-500 shadow-xs">
              <div className="flex gap-3 items-center text-xs">
                <ShieldAlert className="w-6 h-6 text-blue-600 shrink-0" />
                <p className="leading-normal text-slate-500">
                  <span className="mr-1.5">{homepageConfig.complianceEmoji}</span> 
                  <strong>{homepageConfig.complianceTitle}</strong> {homepageConfig.complianceText}
                </p>
              </div>
              <button
                onClick={handleOpenHelp}
                className="px-4.5 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100/50 rounded-xl cursor-pointer transition shrink-0 self-stretch sm:self-auto text-center"
                id="view-faq-manual-btn"
              >
                {homepageConfig.complianceBtnText}
              </button>
            </div>
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
                {homepageConfig.footerLogoUrl && homepageConfig.footerLogoUrl.trim().length > 0 ? (
                  <img
                    key="footer-custom-logo"
                    src={homepageConfig.footerLogoUrl.trim()}
                    alt="Footer Brand Logo"
                    className="h-9 md:h-10 w-auto max-w-[200px] object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div key="footer-title-logo" className="inline-flex items-center gap-2.5">
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
                )}
              </div>

              <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
                Global supplier of analytical reagents, ACS & HPLC grade solvents, buffering solutions, and certified laboratory materials conforming to GHS and OSHA regulatory standards.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${(homepageConfig.adminWhatsappNumber || "15099941048").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#0052cc]" />
                  <span>WhatsApp Desk: +{homepageConfig.adminWhatsappNumber || "1 (509) 994-1048"}</span>
                </a>
              </div>
            </div>

            {/* Navigation Columns (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Column 1: Company */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Company
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigate("store")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Product Catalog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("about")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      About Company
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("compliance")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Quality & Compliance
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("contact")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Contact Us
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Shipping & Support */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Logistics & Support
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("shipping")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Shipping & Hazmat Transit
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("return")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Returns & Claims
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("refund")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Refund Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleOpenHelp}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Safety & FAQ Manual
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal & Regulatory */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 tracking-wide">
                  Legal & Regulatory
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("terms")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("privacy")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("disclaimer")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Safety Disclaimer
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPolicy("cookie")}
                      className="text-slate-500 hover:text-[#0052cc] transition-colors cursor-pointer"
                    >
                      Cookie Policy
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
        appName={homepageConfig.appName || "Aniixa"}
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
            <p className="font-extrabold text-emerald-800 uppercase tracking-widest text-[8.5px] font-mono leading-none">WhatsApp Helpline</p>
            <p className="font-bold text-slate-705 mt-1 select-all">+1 (509) 994-1048</p>
            <p className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">Text Only (No Calls) - Online 24/7</p>
          </div>
        </div>
        
        <a
          href="https://wa.me/15099941048"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3 md:p-3.5 md:px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-xs cursor-pointer border border-emerald-400/20"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp Help</span>
          <span className="sm:hidden">Help</span>
        </a>
      </div>

    </div>
  );
}
