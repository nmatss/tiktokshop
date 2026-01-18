/**
 * Script para criar o usuário administrador
 *
 * Execute com: npx tsx scripts/setup-admin.ts
 *
 * IMPORTANTE: Configure as variáveis de ambiente antes de executar:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// Credenciais do Administrador
// ALTERE ESTAS CREDENCIAIS ANTES DE USAR EM PRODUÇÃO!
const ADMIN_CONFIG = {
  email: 'admin@tiktokshoppro.com.br',
  password: 'Tk$h0p@Adm1n#2024!Pr0', // Senha forte: 20+ caracteres, maiúsculas, minúsculas, números, símbolos
  name: 'Administrador',
}

async function setupAdmin() {
  console.log('='.repeat(60))
  console.log('  SETUP DO ADMINISTRADOR - TikTok Shop Pro')
  console.log('='.repeat(60))
  console.log()

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('ERRO: Variáveis de ambiente não configuradas!')
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  // Criar cliente Supabase com service role (acesso total)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('1. Verificando se o admin já existe...')

  // Verificar se usuário já existe
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingAdmin = existingUsers?.users.find(
    (u) => u.email?.toLowerCase() === ADMIN_CONFIG.email.toLowerCase()
  )

  if (existingAdmin) {
    console.log(`   Usuario encontrado: ${existingAdmin.email}`)

    // Verificar se já é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', existingAdmin.id)
      .single()

    if (profile?.role === 'admin') {
      console.log('   Status: Já é administrador!')
      console.log()
      console.log('='.repeat(60))
      console.log('  CREDENCIAIS DO ADMINISTRADOR')
      console.log('='.repeat(60))
      console.log(`  Email: ${ADMIN_CONFIG.email}`)
      console.log(`  Senha: (use a senha existente ou redefina no Supabase)`)
      console.log('='.repeat(60))
      process.exit(0)
    }

    // Atualizar para admin
    console.log('2. Atualizando permissões para admin...')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin', name: ADMIN_CONFIG.name })
      .eq('id', existingAdmin.id)

    if (updateError) {
      console.error('   ERRO ao atualizar perfil:', updateError.message)
      process.exit(1)
    }

    console.log('   Permissões atualizadas com sucesso!')
  } else {
    console.log('   Usuario não encontrado. Criando novo admin...')

    // Criar novo usuário
    console.log('2. Criando usuário no Supabase Auth...')
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_CONFIG.email,
      password: ADMIN_CONFIG.password,
      email_confirm: true, // Confirma email automaticamente
      user_metadata: {
        name: ADMIN_CONFIG.name,
      },
    })

    if (createError) {
      console.error('   ERRO ao criar usuário:', createError.message)
      process.exit(1)
    }

    console.log(`   Usuario criado: ${newUser.user.id}`)

    // Criar/atualizar perfil como admin
    console.log('3. Configurando perfil como administrador...')
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: newUser.user.id,
      email: ADMIN_CONFIG.email,
      name: ADMIN_CONFIG.name,
      role: 'admin',
    })

    if (profileError) {
      console.error('   ERRO ao criar perfil:', profileError.message)
      process.exit(1)
    }

    console.log('   Perfil admin criado com sucesso!')
  }

  // Dar acesso ao curso para o admin
  console.log('4. Concedendo acesso ao curso...')

  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', 'tiktok-shop-do-zero')
    .single()

  if (course) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', ADMIN_CONFIG.email)
      .single()

    if (adminProfile) {
      await supabase.from('entitlements').upsert({
        user_id: adminProfile.id,
        course_id: course.id,
        status: 'active',
        activated_at: new Date().toISOString(),
        expires_at: null, // Acesso vitalício
      })
      console.log('   Acesso ao curso concedido!')
    }
  }

  console.log()
  console.log('='.repeat(60))
  console.log('  SETUP CONCLUÍDO COM SUCESSO!')
  console.log('='.repeat(60))
  console.log()
  console.log('  CREDENCIAIS DO ADMINISTRADOR:')
  console.log('  ────────────────────────────')
  console.log(`  Email:    ${ADMIN_CONFIG.email}`)
  console.log(`  Senha:    ${ADMIN_CONFIG.password}`)
  console.log()
  console.log('  IMPORTANTE:')
  console.log('  - Altere a senha após o primeiro login')
  console.log('  - Não compartilhe estas credenciais')
  console.log('  - Guarde em local seguro')
  console.log()
  console.log('  ACESSO:')
  console.log('  1. Vá para /login')
  console.log('  2. Use as credenciais acima')
  console.log('  3. Acesse /app/admin para o painel administrativo')
  console.log()
  console.log('='.repeat(60))
}

setupAdmin().catch(console.error)
