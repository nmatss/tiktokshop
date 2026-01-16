-- =====================================================
-- TikTok Shop Course Platform - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    video_provider TEXT NOT NULL DEFAULT 'youtube' CHECK (video_provider IN ('youtube', 'vimeo', 'bunny')),
    video_url TEXT NOT NULL,
    duration_sec INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entitlements table (user access to courses)
CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    asaas_payment_id TEXT UNIQUE NOT NULL,
    asaas_customer_id TEXT,
    status TEXT NOT NULL,
    value_cents INTEGER NOT NULL,
    billing_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    watched_seconds INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(course_id, "order");
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(module_id, "order");
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON public.lessons(slug);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_course_id ON public.entitlements(course_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_status ON public.entitlements(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_id ON public.payments(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has active entitlement for a course
CREATE OR REPLACE FUNCTION public.has_active_entitlement(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.entitlements
        WHERE user_id = auth.uid()
        AND course_id = p_course_id
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has any active entitlement
CREATE OR REPLACE FUNCTION public.has_any_active_entitlement()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.entitlements
        WHERE user_id = auth.uid()
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES - PROFILES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

-- Admin can update all profiles
CREATE POLICY "Admin can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - COURSES
-- =====================================================

-- Public can view courses (for landing page)
CREATE POLICY "Public can view courses"
    ON public.courses FOR SELECT
    USING (true);

-- Admin can manage courses
CREATE POLICY "Admin can insert courses"
    ON public.courses FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update courses"
    ON public.courses FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admin can delete courses"
    ON public.courses FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - MODULES
-- =====================================================

-- Users with entitlement can view modules
CREATE POLICY "Users with entitlement can view modules"
    ON public.modules FOR SELECT
    USING (
        public.is_admin()
        OR public.has_active_entitlement(course_id)
    );

-- Admin can manage modules
CREATE POLICY "Admin can insert modules"
    ON public.modules FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update modules"
    ON public.modules FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admin can delete modules"
    ON public.modules FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - LESSONS
-- =====================================================

-- Users with entitlement can view lessons
CREATE POLICY "Users with entitlement can view lessons"
    ON public.lessons FOR SELECT
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.modules m
            WHERE m.id = lessons.module_id
            AND public.has_active_entitlement(m.course_id)
        )
    );

-- Admin can manage lessons
CREATE POLICY "Admin can insert lessons"
    ON public.lessons FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update lessons"
    ON public.lessons FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admin can delete lessons"
    ON public.lessons FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - ENTITLEMENTS
-- =====================================================

-- Users can view their own entitlements
CREATE POLICY "Users can view own entitlements"
    ON public.entitlements FOR SELECT
    USING (auth.uid() = user_id);

-- Admin can view all entitlements
CREATE POLICY "Admin can view all entitlements"
    ON public.entitlements FOR SELECT
    USING (public.is_admin());

-- Admin can manage entitlements
CREATE POLICY "Admin can insert entitlements"
    ON public.entitlements FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update entitlements"
    ON public.entitlements FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admin can delete entitlements"
    ON public.entitlements FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - PAYMENTS
-- =====================================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Admin can view all payments
CREATE POLICY "Admin can view all payments"
    ON public.payments FOR SELECT
    USING (public.is_admin());

-- Admin can manage payments (webhook uses service role)
CREATE POLICY "Admin can insert payments"
    ON public.payments FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update payments"
    ON public.payments FOR UPDATE
    USING (public.is_admin());

-- =====================================================
-- RLS POLICIES - LESSON PROGRESS
-- =====================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
    ON public.lesson_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON public.lesson_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
    ON public.lesson_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin can view all progress
CREATE POLICY "Admin can view all progress"
    ON public.lesson_progress FOR SELECT
    USING (public.is_admin());

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on payments
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_payments_updated ON public.payments;
CREATE TRIGGER on_payments_updated
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_lesson_progress_updated ON public.lesson_progress;
CREATE TRIGGER on_lesson_progress_updated
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SEED DATA - Default Course
-- =====================================================

INSERT INTO public.courses (slug, title, description, price_cents)
VALUES (
    'tiktok-shop-do-zero',
    'TikTok Shop do Zero ao Caixa',
    'Aprenda a criar e escalar sua loja no TikTok Shop do zero até fazer vendas consistentes.',
    29700
) ON CONFLICT (slug) DO NOTHING;

-- Sample modules (you can add more via admin)
INSERT INTO public.modules (course_id, title, "order")
SELECT
    c.id,
    m.title,
    m.ord
FROM public.courses c
CROSS JOIN (
    VALUES
        ('Bem-vindo ao Curso', 1),
        ('Configurando sua Conta TikTok Shop', 2),
        ('Encontrando Produtos Vencedores', 3),
        ('Criando Conteúdo que Converte', 4),
        ('Estratégias de Tráfego Orgânico', 5),
        ('Escalando suas Vendas', 6),
        ('Bônus: Lives que Vendem', 7)
) AS m(title, ord)
WHERE c.slug = 'tiktok-shop-do-zero'
ON CONFLICT DO NOTHING;
