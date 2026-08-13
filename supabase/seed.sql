-- PRODUCTION SEED DATA FOR DEMO & TESTING ENVIRONMENT

-- 1. INITIAL ROLES & PERMISSIONS
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access and security administration permissions'),
('Store Manager', 'Manages products, catalog, inventory, orders, and customer relations'),
('Order Manager', 'Manages order processing, status updates, and delivery logistics'),
('Content Manager', 'Manages homepage banners, promotions, SEO, and CMS content')
ON CONFLICT (name) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, is_featured, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Audio & Acoustics', 'audio-acoustics', 'Premium wireless headphones, acoustic monitors, and audiophile gear', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', true, 1),
('c1000000-0000-0000-0000-000000000002', 'Wearable Tech', 'wearable-tech', 'Crafted smartwatches, wellness trackers, and luxury timepieces', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', true, 2),
('c1000000-0000-0000-0000-000000000003', 'Leather Goods', 'leather-goods', 'Handcrafted leather bags, wallets, and minimalist travel carry', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80', true, 3),
('c1000000-0000-0000-0000-000000000004', 'Apparel & Outerwear', 'apparel-outerwear', 'Tailored urban outerwear, luxury cotton hoodies, and streetwear essentials', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO products (id, name, slug, description, base_price, sale_price, sku, status, is_featured, is_new_arrival, is_best_seller, rating_avg, review_count) VALUES
('p1000000-0000-0000-0000-000000000001', 'Apex ANC Wireless Headphones', 'apex-anc-wireless-headphones', 'Precision acoustic engineering meets active noise cancellation. Features custom 40mm beryllium drivers, 40-hour continuous battery life, ultra-plush memory foam ear cushions, and lossless Bluetooth 5.3 streaming.', 1450.00, 1250.00, 'AUD-APX-001', 'published', true, true, true, 4.90, 38),
('p1000000-0000-0000-0000-000000000002', 'Chronos Sapphire Smartwatch', 'chronos-sapphire-smartwatch', 'Forged from Grade 5 titanium with scratch-resistant sapphire crystal glass. Real-time biometric monitoring, standalone GPS tracking, 100m water resistance, and an AMOLED high-brightness display.', 2400.00, NULL, 'WRB-CHR-002', 'published', true, false, true, 4.85, 24),
('p1000000-0000-0000-0000-000000000003', 'Nomad Full-Grain Leather Weekender', 'nomad-leather-weekender', 'Handmade from vegetable-tanned Italian full-grain leather. Designed for effortless weekend getaways with dedicated laptop compartment, shoe gallery, solid brass hardware, and YKK Excella zippers.', 1850.00, 1650.00, 'LTH-NMD-003', 'published', true, true, false, 4.95, 19),
('p1000000-0000-0000-0000-000000000004', 'Urban Heavyweight Fleece Hoodie', 'urban-heavyweight-fleece-hoodie', 'Meticulously knit from 480 GSM organic combed cotton. Pre-shrunk relaxed fit, reinforced double-stitched seams, custom silver-tone eyelets, and kangaroo pouch pocket.', 680.00, NULL, 'APP-HOO-004', 'published', false, true, true, 4.75, 42)
ON CONFLICT (slug) DO NOTHING;

-- PRODUCT CATEGORY MAPPING
INSERT INTO product_categories (product_id, category_id) VALUES
('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001'),
('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002'),
('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003'),
('p1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- PRODUCT IMAGES
INSERT INTO product_images (id, product_id, url, alt_text, display_order, is_primary) VALUES
('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'Apex ANC Headphones Matte Black', 0, true),
('i1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80', 'Apex ANC Headphones Audio Details', 1, false),
('i1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', 'Chronos Sapphire Smartwatch Front', 0, true),
('i1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80', 'Nomad Full-Grain Leather Weekender Tan', 0, true),
('i1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', 'Urban Heavyweight Hoodie Charcoal', 0, true)
ON CONFLICT DO NOTHING;

-- PRODUCT VARIANTS
INSERT INTO product_variants (id, product_id, sku, title, options, price, stock_quantity, image_url) VALUES
('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'AUD-APX-BLK', 'Matte Black', '{"Color": "Matte Black"}', 1250.00, 25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'),
('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'AUD-APX-SLV', 'Silver Titanium', '{"Color": "Silver Titanium"}', 1250.00, 14, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80'),
('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000002', 'WRB-CHR-BLK-O', 'Midnight Onyx', '{"Color": "Midnight Onyx"}', 2400.00, 10, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'),
('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000003', 'LTH-NMD-COG', 'Cognac Brown', '{"Color": "Cognac Brown"}', 1650.00, 8, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80'),
('v1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000004', 'APP-HOO-BLK-M', 'Charcoal Black / Medium', '{"Color": "Charcoal Black", "Size": "Medium"}', 680.00, 30, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80'),
('v1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000004', 'APP-HOO-BLK-L', 'Charcoal Black / Large', '{"Color": "Charcoal Black", "Size": "Large"}', 680.00, 20, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (sku) DO NOTHING;

-- 4. DELIVERY ZONES & RATES
INSERT INTO delivery_zones (id, name, description, estimated_delivery_days) VALUES
('z1000000-0000-0000-0000-000000000001', 'Greater Accra Central', 'Express door delivery within Accra metro', '24 - 48 Hours'),
('z1000000-0000-0000-0000-000000000002', 'Tema & Environs', 'Standard delivery to Tema, Kpone, and Ashaiman', '2 - 3 Days'),
('z1000000-0000-0000-0000-000000000003', 'Kumasi & Ashanti Region', 'Express regional freight to Kumasi urban centers', '3 - 4 Days'),
('z1000000-0000-0000-0000-000000000004', 'Other Regions (Nationwide)', 'Courier delivery to all other regional capitals in Ghana', '4 - 6 Days'),
('z1000000-0000-0000-0000-000000000005', 'Store Pickup (Osu Flagship)', 'Pick up directly at our flagship store in Osu, Accra', 'Same Day')
ON CONFLICT (name) DO NOTHING;

INSERT INTO delivery_rates (zone_id, rate, free_shipping_threshold, min_order_amount) VALUES
('z1000000-0000-0000-0000-000000000001', 35.00, 2000.00, 0.00),
('z1000000-0000-0000-0000-000000000002', 45.00, 2500.00, 0.00),
('z1000000-0000-0000-0000-000000000003', 60.00, 3000.00, 0.00),
('z1000000-0000-0000-0000-000000000004', 85.00, 3500.00, 0.00),
('z1000000-0000-0000-0000-000000000005', 0.00, 0.00, 0.00)
ON CONFLICT DO NOTHING;

-- 5. PROMO COUPONS
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, usage_limit, is_active) VALUES
('WELCOME10', 'percentage', 10.00, 500.00, 1000, true),
('SAVE200', 'fixed_amount', 200.00, 1500.00, 500, true),
('VIPCLIENT', 'percentage', 15.00, 2000.00, 200, true)
ON CONFLICT (code) DO NOTHING;

-- 6. STORE SETTINGS
INSERT INTO store_settings (store_name, logo_url, support_email, support_phone, store_address, currency) VALUES
('KL STUDIOS LUXURY COMMERCE', '/logo.png', 'concierge@klstudios.com', '+233 24 000 9999', 'Oxford Street, Osu, Accra, Ghana', 'GHS')
ON CONFLICT DO NOTHING;

-- 7. PROMOTIONAL BANNERS
INSERT INTO banners (title, subtitle, image_url, cta_text, cta_link, is_active, display_order) VALUES
('THE LUXURY COLLECTION', 'Experience uncompromising craftsmanship and acoustic brilliance.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80', 'Shop Catalog', '/shop', true, 1),
('TIMEOFF TRAVEL CARRY', 'Full-grain Italian weekender bags engineered for a lifetime.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80', 'Discover Carry', '/shop?category=leather-goods', true, 2)
ON CONFLICT DO NOTHING;
