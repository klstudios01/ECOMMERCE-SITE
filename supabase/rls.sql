-- ROW LEVEL SECURITY POLICIES FOR E-COMMERCE PLATFORM

-- ENABLE RLS ON PUBLIC AND SENSITIVE TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC ACCESS POLICIES (PRODUCTS, CATEGORIES, APPROVED REVIEWS)
CREATE POLICY "Public read active products" ON products
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public read product variants" ON product_variants
    FOR SELECT USING (true);

CREATE POLICY "Public read approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- 2. CUSTOMER SELF-SERVICE POLICIES (STRICTLY SCOPED BY AUTH.UID())

-- Profiles: user can only read/update their own profile
CREATE POLICY "Users read own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Customers: customer can read/update own record
CREATE POLICY "Customers read own record" ON customers
    FOR SELECT USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Addresses: customers manage only their own addresses
CREATE POLICY "Customers manage own addresses" ON addresses
    FOR ALL USING (
        customer_id IN (
            SELECT c.id FROM customers c 
            JOIN profiles p ON c.profile_id = p.id 
            WHERE p.user_id = auth.uid()
        )
    );

-- Orders: customers view only their own orders
CREATE POLICY "Customers view own orders" ON orders
    FOR SELECT USING (
        customer_id IN (
            SELECT c.id FROM customers c 
            JOIN profiles p ON c.profile_id = p.id 
            WHERE p.user_id = auth.uid()
        )
    );

-- Order Items: customers view items for their own orders
CREATE POLICY "Customers view own order items" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT o.id FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN profiles p ON c.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Wishlist & Items: user manages own wishlist
CREATE POLICY "Users manage own wishlist" ON wishlists
    FOR ALL USING (
        customer_id IN (
            SELECT c.id FROM customers c 
            JOIN profiles p ON c.profile_id = p.id 
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users manage own wishlist items" ON wishlist_items
    FOR ALL USING (
        wishlist_id IN (
            SELECT w.id FROM wishlists w
            JOIN customers c ON w.customer_id = c.id
            JOIN profiles p ON c.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Carts: user manages own cart
CREATE POLICY "Users manage own cart" ON carts
    FOR ALL USING (
        customer_id IN (
            SELECT c.id FROM customers c 
            JOIN profiles p ON c.profile_id = p.id 
            WHERE p.user_id = auth.uid()
        )
    );

-- Notifications: recipient views own notifications
CREATE POLICY "Recipient views own notifications" ON notifications
    FOR SELECT USING (
        recipient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- 3. ADMIN ROLE-BASED ACCESS POLICIES (SERVER SERVICE ROLE OR ADMIN ROLES)

-- Helper function to check if user has admin privileges
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users au
        JOIN profiles p ON au.profile_id = p.id
        WHERE p.user_id = user_uuid AND au.is_suspended = FALSE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins full management policies
CREATE POLICY "Admins full access to products" ON products
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins view all orders" ON orders
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins view all customers" ON customers
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins view audit logs" ON audit_logs
    FOR SELECT USING (is_admin(auth.uid()));
