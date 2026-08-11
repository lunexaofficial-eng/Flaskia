/**
 * Developed by MOHAMMAD NURULLAH
 * The Founder of OMYRA TECHNOLOGIES
 * Contact email: contact@omyra.org
 * Secondary email: matrixgyan0786@gmail.com
 * OMYRA ECOSYSTEM URL: www.omyra.org
 */

import pg from "pg";
import bcrypt from "bcryptjs";
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_wLYJ4Ezn6Oru@ep-flat-dawn-aol0282a-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Database Entity Mappings
export function mapCategoryFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  };
}

export function formatImageProxyUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("https://storage.rexvora.com") || url.includes("rexvora.com")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function mapProductFromDb(row: any) {
  if (!row) return null;
  const rawImage = row.image || "";
  const rawGallery = row.gallery_urls ? (typeof row.gallery_urls === "string" ? JSON.parse(row.gallery_urls) : row.gallery_urls) : [];
  const galleryUrls = Array.isArray(rawGallery) ? rawGallery.map((g: string) => formatImageProxyUrl(g)) : [];

  return {
    id: row.id,
    name: row.name,
    formula: row.formula || "",
    grade: row.grade || "",
    cas: row.cas || "",
    purity: row.purity || "",
    description: row.description || "",
    price: parseFloat(row.price),
    unit: row.unit || "",
    stock: parseInt(row.stock),
    categoryId: row.category_id,
    image: formatImageProxyUrl(rawImage),
    videoUrl: row.video_url || "",
    galleryUrls: galleryUrls,
    sdsUrl: row.sds_url || "",
    physicalState: row.physical_state || "",
    boilingPoint: row.boiling_point || "",
    meltingPoint: row.melting_point || "",
    molecularWeight: row.molecular_weight || "",
    ghsPictograms: row.ghs_pictograms ? JSON.parse(row.ghs_pictograms) : [],
    nfpaHealth: parseInt(row.nfpa_health) || 0,
    nfpaFlammability: parseInt(row.nfpa_flammability) || 0,
    nfpaInstability: parseInt(row.nfpa_instability) || 0,
    nfpaSpecial: row.nfpa_special || "",
    nfpa: {
      health: parseInt(row.nfpa_health) || 0,
      flammability: parseInt(row.nfpa_flammability) || 0,
      instability: parseInt(row.nfpa_instability) || 0,
      special: row.nfpa_special || "",
    },
    sds: {
      hazardStatements: row.ghs_pictograms ? JSON.parse(row.ghs_pictograms) : [],
      precautionaryStatements: ["Handle according to standard lab procedures."],
      sections: []
    }
  };
}

export function mapCustomerFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    institution: row.institution || "",
    licenseId: row.license_id || "N/A",
    city: row.city || "",
    room: row.room || "",
    state: row.state || "",
    zip: row.zip || "",
    activeOrders: parseInt(row.active_orders) || 0,
    joinedDate: row.joined_date || "",
    role: row.role || "CUSTOMER",
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    mobile: row.mobile || "",
    emailVerified: row.email_verified || false,
    avatar: row.avatar || "",
    twoFactorEnabled: row.is_two_factor_enabled || false,
    isBanned: row.is_banned || false,
    phone: row.mobile || "", // map phone to mobile for CustomerProfile interface compatibility
    address: row.address || "",
    country: row.country || "",
    billingAddress: row.billing_address || "",
    billingRoom: row.billing_room || "",
    billingCity: row.billing_city || "",
    billingState: row.billing_state || "",
    billingZip: row.billing_zip || "",
    billingCountry: row.billing_country || "",
  };
}

export function mapOrderFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    date: row.date,
    amount: parseFloat(row.amount),
    paymentId: row.payment_id || "",
    status: row.status,
    cancellationReason: row.cancellation_reason || "",
    customerId: row.customer_id,
    paymentMethodId: row.payment_method_id || null,
    paymentReference: row.payment_reference || null,
    paymentProofUrl: row.payment_proof_url || null,
    billingSameAsShipping: row.billing_same_as_shipping !== false,
    billingAddress: row.billing_address || "",
    billingRoom: row.billing_room || "",
    billingCity: row.billing_city || "",
    billingState: row.billing_state || "",
    billingZip: row.billing_zip || "",
    billingCountry: row.billing_country || "",
    currency: row.currency || "USD",
  };
}

export function mapOrderItemFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    qty: parseInt(row.qty),
    packageSize: row.package_size || "",
    price: parseFloat(row.price),
  };
}

export function mapFaqFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
    keywords: row.keywords ? JSON.parse(row.keywords) : [],
  };
}

export function mapShipmentFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    type: row.type,
    status: row.status,
    otpUsed: row.otp_used,
    deliveryDate: row.delivery_date,
    trackingId: row.tracking_id || "",
    courierName: row.courier_name || "",
    deliveredAt: row.delivered_at,
    // omitting otp_hash to avoid leaking it
  };
}

export function mapTrackingUpdateFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    shipmentId: row.shipment_id,
    statusText: row.status_text,
    locationText: row.location_text || "",
    createdAt: row.created_at,
  };
}

export function mapPolicyFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    content: row.content || "",
  };
}

