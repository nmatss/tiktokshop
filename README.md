# TikTok Shop do Zero ao Caixa - Plataforma de Cursos

Plataforma completa de vendas e entrega de curso online com:
- Landing page de vendas
- Área de membros com player de vídeo
- Integração com Asaas para pagamentos PIX
- Painel administrativo para gerenciar conteúdo

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilos**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Pagamentos**: Asaas (PIX)
- **Deploy**: Vercel

## Estrutura do Projeto

```
├── app/
│   ├── (members)/              # Área de membros (layout protegido)
│   │   ├── app/
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── aulas/          # Listagem e player de aulas
│   │   │   ├── conta/          # Configurações da conta
│   │   │   ├── suporte/        # Página de suporte
│   │   │   └── admin/          # Painel administrativo
│   │   └── layout.tsx          # Layout da área de membros
│   ├── api/
│   │   ├── asaas/
│   │   │   ├── checkout/       # Criar cobrança
│   │   │   └── webhook/        # Receber eventos de pagamento
│   │   └── health/             # Health check
│   ├── checkout/               # Página de checkout
│   ├── login/                  # Login/Cadastro
│   ├── obrigado/               # Pós-compra
│   ├── terms/                  # Termos de uso
│   ├── privacy/                # Política de privacidade
│   └── page.tsx                # Landing page
├── components/                 # Componentes reutilizáveis
├── lib/
│   ├── supabase/               # Clientes Supabase
│   ├── asaas.ts                # Cliente Asaas
│   ├── auth.ts                 # Helpers de autenticação
│   ├── security.ts             # Validações e segurança
│   └── database.types.ts       # Tipos do banco
├── supabase/
│   └── migrations/             # Scripts SQL
└── middleware.ts               # Proteção de rotas
```

## Passo a Passo para Rodar

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd tiktokshop
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute a migration SQL:
   - Vá em **SQL Editor** no dashboard do Supabase
   - Cole o conteúdo de `supabase/migrations/001_init.sql`
   - Execute o script
3. Copie as credenciais de **Settings > API**

### 3. Configure o Asaas

1. Crie uma conta em [asaas.com](https://www.asaas.com)
2. Para desenvolvimento, use o ambiente **Sandbox**
3. Vá em **Integrações > API** e copie sua API Key
4. Configure o Webhook:
   - URL: `https://seu-dominio.com/api/asaas/webhook`
   - Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_REFUNDED`
   - Defina um token de segurança

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ASAAS_API_KEY=xxx
ASAAS_API_BASE_URL=https://sandbox.asaas.com/api/v3
ASAAS_WEBHOOK_TOKEN=seu-token-seguro

COURSE_SLUG_DEFAULT=tiktok-shop-do-zero
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 6. Criar usuário admin

No Supabase SQL Editor, execute:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

## Testes Manuais

### Fluxo de Compra (PIX)

1. Acesse `/checkout`
2. Preencha nome, email e CPF
3. Clique em "Pagar com PIX"
4. No sandbox do Asaas, simule o pagamento
5. Verifique se o webhook foi recebido (logs do servidor)
6. Confirme que o acesso foi liberado

### Idempotência do Webhook

1. Faça uma compra e aguarde confirmação
2. Envie o mesmo evento de webhook novamente
3. Confirme que não houve duplicação no banco

### Controle de Acesso

1. Crie um usuário sem comprar
2. Tente acessar `/app/aulas` - deve redirecionar para checkout
3. Confirme que `/app` (dashboard) é acessível
4. Após compra, `/app/aulas` deve funcionar

### Admin

1. Defina `role = 'admin'` no banco
2. Acesse `/app/admin` - deve funcionar
3. Teste criar/editar/excluir módulos e aulas
4. Confirme que usuários normais não acessam admin

### Player de Vídeo

1. Cadastre uma aula com vídeo do YouTube
2. Acesse a aula como aluno
3. Assista parte do vídeo
4. Navegue para outra página e volte
5. Confirme que o progresso foi salvo
6. Marque como concluída e verifique o progresso

## Segurança

### Implementada

- **RLS (Row Level Security)**: Todas as tabelas têm políticas de acesso
- **Validação de Webhook**: Token de autenticação obrigatório
- **Idempotência**: Eventos duplicados não causam problemas
- **Sanitização**: Inputs são sanitizados antes de uso
- **Rate Limiting**: Limites de requisições por IP
- **Service Role**: Usado apenas no backend

### Checklist de Produção

- [ ] Usar HTTPS em produção
- [ ] Configurar webhook no ambiente de produção do Asaas
- [ ] Rotacionar tokens periodicamente
- [ ] Configurar backup do banco de dados
- [ ] Monitorar logs de erro
- [ ] Configurar alertas para webhooks falhos

## Deploy na Vercel

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

```bash
vercel --prod
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```

## Personalização

### Alterar Cores

Edite `tailwind.config.ts`:

```ts
colors: {
  primary: {
    // Sua paleta de cores
  }
}
```

### Alterar Textos da Landing

Edite `app/page.tsx` - todos os textos estão inline para fácil edição.

### Adicionar Provedor de Vídeo

1. Edite `components/LessonPlayer.tsx`
2. Adicione o novo provider em `getEmbedUrl()`
3. Atualize o tipo em `database.types.ts`

## Suporte

Para dúvidas técnicas, abra uma issue no repositório.

## Licença

Projeto privado - todos os direitos reservados.
