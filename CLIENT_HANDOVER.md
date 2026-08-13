# 🏆 KL STUDIOS LUXURY COMMERCE — CLIENT HANDOVER & OPERATIONAL MANUAL

Welcome to your production-ready e-commerce platform. This document serves as the official client introduction, credentials directory, and system operation manual.

---

## 🔐 ROLE-BASED ADMIN CREDENTIALS & TASK SCOPING

The Admin Portal enforces strict Role-Based Access Control (RBAC). Each admin role can **ONLY** view and manage the specific tasks assigned to it, while the **Super Admin (Main Admin)** has unrestricted access to all modules.

### 1. 👑 SUPER ADMIN (Main Admin — Unrestricted Access)
- **Login Email**: `admin@klstudios.com`
- **Password**: `admin123`
- **Assigned Scope**: **ALL PORTAL MODULES**
  - Executive Overview & Financial Analytics (`/admin`)
  - Developer Theme Engine & Brand Controls (`/admin/developer`)
  - Product Catalog & Variant CRUD (`/admin/products`)
  - Orders Queue, Fulfillment & Printable Invoices (`/admin/orders`)
  - Real-Time Variant Inventory & Stock Alerts (`/admin/inventory`)
  - Delivery Freight Zones & Shipping Rates (`/admin/delivery`)
  - Promo Vouchers & Discount Codes (`/admin/coupons`)
  - CMS Homepage Banner Editor (`/admin/content`)
  - Team Security & Sub-Admin Role Invites (`/admin/users`)
  - System Store Settings & Currency Config (`/admin/settings`)
  - Security Audit Trail Logs (`/admin/audit-logs`)

---

### 2. 📦 STORE MANAGER (Products, Inventory, Coupons & Banners)
- **Login Email**: `store.manager@klstudios.com`
- **Password**: `admin123`
- **Assigned Scope**: **CATALOG & MERCHANDISING ONLY**
  - Store Overview (`/admin`)
  - Product Catalog CRUD & Drag-and-Drop Image Uploader (`/admin/products`)
  - Real-Time Variant Inventory Matrix (`/admin/inventory`)
  - Promo Vouchers & Discount Code Creation (`/admin/coupons`)
  - CMS Banners & Homepage CTA Editor (`/admin/content`)
  - *Restricted*: No access to Team Users, Financial Settings, or Audit Logs.

---

### 3. 🚚 ORDER MANAGER (Fulfillment & Logistics Freight)
- **Login Email**: `orders@klstudios.com`
- **Password**: `admin123`
- **Assigned Scope**: **FULFILLMENT & SHIPPING FREIGHT ONLY**
  - Store Overview (`/admin`)
  - Orders Queue & Fulfillment Status Transitions (`/admin/orders`)
  - Printable Commercial Thermal Invoices & Dispatch Slips (`/admin/orders`)
  - Delivery Freight Zones & Shipping Rate Calculations (`/admin/delivery`)
  - *Restricted*: No access to Products CRUD, Coupons, CMS, Team Users, or Settings.

---

### 4. 🎨 CONTENT MANAGER (CMS Banners & Product Showcases)
- **Login Email**: `content.manager@klstudios.com`
- **Password**: `admin123`
- **Assigned Scope**: **CMS CONTENT & PRODUCT SHOWCASES ONLY**
  - Store Overview (`/admin`)
  - CMS Homepage Banners & Promotional Highlight Editor (`/admin/content`)
  - Product Catalogue Showcase (`/admin/products`)
  - *Restricted*: No access to Orders, Delivery Rates, Team Users, or Settings.

---

### 5. 💻 DEVELOPER PORTAL & THEME ENGINE ([/admin/developer](http://localhost:3000/admin/developer))
- **Developer Login Gate URL**: [http://localhost:3000/developer/login](http://localhost:3000/developer/login)
- **Developer Passcode Key**: `dev12345`
- **Capabilities**: Manage Store Name, Logo Mode (Text vs Image URL), Primary Color Palette, Global Copy & Marketing Texts, Feature Switches, Paystack API keys, and JSON Config Backup/Restore.

---

### 6. 🛍️ CUSTOMER STOREFRONT & CLIENT PORTAL
- **Storefront Home**: [http://localhost:3000](http://localhost:3000)
- **Shop Catalog**: [http://localhost:3000/shop](http://localhost:3000/shop)
- **Client Sign In**: [http://localhost:3000/login](http://localhost:3000/login)
- **Client Registration**: [http://localhost:3000/register](http://localhost:3000/register) *(Customers create their own accounts with their own email & password)*
- **Client Account Dashboard**: [http://localhost:3000/account](http://localhost:3000/account)

#### Demo Shopper Test Credentials:
- **Email**: `client@example.com`
- **Password**: `password123`

---

## 🎟️ TEST DISCOUNT CODES & PROMO VOUCHERS
- **`WELCOME10`**: 10% discount on orders over GH₵500.00
- **`SAVE200`**: GH₵200.00 fixed discount on orders over GH₵1,500.00

---

## 🚚 PRE-CONFIGURED DELIVERY FREIGHT ZONES (GHANA)
1. **Greater Accra Central**: GH₵35.00 (24–48 Hours) • Free on orders over GH₵2,000.00
2. **Tema & Environs**: GH₵45.00 (2–3 Days) • Free on orders over GH₵2,500.00
3. **Kumasi & Ashanti Region**: GH₵60.00 (3–4 Days)
4. **Other Regional Capitals**: GH₵85.00 (4–6 Days)
5. **Osu Flagship Store Pickup**: Free (Same Day)