// Database creation & seed tables
export async function initDb(frontProducts?: any[]) {
  console.log("Initializing PostgreSQL Database Tables...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // 2. Products
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        formula VARCHAR(255),
        grade VARCHAR(255),
        cas VARCHAR(255),
        purity VARCHAR(255),
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50),
        stock INTEGER NOT NULL,
        category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
        image TEXT,
        physical_state VARCHAR(100),
        boiling_point VARCHAR(100),
        melting_point VARCHAR(100),
        molecular_weight VARCHAR(100),
        ghs_pictograms TEXT,
        nfpa_health INTEGER,
        nfpa_flammability INTEGER,
        nfpa_instability INTEGER,
        nfpa_special VARCHAR(50),
        video_url TEXT,
        gallery_urls TEXT
      )
    `);

    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls TEXT;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sds_url TEXT;`);

    // 3. Customers
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        institution VARCHAR(255),
        license_id VARCHAR(255),
        city VARCHAR(255),
        room VARCHAR(255),
        state VARCHAR(100),
        zip VARCHAR(50),
        active_orders INTEGER DEFAULT 0,
        joined_date VARCHAR(50),
        role VARCHAR(50) DEFAULT 'CUSTOMER'
      )
    `);

    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS state VARCHAR(100);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS zip VARCHAR(50);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS mobile VARCHAR(100);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar TEXT;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_two_factor_enabled BOOLEAN DEFAULT FALSE;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS country VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_room VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_city VARCHAR(255);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_state VARCHAR(100);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_zip VARCHAR(50);`);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_country VARCHAR(255);`);

    // Create supporting security tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer_otps (
        email VARCHAR(255) PRIMARY KEY,
        otp_code VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        attempts INTEGER DEFAULT 0,
        last_sent_at TIMESTAMPTZ DEFAULT NOW(),
        rate_limit_count INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id VARCHAR(100) PRIMARY KEY,
        customer_id VARCHAR(100) REFERENCES customers(id) ON DELETE CASCADE,
        address_line_1 TEXT NOT NULL,
        address_line_2 TEXT,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        postal_code VARCHAR(50) NOT NULL,
        country VARCHAR(255) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS login_logs (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES customers(id) ON DELETE CASCADE,
        ip_address VARCHAR(50),
        user_agent TEXT,
        login_time TIMESTAMPTZ DEFAULT NOW(),
        login_status VARCHAR(50) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(100) PRIMARY KEY,
        admin_id VARCHAR(100) REFERENCES customers(id) ON DELETE CASCADE,
        device_name VARCHAR(255),
        browser VARCHAR(100),
        ip_address VARCHAR(50),
        login_time TIMESTAMPTZ DEFAULT NOW(),
        last_activity TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Seed default Admin if not exists
    const adminQueryCheck = await client.query("SELECT COUNT(*) FROM customers WHERE role = 'ADMIN' OR email = 'lunexa.official@gmail.com'");
    if (parseInt(adminQueryCheck.rows[0].count) === 0) {
      console.log("Seeding default secure Admin profile 'lunexa.official@gmail.com' in PostgreSQL...");
      const hashedAdminPw = bcrypt.hashSync("Md1620@gmail", 10);
      await client.query(`
        INSERT INTO customers (
          id, name, first_name, last_name, email, role, email_verified, password_hash, joined_date, active_orders
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
      `, [
        "usr-admin",
        "LUNEXA Administrator",
        "LUNEXA",
        "Administrator",
        "lunexa.official@gmail.com",
        "ADMIN",
        true,
        hashedAdminPw,
        new Date().toLocaleDateString()
      ]);
    }

    // 4. Orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_id VARCHAR(255),
        status VARCHAR(100) NOT NULL,
        customer_id VARCHAR(100) REFERENCES customers(id) ON DELETE SET NULL,
        payment_method_id VARCHAR(100),
        payment_reference VARCHAR(255),
        payment_proof_url TEXT
      )
    `);

    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_id VARCHAR(100);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address TEXT;`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_room VARCHAR(255);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_city VARCHAR(255);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_state VARCHAR(100);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_zip VARCHAR(50);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_country VARCHAR(255);`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT TRUE;`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD';`);
    await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;`);

    // 5. Order Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(100),
        qty INTEGER NOT NULL,
        package_size VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    // 6. Faqs
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        keywords TEXT
      )
    `);

    // 7. Homepage configs
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_config (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT
      )
    `);

    // 8. Shipments
    await client.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
        type VARCHAR(50),
        status VARCHAR(100) NOT NULL,
        otp_hash VARCHAR(255),
        otp_used BOOLEAN DEFAULT FALSE,
        delivery_date VARCHAR(100),
        tracking_id VARCHAR(255),
        courier_name VARCHAR(255),
        delivered_at TIMESTAMPTZ
      )
    `);

    await client.query(`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS otp_code VARCHAR(50);`);

    // 9. Tracking Updates
    await client.query(`
      CREATE TABLE IF NOT EXISTS tracking_updates (
        id VARCHAR(100) PRIMARY KEY,
        shipment_id VARCHAR(100) REFERENCES shipments(id) ON DELETE CASCADE,
        status_text VARCHAR(255) NOT NULL,
        location_text VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 10. Media Uploads
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id VARCHAR(100) PRIMARY KEY,
        url TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 11. Company Policies
    await client.query(`
      CREATE TABLE IF NOT EXISTS company_policies (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        content TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 12. Payment Methods
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        details JSONB
      )
    `);

    // 13. PayPal Payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(id) ON DELETE SET NULL,
        paypal_order_id VARCHAR(255),
        status VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        payer_email VARCHAR(255),
        capture_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 14. PayPal Webhooks Ledger
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_webhooks (
        id VARCHAR(100) PRIMARY KEY,
        event_id VARCHAR(255) UNIQUE,
        event_type VARCHAR(255) NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 15. Refunds System
    await client.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(id) ON DELETE SET NULL,
        payment_id VARCHAR(100),
        paypal_refund_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(100) NOT NULL,
        reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 16. Invoices System
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 17. Simulated Email Desk Tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulated_emails (
        id VARCHAR(100) PRIMARY KEY,
        customer_email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        order_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 18. B2B IndiaMART Inquiries & RFQs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price VARCHAR(100),
        quantity VARCHAR(100) NOT NULL,
        buyer_name VARCHAR(255) NOT NULL,
        buyer_email VARCHAR(255) NOT NULL,
        buyer_phone VARCHAR(100),
        company_name VARCHAR(255),
        delivery_pincode VARCHAR(50),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'PENDING',
        customer_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_id VARCHAR(100);`);
    await client.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`);

    // 19. B2B Inquiry Threaded Messages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiry_messages (
        id VARCHAR(100) PRIMARY KEY,
        inquiry_id VARCHAR(100) REFERENCES inquiries(id) ON DELETE CASCADE,
        sender_role VARCHAR(50) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        sender_email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Add high-performance indexes for foreign keys, joins, and lookup filters
    console.log("Applying high-performance database indexes to tables...");
    await client.query("CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_tracking_shipment ON tracking_updates(shipment_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_simulated_emails_customer ON simulated_emails(LOWER(customer_email))");
    await client.query("CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS idx_inquiries_buyer_email ON inquiries(LOWER(buyer_email))");
    await client.query("CREATE INDEX IF NOT EXISTS idx_inquiry_messages_inquiry ON inquiry_messages(inquiry_id)");

    await client.query("COMMIT");
    console.log("Tables structure set up successfully on Neon.");

    // Seeding Categories if empty
    const catCheck = await client.query("SELECT COUNT(*) FROM categories");
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log("Seeding initial categories...");
      const categoriesSet = [
        {
          id: "reagents",
          name: "Reagents",
          description: "Chemical active compound reagents",
        },
        {
          id: "buffers",
          name: "Buffers",
          description: "pH balancing buffer reagents",
        },
        {
          id: "indicators",
          name: "Indicators",
          description: "pH transition color metrics",
        },
        {
          id: "glassware",
          name: "Glassware",
          description: "Heavy duty borosilicate glassware",
        },
      ];
      for (const cat of categoriesSet) {
        await client.query(
          "INSERT INTO categories (id, name, description) VALUES ($1, $2, $3)",
          [cat.id, cat.name, cat.description],
        );
      }
    }

    // Seeding Products if empty
    const prodCheck = await client.query("SELECT COUNT(*) FROM products");
    if (parseInt(prodCheck.rows[0].count) === 0) {
      console.log("Seeding initial products database...");
      // Let's directly create some default products to avoid import side-effects on startup
      const defaultProducts = [
        {
          id: "copper-sulfate",
          name: "Copper(II) Sulfate Pentahydrate",
          formula: "CuSO4 · 5H2O",
          grade: "ACS Reagent Grade",
          cas: "7758-99-8",
          purity: "≥99.0%",
          description:
            "Fine blue crystalline powder intended for qualitative biochemical testing, protein concentration assays, and crystal growth academic workshops.",
          price: 34.5,
          unit: "500g bottle",
          stock: 45,
          categoryId: "reagents",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200",
          physicalState: "Solid",
          boilingPoint: "Decomposes",
          meltingPoint: "110 °C (loses water)",
          molecularWeight: "249.69 g/mol",
          ghsPictograms: ["GHS07", "GHS09"],
          nfpaHealth: 2,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "potassium-permanganate",
          name: "Potassium Permanganate",
          formula: "KMnO4",
          grade: "Technical/Educational Grade",
          cas: "7722-64-7",
          purity: "≥98.5%",
          description:
            "Deep purple crystals providing powerful oxidizing properties. Broadly specified for analytical titrations, educational safe combustion models, and water purification laboratories.",
          price: 42.0,
          unit: "250g glass jar",
          stock: 20,
          categoryId: "reagents",
          image:
            "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=200",
          physicalState: "Solid",
          boilingPoint: "Decomposes at 240 °C",
          meltingPoint: "240 °C",
          molecularWeight: "158.03 g/mol",
          ghsPictograms: ["GHS03", "GHS07", "GHS09"],
          nfpaHealth: 1,
          nfpaFlammability: 0,
          nfpaInstability: 2,
          nfpaSpecial: "OX",
        },
        {
          id: "citric-acid",
          name: "Citric Acid Monohydrate",
          formula: "C6H8O7 · H2O",
          grade: "USP/FCC Food Grade",
          cas: "5949-29-1",
          purity: "≥99.5%",
          description:
            "Crystalline white granules ideal for acid-base buffer preparation, pH adjustments, chemistry demonstration kit compounding, and organic acid metal chelation modeling.",
          price: 18.2,
          unit: "1kg container",
          stock: 120,
          categoryId: "reagents",
          image:
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=200",
          physicalState: "Solid",
          boilingPoint: "N/A",
          meltingPoint: "135 °C",
          molecularWeight: "210.14 g/mol",
          ghsPictograms: ["GHS07"],
          nfpaHealth: 1,
          nfpaFlammability: 1,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "buffer-ph-4",
          name: "pH 4.01 Buffer Calibration Solution",
          formula: "Phthalate Buffer Solution",
          grade: "NIST Traceable Reference",
          cas: "Mixture",
          purity: "pH 4.01 ± 0.01 at 25°C",
          description:
            "Certified red physical buffer system strictly calibrated for physical validation of digital glassware pH meters. Resists biological degradation during typical classroom modeling.",
          price: 15.0,
          unit: "500ml squeeze bottle",
          stock: 80,
          categoryId: "buffers",
          image:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200",
          physicalState: "Liquid",
          boilingPoint: "100 °C",
          meltingPoint: "0 °C",
          molecularWeight: "N/A",
          ghsPictograms: [],
          nfpaHealth: 0,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "buffer-ph-7",
          name: "pH 7.00 Buffer Calibration Solution",
          formula: "Phosphate Buffer Solution",
          grade: "NIST Traceable Reference",
          cas: "Mixture",
          purity: "pH 7.00 ± 0.01 at 25°C",
          description:
            "Certified yellow buffer reference formulated with secondary sodium phosphate to assure reliable center-scale standardization of laboratory laboratory meters.",
          price: 15.0,
          unit: "500ml squeeze bottle",
          stock: 75,
          categoryId: "buffers",
          image:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200",
          physicalState: "Liquid",
          boilingPoint: "100 °C",
          meltingPoint: "0 °C",
          molecularWeight: "N/A",
          ghsPictograms: [],
          nfpaHealth: 0,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "buffer-ph-10",
          name: "pH 10.01 Buffer Calibration Solution",
          formula: "Carbonate Buffer Solution",
          grade: "NIST Traceable Reference",
          cas: "Mixture",
          purity: "pH 10.01 ± 0.02 at 25°C",
          description:
            "Certified blue high-alkaline calibration buffer, packaged hermetically under protective inert gas layer to defend against carbon dioxide neutralization.",
          price: 16.5,
          unit: "500ml squeeze bottle",
          stock: 50,
          categoryId: "buffers",
          image:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200",
          physicalState: "Liquid",
          boilingPoint: "100 °C",
          meltingPoint: "0 °C",
          molecularWeight: "N/A",
          ghsPictograms: [],
          nfpaHealth: 1,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "phenolphthalein-ind",
          name: "Phenolphthalein 1% Indicator Solution",
          formula: "C20H14O4 (Modified)",
          grade: "ACS Grade Reagent",
          cas: "77-09-8",
          purity: "1.0% in Isopropanol/Water",
          description:
            "Standard laboratory testing titration indicator, transitioning cleanly from totally transparent acidic configuration to bright pink above alkaline threshold pH 8.2.",
          price: 24.0,
          unit: "100ml dropper bottle",
          stock: 32,
          categoryId: "indicators",
          image:
            "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=200",
          physicalState: "Liquid",
          boilingPoint: "82 °C",
          meltingPoint: "-89 °C",
          molecularWeight: "318.32 g/mol (Solute)",
          ghsPictograms: ["GHS02", "GHS07", "GHS08"],
          nfpaHealth: 2,
          nfpaFlammability: 3,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "bromothymol-blue",
          name: "Bromothymol Blue 0.1% Solution",
          formula: "C27H28Br2O5S",
          grade: "Reagent Grade",
          cas: "76-59-5",
          purity: "0.1% Aqueous Solution",
          description:
            "Broad-spectrum acid-base colorimetric indicator shifting from golden yellow (pH 6.0) through emerald green to royal blue (pH 7.6) for clear cellular respiration models.",
          price: 21.5,
          unit: "125ml dropper bottle",
          stock: 40,
          categoryId: "indicators",
          image:
            "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=200",
          physicalState: "Liquid",
          boilingPoint: "100 °C",
          meltingPoint: "0 °C",
          molecularWeight: "624.38 g/mol (Solute)",
          ghsPictograms: [],
          nfpaHealth: 0,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "flask-bo-250",
          name: "Class A Borosilicate Erlenmeyer Flask",
          formula: "SiO2 / B2O3 Glass",
          grade: "ASTM E1404 Standard Specification",
          cas: "65997-17-3",
          purity: "3.3 Coefficient of Expansion",
          description:
            "Precision laboratory glassware incorporating heavy beaded rims, high-contrast white volume charts, and specialized structural curves engineered to resist thermal stress and chemical synthesis.",
          price: 19.5,
          unit: "Pack of 3 (250ml)",
          stock: 90,
          categoryId: "glassware",
          image:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200",
          physicalState: "Solid",
          boilingPoint: "N/A",
          meltingPoint: "820 °C (softening)",
          molecularWeight: "N/A",
          ghsPictograms: [],
          nfpaHealth: 0,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
        {
          id: "beaker-bo-500",
          name: "Class A Borosilicate Griffin Cup Beaker",
          formula: "3.3 Borosilicate Glass",
          grade: "ASTM E960 Standard",
          cas: "65997-17-3",
          purity: "Commercial Grade 3.3 Glass",
          description:
            "Heavy-duty beaker designed with double-scale volume markings and a precision mold pour spout to facilitate zero spill transfers of hot reactive acid buffers.",
          price: 28.0,
          unit: "Pack of 2 (500ml)",
          stock: 65,
          categoryId: "glassware",
          image:
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200",
          physicalState: "Solid",
          boilingPoint: "N/A",
          meltingPoint: "820 °C",
          molecularWeight: "N/A",
          ghsPictograms: [],
          nfpaHealth: 0,
          nfpaFlammability: 0,
          nfpaInstability: 0,
          nfpaSpecial: "",
        },
      ];

      for (const p of defaultProducts) {
        await client.query(
          `
          INSERT INTO products (
            id, name, formula, grade, cas, purity, description, price, unit, stock, category_id,
            image, physical_state, boiling_point, melting_point, molecular_weight, ghs_pictograms,
            nfpa_health, nfpa_flammability, nfpa_instability, nfpa_special
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        `,
          [
            p.id,
            p.name,
            p.formula,
            p.grade,
            p.cas,
            p.purity,
            p.description,
            p.price,
            p.unit,
            p.stock,
            p.categoryId,
            p.image,
            p.physicalState,
            p.boilingPoint,
            p.meltingPoint,
            p.molecularWeight,
            JSON.stringify(p.ghsPictograms),
            p.nfpaHealth,
            p.nfpaFlammability,
            p.nfpaInstability,
            p.nfpaSpecial,
          ],
        );
      }
    }

    // Seeding Customers if empty
    const custCheck = await client.query("SELECT COUNT(*) FROM customers");
    if (parseInt(custCheck.rows[0].count) === 0) {
      console.log("Seeding initial customers...");
      const customersSet = [
        {
          id: "cust-1",
          name: "Dr. Eleanor Vance",
          email: "e.vance@stateuniversity.edu",
          institution: "Federal Chemistry Research Institute",
          licenseId: "N/A",
          city: "Chicago",
          room: "Laboratory 402B",
          activeOrders: 1,
          joinedDate: "2026-01-15",
          role: "CUSTOMER",
        },
        {
          id: "cust-2",
          name: "Prof. Marcus Brody",
          email: "mbrody@marshall.edu",
          institution: "Marshall College Dept of Archaeology",
          licenseId: "N/A",
          city: "San Jose",
          room: "Sequencing Suite 2",
          activeOrders: 1,
          joinedDate: "2026-03-22",
          role: "CUSTOMER",
        },
      ];
      for (const cust of customersSet) {
        await client.query(
          `
          INSERT INTO customers (id, name, email, institution, license_id, city, room, active_orders, joined_date, role)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
          [
            cust.id,
            cust.name,
            cust.email,
            cust.institution,
            cust.licenseId,
            cust.city,
            cust.room,
            cust.activeOrders,
            cust.joinedDate,
            cust.role,
          ],
        );
      }
    }

    // Seeding Orders if empty
    const orderCheck = await client.query("SELECT COUNT(*) FROM orders");
    if (parseInt(orderCheck.rows[0].count) === 0) {
      console.log("Seeding initial orders...");
      const ordersSet = [
        {
          id: "ord-9012",
          orderId: "REX-5928-LUN",
          date: "2026-06-08",
          amount: 34.5,
          paymentId: "ch_pay_3M92nK8f",
          status: "compliance_check",
          customerId: "cust-1",
        },
        {
          id: "ord-9013",
          orderId: "REX-9204-LUN",
          date: "2026-06-07",
          amount: 58.1,
          paymentId: "ch_pay_9Wj1pK3c",
          status: "dispatched",
          customerId: "cust-2",
        },
      ];
      for (const ord of ordersSet) {
        await client.query(
          `
          INSERT INTO orders (id, order_id, date, amount, payment_id, status, customer_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [
            ord.id,
            ord.orderId,
            ord.date,
            ord.amount,
            ord.paymentId,
            ord.status,
            ord.customerId,
          ],
        );
      }

      // Seeding Order Items
      const itemsSet = [
        {
          id: "item-1",
          orderId: "ord-9012",
          productId: "copper-sulfate",
          qty: 1,
          packageSize: "500g",
          price: 34.5,
        },
        {
          id: "item-2",
          orderId: "ord-9013",
          productId: "citric-acid",
          qty: 1,
          packageSize: "1kg",
          price: 18.2,
        },
      ];
      for (const it of itemsSet) {
        await client.query(
          `
          INSERT INTO order_items (id, order_id, product_id, qty, package_size, price)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [it.id, it.orderId, it.productId, it.qty, it.packageSize, it.price],
        );
      }
    }

    // Seeding FAQs if empty
    const faqCheck = await client.query("SELECT COUNT(*) FROM faqs");
    if (parseInt(faqCheck.rows[0].count) === 0) {
      console.log("Seeding initial FAQs...");
      const faqsSet = [
        {
          id: "safety-1",
          category: "safety",
          question: "What are GHS Pictograms and why are they important?",
          answer:
            "GHS (Globally Harmonized System) pictograms are standardized graphic symbols used to communicate specific hazard information on chemical labels and Safety Data Sheets (SDS). They classify physical, environmental, and health hazards (e.g., Flammability, Toxicity, Corrosion) to alert laboratory personnel and support safe storage and handling precautions prior to synthesis.",
          keywords: [
            "ghs",
            "pictogram",
            "hazard",
            "label",
            "symbol",
            "classification",
          ],
        },
        {
          id: "safety-2",
          category: "safety",
          question:
            "How should I handle a potential chemical spill or emergency?",
          answer:
            "Always follow your institution's specific chemical hygiene protocol: (1) Immediately isolate the area and notify others. (2) Consult the product's Safety Data Sheet (Section 6: Accidental Release Measures) to identify the neutralizer or absorbents required. (3) Equip appropriate PPE (goggles, chemical-resistant gloves, apron). (4) Carefully clean up using solid binder material or spill kits, package the waste in a designated heavy-duty container, and consult local environmental safety guidelines for disposal.",
          keywords: [
            "spill",
            "emergency",
            "handling",
            "clean",
            "safety",
            "accident",
          ],
        },
        {
          id: "safety-3",
          category: "safety",
          question: "What is an SDS (Safety Data Sheet) and how can I find it?",
          answer:
            "An SDS is a comprehensive document detailing safety, physical properties, toxicity, ecological impacts, chemical transport classification, and disposal recommendations. You can access the complete SDS for any Flaskia reagent by clicking on the product card to open 'Detailed Specs' and expanding the interactive SDS section, which outlines OSHA-compliant Sections 1 through 16.",
          keywords: [
            "sds",
            "safety data sheet",
            "pdf",
            "section",
            "document",
            "spec",
          ],
        },
        {
          id: "safety-4",
          category: "safety",
          question: "What do the NFPA 704 Diamond values represent?",
          answer:
            "The National Fire Protection Association (NFPA) 704 standard uses a color-coded quadrant diamond to convey risk: Blue indicates Health hazard, Red indicates Flammability, Yellow indicates Instability, and White lists Special Hazards (such as oxidizers, acidic compounds, or air/water reactive chemicals). Values range from 0 (minimal risk, like pure water) to 4 (extreme reactive danger, like unstable concentrated organic peroxides).",
          keywords: [
            "nfpa",
            "diamond",
            "color",
            "red",
            "blue",
            "yellow",
            "health",
            "flammability",
          ],
        },
        {
          id: "shipping-1",
          category: "shipping",
          question: "Why is there a Hazmat surcharge on certain products?",
          answer:
            "State and international department of transportation (DOT) regulations categorize certain high-purity chemical reagents as hazardous materials (Hazmat Class 3, 8, or 9). These products require climate-temperature buffers, double-walled specialized containment packaging, and secure handling during dispatch. To offset the high insurance risk and mandatory certified logistics carriers, a $15.00 Hazmat surcharge is automatically applied to orders containing active hazard reagents.",
          keywords: [
            "hazmat",
            "shipping",
            "surcharge",
            "delivery",
            "fee",
            "cost",
            "transport",
          ],
        },
        {
          id: "shipping-2",
          category: "shipping",
          question:
            "Can chemicals be shipped directly to residential/home addresses?",
          answer:
            "No. To maintain custody control, prevent accidental poisoning, and abide by environmental regulations, Flaskia strictly ships academic reagents and laboratory equipment to verified educational institutions, commercial facilities, and dedicated research entities with active license credentials. Residential deliveries of chemical reagents are completely prohibited.",
          keywords: [
            "residential",
            "home",
            "address",
            "shipping",
            "place",
            "deliver",
          ],
        },
        {
          id: "shipping-3",
          category: "shipping",
          question: "What temperature controls are used during transit?",
          answer:
            "Flaskia utilizes proprietary climate-regulated packaging consisting of thermal insulated foil inserts and cold gel packs for high-volatility compounds or sensitive indicators. This shields reagents from excessive summer heat spikes or extreme winter drops, preserving chemical stability and preventing container pressurized degasification from synthesis warehouse to classroom labs.",
          keywords: [
            "temperature",
            "transit",
            "climate",
            "cold",
            "heat",
            "stability",
          ],
        },
        {
          id: "compliance-1",
          category: "compliance",
          question:
            "Do I need institutional verification or a license to purchase?",
          answer:
            "Yes. Flaskia requires all customers seeking active chemical reagents to register with a valid institutional identifier, academic email, researchers' credentials, and a chemical custody license matching DEA, OSHA, or local toxic control regulations. You can input these credentials during checkout. Our automated compliance checker verifies licenses against active registries before dispatch.",
          keywords: [
            "license",
            "verification",
            "institution",
            "academic",
            "purchase",
            "checkout",
          ],
        },
        {
          id: "compliance-2",
          category: "compliance",
          question:
            "What is the difference between chemical grades (e.g., ACS vs. Tech)?",
          answer:
            "ACS Reagent grade indicates the chemical conforms to strict purity specifications set by the American Chemical Society (usually ≥95-99% absolute concentration with micro-impurity thresholds), making it high-fidelity for quantitative analysis. Technical or Educational grade chemicals are lower-cost solutions designed for school demonstrations where extremely minute trace metallic impurities will not disrupt experiment synthesis outcomes.",
          keywords: [
            "grade",
            "purity",
            "acs",
            "reagent",
            "technical",
            "difference",
            "demonstration",
          ],
        },
        {
          id: "compliance-3",
          category: "compliance",
          question: "How does Flaskia uphold legal custody regulations?",
          answer:
            "Our operations comply directly with EPA toxic control standards, DOT transport manuals, and OSHA safety guidelines. All orders undergo rigorous institutional checks, and all packaging includes physical safety documentation (SDS and GHS warning prints) directly in the parcel. We also record strict digital logs of lot numbers, purities, and transport chains for complete traceability.",
          keywords: [
            "regulation",
            "compliance",
            "legal",
            "safety",
            "epa",
            "osha",
            "traceability",
          ],
        },
      ];

      for (const faq of faqsSet) {
        await client.query(
          "INSERT INTO faqs (id, category, question, answer, keywords) VALUES ($1, $2, $3, $4, $5)",
          [
            faq.id,
            faq.category,
            faq.question,
            faq.answer,
            JSON.stringify(faq.keywords),
          ],
        );
      }
    }

    // Seeding Homepage Config if empty
    const homeConfigCheck = await client.query(
      "SELECT COUNT(*) FROM homepage_config",
    );
    if (parseInt(homeConfigCheck.rows[0].count) === 0) {
      console.log("Seeding initial homepage config...");
      const defaultHomepageConfig: Record<string, string> = {
        heroTag: "FDA & OSHA GHS COMPLIANT PROCUREMENT",
        heroTitle: "High-Purity Laboratory Reagents & Supplies",
        heroDescription:
          "Flaskia distributes analytical chemicals, buffering solutions, and certified Class A borosilicate glassware designed exclusively for academic synthesis, research modeling, and secondary schools educational labs.",
        heroStat1Value: "≤18 MΩ·cm",
        heroStat1Label: "Methylene conductivity standard",
        heroStat2Value: "100%",
        heroStat2Label: "SDS / GHS Clear Documentation",
        heroImageUrl:
          "/src/assets/images/chemical_hero_banner_1780924768442.png",
        heroImageAlt: "High Purity Research Chemistry Lab Illustration",
        heroWatermarkTitle: "CHEMLABS REAGENT CELL",
        heroWatermarkBadge: "Sandbox Portal",
        complianceBtnText: "Open Safety & FAQ Manual",
        complianceEmoji: "🔐",
        complianceTitle: "GHS Custody compliance assurance:",
        complianceText:
          "Flaskia monitors safety profiles continuously. Safe handling documentation complies with international chemistry standards. Settle transactions securely with our verified secure PayPal Sandbox.",
        appName: "Flaskia",
        appBrandBadge: "PRO",
        appSubtitle: "Academic Supply Direct",
        appLogoIcon: "FlaskConical",
        appFaviconUrl: "https://img.icons8.com/color/48/chemistry.png",
        footerCompanyName: "Flaskia Supplies International Co.",
        footerLicence1: "OSHA ID: 44321-REAG",
        footerLicence2: "EPA LICENSE: 7385-CHEM",
        footerLicence3: "DOT TRANSPORT: CLASS 9",
        footerCopyright:
          "Flaskia. Educational Material Logistics. Sandbox Checkout Portal.",
      };

      for (const key of Object.keys(defaultHomepageConfig)) {
        await client.query(
          "INSERT INTO homepage_config (key, value) VALUES ($1, $2)",
          [key, defaultHomepageConfig[key]],
        );
      }
    }

    // Seeding Company Policies if empty
    const policiesCheck = await client.query("SELECT COUNT(*) FROM company_policies");
    if (parseInt(policiesCheck.rows[0].count) === 0) {
      console.log("Seeding initial company policies...");
      const defaultPolicies = [
        {
          id: "about",
          title: "About {appName}",
          subtitle: "{appSubtitle} — Serving academia and verified synthesis complexes.",
          content: `Founded under the vision of democratizing clinical-grade lab chemicals for schools and research cooperatives, **{appName}** has evolved from a boutique reagents formulator into a leading domestic provider of laboratory standard chemicals, precise buffer configurations, pH indicators, and resilient borosilicate glass instruments.\n\nOur facility implements climate-locked warehousing logic, advanced DOT compliance automation for hazmat transit class routing, and meticulous batch record checks. This guarantees that your chemistry laboratory receives materials of the exact technical, laboratory, or ACS reagent grade documented.\n\nEquipping the next generation of chemists is a duty of absolute security. By providing full MSDS data and strict license checks, {appName} remains a trusted logistical companion for thousands of public science centers, high school chemistry labs, and academic research ecosystems.`
        },
        {
          id: "contact",
          title: "Contact Us",
          subtitle: "Our support staff, physical logistics desk, and regulatory officers are at your service.",
          content: `Headquarters: {footerCompanyName}\nScience logistics park, Bay 9, Seattle, WA 98101\n\nEmail: support@flaskia.com, compliance@flaskia.com\nPhone: +1 (800) 555-CHEM (M-F 8:00 AM - 5:00 PM PST)\n\nFor chemical spills or transport accidents in transit, refer directly to DOT Emergency Response Guidebook (ERG) instructions.`
        },
        {
          id: "privacy",
          title: "Privacy Policy",
          subtitle: "Approved regulatory database management and institution registration protocols.",
          content: `Because our operations involve shipping chemical substances classification materials, we maintain a secure, encrypted procurement register. This dataset contains verified researcher profiles, official academic email addresses, delivery licenses, and active billing addresses. This records system aligns directly with security compliance regulations and is fully isolated from retail tracking data.\n\nUnder certain regional toxic substances bylaws, we are legally required to document transaction logs containing names, lot numbers, and institutions for DEA List chemicals and certain hazardous indicators. This transaction data is maintained securely in our private servers and is accessible only to compliance auditors.\n\nWe never have, and never will, sell, lease, or license institutional order histories, user info, email chains, or scientific safety logs to marketing agencies, advertising networks, or third-party web tracking enterprises. Cookies are dedicated exclusively to preserving your custom session identifiers and chemical checkout cart state.`
        },
        {
          id: "terms",
          title: "Terms & Conditions",
          subtitle: "Legal conditions under which active laboratory chemical items are distributed.",
          content: `By checking out on the **{appName} Sandbox Checkout Portal**, you explicitly certify that you are an adult representative representing a school of science, a certified chemistry educational program, or a corporate laboratory entity. You must provide a valid chemistry end-use agreement verification and accept that materials will strictly reside inside accredited facility stores.\n\nAll chemical reagents are barred from dispatch to private, residential, hotel, or PO Box locations. Orders attempting to leverage home addresses will be systematically cancelled. We reserve the absolute right to suspend any customer profile mimicking an accredited institution to bypass security gates.\n\nSubstances procured through this catalog cannot be transferred to unverified third parties, exported, or diverted for home experimentation, manufacturing of pyrotechnics, or synthetic drugs. Violation of this agreement triggers swift reports containing lot numbers to appropriate federal chemistry agencies.`
        },
        {
          id: "compliance",
          title: "Compliance Policy",
          subtitle: "How regulatory frameworks are implemented in {appName}'s logistics chain.",
          content: `We execute rigorous checks to ensure safety pictograms, signal words (Danger/Warning), and hazard phrases match OSHA Standard 29 CFR 1910.1200 HazCom specifications. Our inventory systems run immediate CAS-number filters to detect restricted precursors or regulated reagents. For any substance presenting GHS Health rating \u2265 3 (e.g. skin corrosion, toxicity indicators, severe carcinogenicity risk), system safety logic blocks checkout until the user declares a binding laboratory end-use compliance agreement.\n\nEach reagent dispatch contains isolated batch lot codes linked to our formulation reports. Under regulatory bylaws, we maintain full custody archives for at least seven (7) years to permit immediate lot recalls, temperature disruption flags, and compliance review requests.`
        },
        {
          id: "disclaimer",
          title: "Safety Disclaimer",
          subtitle: "Binding precautions regarding handling and experiment execution.",
          content: `All compounds, reagents, buffering solutions, and certified indicators listed under the catalog of **{appName}** are manufactured exclusively to serve academic demonstrations, analytical titrations, scientific modeling synthesis, and secondary science laboratories.\n\nThese chemicals are **strictly not intended** and must never be utilized for: human or veterinary medical therapeutics, in vivo testing, cosmetics, or food supplements.\n\nBy completing transactions in this portal, the purchasing entity accepts sovereign custody liability. **{appName}** completely isolates itself from any accidental chemical burns, fires, localized toxic emissions, inappropriate waste disposal fines, or educational demonstration mishaps. Science lab instructors must enforce appropriate PPE standards (protective lab-goggles, chemical aprons, impervious nitrile gloves, working fume-hood extraction layouts).`
        },
        {
          id: "shipping",
          title: "Shipping & Transit Policy",
          subtitle: "How specialized hazardous substances are packed and delivered.",
          content: `Due to physical fire risk, acute poison indicators, and acidity variables in chemical transportation, our logistics networks strictly comply with DOT Hazardous Materials Regulations (Code of Federal Regulations, Title 49).\n\nFor items explicitly marked with GHS hazard warning pictograms (such as concentrated sulfuric acid, flammable liquids, or reactive copper salts), a **flat $15.00 Hazmat Surcharge** is consolidated on checkout. This offsets double-wall safety canisters, specialized vermiculite spill insulation, mandatory DOT-labeled shipping parcels, and certified hazardous transit licensing.\n\nDelicate indicators, specialized buffers, and highly volatile compounds are shipped inside temperature-regulated dry gel thermal compartments. These insulated units guard chemistry agents during hot summer heat waves or severe winter drop points to keep active concentration stable.\n\nStandard institutional delivery takes 3 to 5 business days. Rapid transport is available only after manual clearance by our compliance desk.`
        },
        {
          id: "return",
          title: "Return Policy",
          subtitle: "Strict guidelines regarding return parcels under chemical regulations.",
          content: `Once a chemical security seal is ruptured, regulatory rules strictly prohibit return shipment via standard public couriers. Reagents return is confined strictly to un-opened, factory-locked packages.\n\nNo delivery parcel can be returned to our warehouse without a pre-authorized Return Merchandise Authorization (RMA) ticket. Please contact our support desk (compliance@flaskia.com) to obtain the RMA documentation prior to making shipping arrangements.\n\nReturn windows close exactly thirty (30) days from original order dispatch. The outer regulatory seals, heat-locked bands, GHS decals, safety rings, and inner secure caps must look completely un-ruptured and clean to pass return audits.`
        },
        {
          id: "refund",
          title: "Refund Policy",
          subtitle: "Our financial rules regarding order errors, damages, and replacements.",
          content: `If a borosilicate glassware item arrives fractured, or if a chemistry reagent bottle suffers leakage in transit, take immediate high-resolution photographs **prior to opening the protective seal bag**. Notify our compliance team within 48 hours for an instant full replacement or sandbox cart credit.\n\nRefunds are processed back to the original funding account. For university departments leveraging procurement cards, please allow up to five (5) business days for credits to appear on institutional statements.\n\nOnce GHS hazmat parcels are loaded into authorized courier transit chambers, active carrier fees and safety surcharges are fully earned and non-refundable.`
        },
        {
          id: "cookie",
          title: "Cookie Policy",
          subtitle: "How technical state cookies preserve security registers during session modeling.",
          content: `This cookie policy outlines how **{appName}** employs standard browser cache data to secure transaction portals. We strictly design with functional state cookies and stay fully disjointed from tracking conglomerates.\n\nWe utilize "chemlabs_session" to preserve active logs and security locks, "chemlabs_cart" to maintain the list of reagents, and "compliance_acknowledgement" to save compliance agreements.\n\nYou can block or purge cookies using your browser settings. Please note that blocking essential cookies will disrupt the chemical cart matching system and prevent access to the Sandbox Checkout.`
        }
      ];

      for (const p of defaultPolicies) {
        await client.query(
          "INSERT INTO company_policies (id, title, subtitle, content) VALUES ($1, $2, $3, $4)",
          [p.id, p.title, p.subtitle, p.content]
        );
      }
    }

    // Dynamic frontProducts synchronization with PostgreSQL database (only if products table is currently empty to avoid restoring deleted records on restart)
    const dbProdCheck = await client.query("SELECT COUNT(*) FROM products");
    const isProductsEmpty = parseInt(dbProdCheck.rows[0].count) === 0;
    if (isProductsEmpty && frontProducts && Array.isArray(frontProducts) && frontProducts.length > 0) {
      console.log(`Verifying and sync-upserting ${frontProducts.length} frontend products with database...`);
      for (const p of frontProducts) {
        const catId = p.category ? p.category.toLowerCase() : (p.category_id || "reagents");
        const physicalState = p.physicalState || p.physical_state || "";
        const boilingPoint = p.boilingPoint || p.boiling_point || "";
        const meltingPoint = p.meltingPoint || p.melting_point || "";
        const molecularWeight = p.molecularWeight || p.molecular_weight || "";
        const ghsPics = p.ghsPictograms ? p.ghsPictograms : (p.ghs_pictograms ? (typeof p.ghs_pictograms === "string" ? JSON.parse(p.ghs_pictograms) : p.ghs_pictograms) : []);
        
        const nfpaHealth = p.nfpa ? p.nfpa.health : (p.nfpa_health || 0);
        const nfpaFlammability = p.nfpa ? p.nfpa.flammability : (p.nfpa_flammability || 0);
        const nfpaInstability = p.nfpa ? p.nfpa.instability : (p.nfpa_instability || 0);
        const nfpaSpecial = p.nfpa ? p.nfpa.special : (p.nfpa_special || "");

        await client.query(`
          INSERT INTO products (
            id, name, formula, grade, cas, purity, description, price, unit, stock, category_id,
            image, physical_state, boiling_point, melting_point, molecular_weight, ghs_pictograms,
            nfpa_health, nfpa_flammability, nfpa_instability, nfpa_special
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            formula = EXCLUDED.formula,
            grade = EXCLUDED.grade,
            cas = EXCLUDED.cas,
            purity = EXCLUDED.purity,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            unit = EXCLUDED.unit,
            category_id = EXCLUDED.category_id,
            image = EXCLUDED.image,
            physical_state = EXCLUDED.physical_state,
            boiling_point = EXCLUDED.boiling_point,
            melting_point = EXCLUDED.melting_point,
            molecular_weight = EXCLUDED.molecular_weight,
            ghs_pictograms = EXCLUDED.ghs_pictograms,
            nfpa_health = EXCLUDED.nfpa_health,
            nfpa_flammability = EXCLUDED.nfpa_flammability,
            nfpa_instability = EXCLUDED.nfpa_instability,
            nfpa_special = EXCLUDED.nfpa_special
        `, [
          p.id,
          p.name,
          p.formula || "",
          p.grade || "",
          p.cas || "",
          p.purity || "",
          p.description || "",
          p.price,
          p.unit || "",
          p.stock || 50,
          catId,
          p.image || "",
          physicalState,
          boilingPoint,
          meltingPoint,
          molecularWeight,
          JSON.stringify(ghsPics),
          nfpaHealth,
          nfpaFlammability,
          nfpaInstability,
          nfpaSpecial || ""
        ]);
      }
    }

    await client.query("COMMIT");
    const paymentMethodsCheck = await client.query("SELECT COUNT(*) FROM payment_methods");
    if (parseInt(paymentMethodsCheck.rows[0].count) === 0) {
      console.log("Seeding initial payment methods...");
      await client.query(`
        INSERT INTO payment_methods (id, name, type, is_active, details) VALUES
        ('pm_manual_1', 'Manual Bank Transfer / UPI', 'manual', true, $1::jsonb)
      `, [JSON.stringify({
          instructions: "Please manually transfer the exact order amount to the bank account below. Include your Order ID in the payment reference.\n\nUPI ID: flaskia@bank\nAccount Holder: Flaskia Labs Logistics\nBank Name: Central Bank\nAccount Number: 1234567890\nIFSC Code: CNRB0001234\n\nYour order will remain pending until payment is verified by our team."
      })]);
    }

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(
      "Failed to initialize or seed Neon PostgreSQL database:",
      error,
    );
    throw error;
  } finally {
    client.release();
  }
}
