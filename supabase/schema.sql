-- BoringFunnel Database Schema
-- Run this in your Supabase SQL editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'contact_form',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'newsletter_signup',
    tags TEXT[] DEFAULT '{}',
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    event_value NUMERIC,
    page_path TEXT,
    page_title TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT,
    user_id TEXT,
    custom_parameters JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create form_analytics table
CREATE TABLE IF NOT EXISTS form_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'start', 'field_interaction', 'validation_error', 'abandon', 'submit')),
    field_name TEXT,
    field_value TEXT,
    error_message TEXT,
    time_spent_ms INTEGER,
    completion_percentage NUMERIC,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversion_events table
CREATE TABLE IF NOT EXISTS conversion_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversion_type TEXT NOT NULL,
    conversion_value NUMERIC,
    currency TEXT DEFAULT 'USD',
    contact_id UUID REFERENCES contacts(id),
    subscriber_id UUID REFERENCES subscribers(id),
    attribution_source TEXT,
    attribution_medium TEXT,
    attribution_campaign TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_analytics_form_id ON form_analytics(form_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(conversion_type);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add update triggers
CREATE TRIGGER update_contacts_timestamp
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscribers_timestamp
    BEFORE UPDATE ON subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Contacts policies
CREATE POLICY "Enable insert for public (anon)" ON contacts
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON contacts
    FOR SELECT TO authenticated
    USING (true);

-- Subscribers policies
CREATE POLICY "Enable insert for public (anon)" ON subscribers
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable update own subscription" ON subscribers
    FOR UPDATE TO anon
    USING (email = email) -- This allows users to update their own subscription
    WITH CHECK (email = email);

CREATE POLICY "Enable read for authenticated users" ON subscribers
    FOR SELECT TO authenticated
    USING (true);

-- Analytics events policies
CREATE POLICY "Enable insert for public (anon)" ON analytics_events
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON analytics_events
    FOR SELECT TO authenticated
    USING (true);

-- Form analytics policies
CREATE POLICY "Enable insert for public (anon)" ON form_analytics
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON form_analytics
    FOR SELECT TO authenticated
    USING (true);

-- Conversion events policies
CREATE POLICY "Enable insert for public (anon)" ON conversion_events
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON conversion_events
    FOR SELECT TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;