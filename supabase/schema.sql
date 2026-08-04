-- ======================================================
-- BAGIRA PLANNER — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- ======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MASTERS TABLE
CREATE TABLE IF NOT EXISTS public.masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    avatar TEXT,
    color VARCHAR(20) DEFAULT '#8b5cf6',
    role VARCHAR(100) DEFAULT 'Стиліст',
    is_active BOOLEAN DEFAULT true,
    work_start TIME DEFAULT '09:00:00',
    work_end TIME DEFAULT '19:00:00',
    break_start TIME DEFAULT '13:00:00',
    break_end TIME DEFAULT '13:30:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL,
    buffer_minutes INT NOT NULL DEFAULT 15,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MASTER SPECIALTIES (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.master_specialties (
    master_id UUID REFERENCES public.masters(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (master_id, service_id)
);

-- 4. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    notes TEXT,
    visit_count INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, pending, in_progress, completed, cancelled
    notification_status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, disabled
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. APPOINTMENT SERVICES (Detailed items per service & master)
CREATE TABLE IF NOT EXISTS public.appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
    service_title VARCHAR(255) NOT NULL,
    master_id UUID REFERENCES public.masters(id) ON DELETE RESTRICT,
    master_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- INDEXES FOR FAST RANGE TIME QUERY & SEARCH
CREATE INDEX IF NOT EXISTS idx_appointments_time_range ON public.appointments (start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_appointment_services_master_time ON public.appointment_services (master_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients (phone);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to masters" ON public.masters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated staff full access" ON public.appointments FOR ALL USING (true);
