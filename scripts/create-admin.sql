-- ============================================
-- Script para criar usuário administrador
-- Execute este script no Supabase SQL Editor
-- ============================================

-- PASSO 1: Primeiro, crie o usuário pelo Dashboard do Supabase
-- Vá em: Authentication > Users > Add User
-- Email: admin@tiktokshoppro.com.br
-- Password: Tk$h0p@Adm1n#2024!Pr0
-- Marque: Auto Confirm User

-- PASSO 2: Depois de criar o usuário, execute este SQL para torná-lo admin
-- Substitua 'admin@tiktokshoppro.com.br' pelo email do admin se for diferente

DO $$
DECLARE
    admin_user_id UUID;
    course_id UUID;
BEGIN
    -- Encontrar o usuário pelo email
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'admin@tiktokshoppro.com.br';

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado! Crie primeiro pelo Dashboard.';
    END IF;

    -- Atualizar ou criar perfil como admin
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (admin_user_id, 'admin@tiktokshoppro.com.br', 'Administrador', 'admin')
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        name = COALESCE(profiles.name, 'Administrador');

    RAISE NOTICE 'Perfil admin criado/atualizado para ID: %', admin_user_id;

    -- Dar acesso ao curso
    SELECT id INTO course_id
    FROM public.courses
    WHERE slug = 'tiktok-shop-do-zero'
    LIMIT 1;

    IF course_id IS NOT NULL THEN
        INSERT INTO public.entitlements (user_id, course_id, status, activated_at, expires_at)
        VALUES (admin_user_id, course_id, 'active', NOW(), NULL)
        ON CONFLICT (user_id, course_id) DO UPDATE SET
            status = 'active',
            expires_at = NULL;

        RAISE NOTICE 'Acesso ao curso concedido!';
    END IF;

    RAISE NOTICE '=========================================';
    RAISE NOTICE 'ADMIN CONFIGURADO COM SUCESSO!';
    RAISE NOTICE '=========================================';
END $$;

-- Verificar se o admin foi criado corretamente
SELECT
    p.id,
    p.email,
    p.name,
    p.role,
    p.created_at,
    CASE WHEN e.id IS NOT NULL THEN 'Sim' ELSE 'Não' END as tem_acesso_curso
FROM public.profiles p
LEFT JOIN public.entitlements e ON e.user_id = p.id AND e.status = 'active'
WHERE p.role = 'admin';
