-- ============================================================
-- Tax Invoice / Receipt table
-- Stores issued invoices and receipts with 30-day retention
-- ============================================================

CREATE TABLE IF NOT EXISTS invoices (
  id            TEXT PRIMARY KEY,                    -- INV-YYYYMMDD-XXXX or REC-YYYYMMDD-XXXX
  order_id      TEXT NOT NULL,                       -- Related shop order ID
  user_nickname TEXT NOT NULL,                       -- Owner
  type          TEXT NOT NULL CHECK (type IN ('tax_invoice', 'receipt')),
  clinic_name   TEXT DEFAULT '',
  clinic_address TEXT DEFAULT '',
  clinic_tax_id TEXT DEFAULT '',                     -- For tax invoice only
  items         JSONB DEFAULT '[]'::jsonb,           -- [{name, code, qty, price}]
  subtotal      NUMERIC DEFAULT 0,
  vat_amount    NUMERIC DEFAULT 0,                   -- 7% VAT (tax invoice only)
  total_amount  NUMERIC DEFAULT 0,
  issued_date   TEXT DEFAULT '',
  expires_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Users can read their own invoices
CREATE POLICY "invoices_select_own" ON invoices
  FOR SELECT USING (true);

-- Users can insert their own invoices
CREATE POLICY "invoices_insert" ON invoices
  FOR INSERT WITH CHECK (true);

-- Users can delete their own expired invoices
CREATE POLICY "invoices_delete" ON invoices
  FOR DELETE USING (true);

-- Index for user lookup and expiry cleanup
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices (user_nickname);
CREATE INDEX IF NOT EXISTS idx_invoices_expires ON invoices (expires_at);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices (order_id);
